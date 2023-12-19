import html from "../../utils/html.js";
import ShapesInput from "./ShapesInput.js";
import SliderWithTextBox from "../slider-with-text-box/SliderWithTextBox.js";
import RangeSliderWithTextBox from "../slider-with-text-box/RangeSliderWithTextBox.js";
import ColorsInput from "./ColorsInput.js";
import BackgroundInput from "./BackgroundInput.js";
import ImagesInput from "./ImagesInput.js";

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
      <${ShapesInput}
        shapes=${options.shapes}
        onChange=${(
          /** @type {import("../canvas/sketch/sketch.js").PaintOptions["shapes"]} */ shapes
        ) => {
          onChange({ ...options, shapes });
        }}
      />
      <${ImagesInput}
        images=${options.images}
        onChange=${(
          /** @type {import("../canvas/sketch/sketch.js").PaintOptions["images"]} */ images
        ) => {
          onChange({ ...options, images });
        }}
      />
      <div className="number-options-grid">
        size
        <${RangeSliderWithTextBox}
          title="size of shapes"
          value=${[options.minSize, options.maxSize]}
          min=${0}
          max=${150}
          onChange=${(/** @type {[number, number]} */ [minSize, maxSize]) => {
            onChange({ ...options, minSize, maxSize });
          }}
        />
        spread
        <${SliderWithTextBox}
          title="spread of shapes"
          value=${options.spread}
          min=${0}
          max=${500}
          onChange=${(/** @type {number} */ spread) => {
            onChange({ ...options, spread });
          }}
        />
        <${ColorsInput}
          colors=${options.colors}
          onChange=${(
            /** @type {import("../canvas/sketch/sketch.js").PaintOptions["colors"]} */ colors
          ) => {
            onChange({ ...options, colors });
          }}
        />
        width
        <${SliderWithTextBox}
          title="canvas width"
          defaultValue=${options.width}
          min=${1}
          max=${5000}
          onChangeComplete=${(/** @type {number} */ width) => {
            onChange({ ...options, width });
          }}
        />
        height
        <${SliderWithTextBox}
          title="canvas height"
          defaultValue=${options.height}
          min=${1}
          max=${5000}
          onChangeComplete=${(/** @type {number} */ height) => {
            onChange({ ...options, height });
          }}
        />
      </div>
      <${BackgroundInput}
        background=${options.background}
        onChange=${(
          /** @type {import("../canvas/sketch/sketch.js").PaintOptions["background"]} */ background
        ) => {
          onChange({ ...options, background });
        }}
      />
    </div>
  `;
};

export default OptionsInput;
