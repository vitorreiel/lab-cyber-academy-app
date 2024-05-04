package main

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/gorilla/websocket"
	"golang.org/x/crypto/ssh"
)

const (
	messageWait    = 10 * time.Second
	maxMessageSize = 512
)

var terminalModes = ssh.TerminalModes{
	ssh.ECHO:          1,
	ssh.TTY_OP_ISPEED: 14400,
	ssh.TTY_OP_OSPEED: 14400,
}

var wsUpgrader = websocket.Upgrader{
	ReadBufferSize:  maxMessageSize,
	WriteBufferSize: maxMessageSize,
}

type windowSize struct {
	High  int `json:"high"`
	Width int `json:"width"`
}

type sshClient struct {
	conn       *websocket.Conn
	addr       string
	user       string
	secret     string
	client     *ssh.Client
	session    *ssh.Session
	sessionIn  io.WriteCloser
	sessionOut io.Reader
	closeSig   chan struct{}
}

func (c *sshClient) getWindowSize() (wdSize *windowSize, err error) {
	c.conn.SetReadDeadline(time.Now().Add(messageWait))
	msgType, msg, err := c.conn.ReadMessage()
	if msgType != websocket.BinaryMessage {
		err = fmt.Errorf("conn.ReadMessage: message type is not binary")
		return
	}
	if err != nil {
		err = fmt.Errorf("conn.ReadMessage: %w", err)
		return
	}

	wdSize = new(windowSize)
	if err = json.Unmarshal(msg, wdSize); err != nil {
		err = fmt.Errorf("json.Unmarshal: %w", err)
		return
	}
	return
}

func (c *sshClient) wsWrite() error {
	defer func() {
		c.closeSig <- struct{}{}
	}()

	data := make([]byte, maxMessageSize, maxMessageSize)

	for {
		time.Sleep(10 * time.Millisecond)
		n, readErr := c.sessionOut.Read(data)
		if n > 0 {
			c.conn.SetWriteDeadline(time.Now().Add(messageWait))
			if err := c.conn.WriteMessage(websocket.TextMessage, data[:n]); err != nil {
				return fmt.Errorf("conn.WriteMessage: %w", err)
			}
		}
		if readErr != nil {
			return fmt.Errorf("sessionOut.Read: %w", readErr)
		}
	}
}

func (c *sshClient) wsRead() error {
	defer func() {
		c.closeSig <- struct{}{}
	}()

	var zeroTime time.Time
	c.conn.SetReadDeadline(zeroTime)

	for {
		msgType, connReader, err := c.conn.NextReader()
		if err != nil {
			return fmt.Errorf("conn.NextReader: %w", err)
		}
		if msgType != websocket.BinaryMessage {
			if _, err := io.Copy(c.sessionIn, connReader); err != nil {
				return fmt.Errorf("io.Copy: %w", err)
			}
			continue
		}

		data := make([]byte, maxMessageSize, maxMessageSize)
		n, err := connReader.Read(data)
		if err != nil {
			return fmt.Errorf("connReader.Read: %w", err)
		}

		var wdSize windowSize
		if err := json.Unmarshal(data[:n], &wdSize); err != nil {
			return fmt.Errorf("json.Unmarshal: %w", err)
		}

		if err := c.session.WindowChange(wdSize.High, wdSize.Width); err != nil {
			return fmt.Errorf("session.WindowChange: %w", err)
		}
	}
}

func (c *sshClient) bridgeWSAndSSH() {
	defer c.conn.Close()

	config := &ssh.ClientConfig{
		User: c.user,
		Auth: []ssh.AuthMethod{
			ssh.Password(c.secret),
		},
		HostKeyCallback: ssh.InsecureIgnoreHostKey(),
	}
	var err error
	c.client, err = ssh.Dial("tcp", c.addr, config)
	if err != nil {
		log.Println("bridgeWSAndSSH: ssh.Dial:", err)
		return
	}
	defer c.client.Close()

	c.session, err = c.client.NewSession()
	if err != nil {
		log.Println("bridgeWSAndSSH: client.NewSession:", err)
		return
	}
	defer c.session.Close()

	c.session.Stderr = os.Stderr
	c.sessionOut, err = c.session.StdoutPipe()
	if err != nil {
		log.Println("bridgeWSAndSSH: session.StdoutPipe:", err)
		return
	}

	c.sessionIn, err = c.session.StdinPipe()
	if err != nil {
		log.Println("bridgeWSAndSSH: session.StdinPipe:", err)
		return
	}
	defer c.sessionIn.Close()

	if err := c.session.RequestPty("xterm", 0, 0, terminalModes); err != nil {
		log.Println("bridgeWSAndSSH: session.RequestPty:", err)
		return
	}
	if err := c.session.Shell(); err != nil {
		log.Println("bridgeWSAndSSH: session.Shell:", err)
		return
	}

	log.Println("started a login shell on the remote host")
	defer log.Println("closed a login shell on the remote host")

	go func() {
		if err := c.wsRead(); err != nil {
			log.Println("bridgeWSAndSSH: wsRead:", err)
		}
	}()

	go func() {
		if err := c.wsWrite(); err != nil {
			log.Println("bridgeWSAndSSH: wsWrite:", err)
		}
	}()

	<-c.closeSig
}

type sshHandler struct {
	addr   string
	user   string
	secret string
}

func (h *sshHandler) webSocket(w http.ResponseWriter, req *http.Request) {
	conn, err := wsUpgrader.Upgrade(w, req, nil)
	if err != nil {
		log.Println("wsUpgrader.Upgrade:", err)
		return
	}

	sshClient := &sshClient{
		conn:     conn,
		addr:     h.addr,
		user:     h.user,
		secret:   h.secret,
		closeSig: make(chan struct{}, 1),
	}

	go sshClient.bridgeWSAndSSH()

	// Lendo o JSON recebido do frontend
	var requestData struct {
		Laboratory string `json:"laboratory"`
	}
	err = conn.ReadJSON(&requestData)
	if err != nil {
		log.Println("Error reading JSON:", err)
		return
	}

	// Verificando o laboratório e executando o script correspondente
	var scriptPath string
	switch requestData.Laboratory {
	case "01":
		scriptPath = "/opt/labs/laboratory-01/start-lab.sh"
	case "02":
		scriptPath = "/opt/labs/laboratory-02/start-lab.sh"
	default:
		log.Println("Invalid laboratory:", requestData.Laboratory)
		return
	}

	// Executando o script no servidor remoto via SSH
	err = sshClient.executeScript(scriptPath)
	if err != nil {
		log.Println("Error executing script:", err)
		return
	}

	// Enviar o resultado para o frontend
	result := struct {
		Laboratory string `json:"laboratory"`
	}{Laboratory: requestData.Laboratory}

	err = conn.WriteJSON(result)
	if err != nil {
		log.Println("Error writing JSON response:", err)
	}
}

func (c *sshClient) executeScript(scriptPath string) error {
	config := &ssh.ClientConfig{
		User: c.user,
		Auth: []ssh.AuthMethod{
			ssh.Password(c.secret),
		},
		HostKeyCallback: ssh.InsecureIgnoreHostKey(),
	}

	client, err := ssh.Dial("tcp", c.addr, config)
	if err != nil {
		return fmt.Errorf("ssh.Dial: %w", err)
	}
	defer client.Close()

	session, err := client.NewSession()
	if err != nil {
		return fmt.Errorf("client.NewSession: %w", err)
	}
	defer session.Close()

	session.Stdout = os.Stdout
	session.Stderr = os.Stderr

	err = session.Start(scriptPath)
	if err != nil {
		return fmt.Errorf("session.Start: %w", err)
	}

	err = session.Wait()
	if err != nil {
		return fmt.Errorf("session.Wait: %w", err)
	}

	return nil // Indicar que a execução foi concluída sem erros
}

