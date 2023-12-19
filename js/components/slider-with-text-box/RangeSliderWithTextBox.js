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
 * @type {import("react").FC<Props>}
 */
const RangeSliderWithTextBox = ({ title, ...sliderProps }) => {
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
    }
  });

  return html`
    <div className="range-input" title=${title}>${startTextBox}${slider}${endTextBox}</div>
  `;
};

export default RangeSliderWithTextBox;
