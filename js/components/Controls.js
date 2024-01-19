import { useState } from "react";
import html from "../utils/html.js";
import InstantSelectTextBox from "./InstantSelectTextBox.js";
import Download from "./svg/Download.js";
import Trash from "./svg/Trash.js";
import RotateLeft from "./svg/RotateRight.js";
import RotateRight from "./svg/RotateLeft.js";

/**
 * @typedef {{
 *   onMessage?: (message: import("./canvas/sketch/sketch.js").PaintMessage) => void;
 * }} Props
 */

/**
 * @type {import("react").FC<Props>}
 */
const Controls = ({ onMessage }) => {
  const [filename, setFilename] = useState("untitled");
  const [extension, setExtension] = useState("png");

  return html`
    <div className="controls">
      <div className="controls-section">
        <${InstantSelectTextBox}
          type="text"
          title="filename"
          className="filename-input"
          value=${filename}
          onChange=${
            /** @type {import("react").ChangeEventHandler<HTMLInputElement>} */ ({
              target
            }) => {
              setFilename(target.value);
            }
          }
        />
        <select
          title="extension"
          value=${extension}
          onChange=${
            /** @type {import("react").ChangeEventHandler<HTMLSelectElement>} */ ({
              target
            }) => {
              setExtension(target.value);
            }
          }
        >
          <option value="png">.png</option>
          <option value="jpg">.jpg</option>
        </select>
        <button
          title="download"
          onClick=${() => {
            onMessage?.({ type: "download", filename, extension });
          }}
        >
          <${Download} />
        </button>
      </div>
      <div className="controls-section">
        <button
          title="back (Ctrl+Z)"
          onClick=${() => {
            onMessage?.({ type: "back" });
          }}
        >
          <${RotateLeft} />
        </button>
        <button
          title="forward (Ctrl+Shift+Z)"
          onClick=${() => {
            onMessage?.({ type: "forward" });
          }}
        >
          <${RotateRight} />
        </button>
        <button
          title="clear"
          onClick=${() => {
            onMessage?.({ type: "clear" });
          }}
        >
          <${Trash} />
        </button>
      </div>
    </div>
  `;
};

export default Controls;
