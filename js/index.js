import { createRoot } from "react-dom/client.js";
import html from "./utils/html.js";
import App from "./components/App.js";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new TypeError("Cannot find an element #root");
}

const root = createRoot(rootElement);

root.render(html`<${App} />`);
