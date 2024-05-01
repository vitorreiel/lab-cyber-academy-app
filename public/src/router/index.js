import { useRouter } from "../hooks/useRouter";

import Home from "../pages/Home";
import Terminal from "../pages/Terminal";

const screenMap = {
  home: Home,
  terminal: Terminal
};

function Router() {
  const { page } = useRouter();

  const Screen = screenMap?.[page];

  if (!Screen) {
    return <div>Page not found</div>;
  }

  return <Screen />;
}

export default Router;
