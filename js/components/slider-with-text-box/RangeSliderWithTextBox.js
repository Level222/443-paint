import { forwardRef } from "react";
import html from "../../utils/html.js";
import useRcsliderWithTextBox from "./useRcsliderWithTextBox.js";

/**
 * @typedef {(
 *   Omit<
 *     import("./useRcsliderWithTextBox.js").SliderOptions<[number, number]>,
 *     "className" | "range" | "draggableTrack" | "allowCross"
 *   > & {
 *     title?: string;
 *   }
 * )} Props
 */

/**
 * @typedef {import("./useRcsliderWithTextBox.js").RcsliderWithTextBoxRef<[number, number]>} RangeSliderWithTextBoxRef
 */

/**
 * @type {import("react").ForwardRefRenderFunction<RangeSliderWithTextBoxRef, Props>}
 */
const RangeSliderWithTextBoxRefFunction = ({ title, ...sliderProps }, ref) => {
  const {
    slider,
    textBoxes: [startTextBox, endTextBox]
  } = /** @type {typeof useRcsliderWithTextBox<[number, number]>} */ (
    useRcsliderWithTextBox
  )({
    slider: {
      ...sliderProps,
      range: true,
      draggableTrack: true,
      allowCross: false
    },
    format: {
      from: (value) => value,
      to: (value) => [value[0], value[1]]
    },
    ref
  });

  return html`
    <div className="range-input" title=${title}>
      ${startTextBox}${slider}${endTextBox}
    </div>
  `;
};

const RangeSliderWithTextBox = forwardRef(RangeSliderWithTextBoxRefFunction);

export default RangeSliderWithTextBox;
