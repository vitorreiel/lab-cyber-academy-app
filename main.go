package main

import (
	"errors"
	"flag"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/BurntSushi/toml"
)

type config struct {
	Host     string `toml:"host"`
	Port     uint   `toml:"port"`
	User     string `toml:"user"`
	Password string `toml:"password"`
}

func main() {
	var (
		host       string
		port       uint
		user       string
		password   string
		configPath string
	)
	hostUsage := "the destination address (required if no config file)"
	portUsage := "the connection port"
	portDefualt := uint(22)
	userUsage := "the username (required if no config file)"
	passwordUsage := "the user's password"
	configPathUsage := "the path of config file (ignore other args if a config file exists)"
	configPathDefualt := "./connection.toml"

	flag.StringVar(&host, "t", "", hostUsage)
	flag.UintVar(&port, "p", portDefualt, portUsage)
	flag.StringVar(&user, "u", "", userUsage)
	flag.StringVar(&password, "s", "", passwordUsage)
	flag.StringVar(&configPath, "c", configPathDefualt, configPathUsage)

	flag.Parse()

	var cfg config
	var handler *sshHandler
	if _, err := toml.DecodeFile(configPath, &cfg); errors.Is(err, os.ErrNotExist) {
		if host == "" {
			log.Fatal("target host cannot be empty")
		}
		if user == "" {
			log.Fatal("login user cannot be empty")
		}
		if password == "" {
			log.Fatal("login password cannot be empty")
		}
		addr := fmt.Sprintf("%s:%d", host, port)
		handler = &sshHandler{addr: addr, user: user, secret: password}
	} else if err != nil {
		log.Fatal("could not parse config file: ", err)
	} else {
		addr := fmt.Sprintf("%s:%d", cfg.Host, cfg.Port)
		handler = &sshHandler{addr: addr, user: cfg.User, secret: cfg.Password}
	}

	http.Handle("/", http.FileServer(http.Dir("./frontend/")))
	http.HandleFunc("/web-socket/ssh", handler.webSocket)
	log.Fatal(http.ListenAndServe(":9000", nil))
}
