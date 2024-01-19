import { forwardRef } from "react";
import html from "../../utils/html.js";
import useRcsliderWithTextBox from "./useRcsliderWithTextBox.js";

/**
 * @typedef {(
 *   Omit<
 *     import("./useRcsliderWithTextBox.js").SliderOptions<number>,
 *     "range"
 *   > & {
 *     title?: string;
 *   }
 * )} Props
 */

/**
 * @typedef {import("./useRcsliderWithTextBox.js").RcsliderWithTextBoxRef<number>} SliderWithTextBoxRef
 */

/**
 * @type {import("react").ForwardRefRenderFunction<SliderWithTextBoxRef, Props>}
 */
const SliderWithTextBoxRefFunction = ({ title, ...sliderProps }, ref) => {
  const {
    slider,
    textBoxes: [textBox]
  } = /** @type {typeof useRcsliderWithTextBox<number>} */ (
    useRcsliderWithTextBox
  )({
    slider: sliderProps,
    format: {
      from: (value) => [value],
      to: ([value]) => value
    },
    ref
  });

  return html`
    <div className="number-input" title=${title}>${slider}${textBox}</div>
  `;
};

const SliderWithTextBox = forwardRef(SliderWithTextBoxRefFunction);

export default SliderWithTextBox;
