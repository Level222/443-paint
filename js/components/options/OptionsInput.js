import html from "../../utils/html.js";
import BackgroundInput from "./BackgroundInput.js";
import DrawingInput from "./DrawingInput.js";
import OptionsGroup from "./OptionsGroup.js";

/**
 * @typedef {{
 *   options: import("../canvas/sketch/sketch.js").PaintOptions;
 *   onChange: (newValue: import("../canvas/sketch/sketch.js").PaintOptions) => void;
 * }} Props
 */

/**
 * @type {import("react").FC<Props>}
 */
const OptionsInput = ({ options, onChange }) => {
  return html`
    <div className="options">
      <${OptionsGroup} title="drawing">
        <${DrawingInput}
          drawing=${options.drawing}
          onChange=${(
            /** @type {import("../canvas/sketch/sketch.js").PaintOptions["drawing"]} */ drawing
          ) => {
            onChange({ ...options, drawing });
          }}
        />
      <//>
      <${OptionsGroup} title="background">
        <${BackgroundInput}
          background=${options.background}
          onChange=${(
            /** @type {import("../canvas/sketch/sketch.js").PaintOptions["background"]} */ background
          ) => {
            onChange({ ...options, background });
          }}
        />
      <//>
    </div>
  `;
};

export default OptionsInput;
