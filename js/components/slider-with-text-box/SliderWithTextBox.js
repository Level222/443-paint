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
 * @type {import("react").FC<Props>}
 */
const SliderWithTextBox = ({ title, ...sliderProps }) => {
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
    }
  });

  return html`
    <div className="number-input" title=${title}>${slider}${textBox}</div>
  `;
};

export default SliderWithTextBox;
