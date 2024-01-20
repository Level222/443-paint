import html from "../../utils/html.js";
import RangeSliderWithTextBox from "../slider-with-text-box/RangeSliderWithTextBox.js";

/**
 * @typedef {{
 *   colors: import("../canvas/sketch/sketch.js").PaintOptions["drawing"]["colors"]
 *   onChange: (newColors: import("../canvas/sketch/sketch.js").PaintOptions["drawing"]["colors"]) => void;
 * }} Props
 */

/**
 * @type {import("react").FC<Props>}
 */
const ColorsInput = ({ colors, onChange }) => {
  return html`
    ${Object.entries(colors).map(
      ([colorName, { min, max }]) => html`
        ${colorName}
        <${RangeSliderWithTextBox}
          key=${colorName}
          title=${`${colorName} color range`}
          value=${[min, max]}
          min=${0}
          max=${255}
          onChange=${(/** @type {[number, number]}*/ [min, max]) => {
            onChange({ ...colors, [colorName]: { min, max } });
          }}
        />
      `
    )}
  `;
};

export default ColorsInput;
