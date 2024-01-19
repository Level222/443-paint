import html from "../../utils/html.js";
import ShapesInput from "./ShapesInput.js";
import SliderWithTextBox from "../slider-with-text-box/SliderWithTextBox.js";
import RangeSliderWithTextBox from "../slider-with-text-box/RangeSliderWithTextBox.js";
import ColorsInput from "./ColorsInput.js";
import ImagesInput from "./ImagesInput.js";

/**
 * @typedef {{
 *   drawing: import("../canvas/sketch/sketch.js").PaintOptions["drawing"];
 *   onChange: (newValue: import("../canvas/sketch/sketch.js").PaintOptions["drawing"]) => void;
 * }} Props
 */

/**
 * @type {import("react").FC<Props>}
 */
const DrawingInput = ({ drawing, onChange }) => {
  return html`
    <div className="drawing-options">
      <${ShapesInput}
        shapes=${drawing.shapes}
        onChange=${(
          /** @type {import("../canvas/sketch/sketch.js").PaintOptions["drawing"]["shapes"]} */ shapes
        ) => {
          onChange({ ...drawing, shapes });
        }}
      />
      <${ImagesInput}
        images=${drawing.images}
        onChange=${(
          /** @type {import("../canvas/sketch/sketch.js").PaintOptions["drawing"]["images"]} */ images
        ) => {
          onChange({ ...drawing, images });
        }}
      />
      <div className="number-options-grid">
        size
        <${RangeSliderWithTextBox}
          title="size of shapes"
          value=${[drawing.minSize, drawing.maxSize]}
          min=${0}
          max=${150}
          onChange=${(/** @type {[number, number]} */ [minSize, maxSize]) => {
            onChange({ ...drawing, minSize, maxSize });
          }}
        />
        spread
        <${SliderWithTextBox}
          title="spread of shapes"
          value=${drawing.spread}
          min=${0}
          max=${500}
          onChange=${(/** @type {number} */ spread) => {
            onChange({ ...drawing, spread });
          }}
        />
        <${ColorsInput}
          colors=${drawing.colors}
          onChange=${(
            /** @type {import("../canvas/sketch/sketch.js").PaintOptions["drawing"]["colors"]} */ colors
          ) => {
            onChange({ ...drawing, colors });
          }}
        />
      </div>
    </div>
  `;
};

export default DrawingInput;
