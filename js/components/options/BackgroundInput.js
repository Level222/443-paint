import html from "../../utils/html.js";
import SliderWithTextBox from "../slider-with-text-box/SliderWithTextBox.js";

/**
 * @typedef {{
 *   background: import("../canvas/sketch/sketch.js").PaintOptions["background"];
 *   onChange: (newBackground: import("../canvas/sketch/sketch.js").PaintOptions["background"]) => void;
 * }} Props
 */

/**
 * @type {import("react").FC<Props>}
 */
const BackgroundInput = ({ background, onChange }) => {
  return html`
    <div className="background-input">
      background
      <input
        type="color"
        value=${background.rgb}
        onChange=${
          /** @type {import("react").ChangeEventHandler<HTMLInputElement>} */ ({
            target
          }) => {
            onChange({ ...background, rgb: target.value });
          }
        }
        title="background color"
      />
      <${SliderWithTextBox}
        title="opacity of the background color"
        value=${background.alpha}
        min=${0}
        max=${255}
        onChange=${(/** @type {number} */ alpha) => {
          onChange({ ...background, alpha });
        }}
      />
    </div>
  `;
};

export default BackgroundInput;
