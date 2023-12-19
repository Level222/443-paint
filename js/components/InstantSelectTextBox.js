import { forwardRef } from "react";
import html from "../utils/html.js";

/**
 * @typedef {import("react").JSX.IntrinsicElements["input"]} Props
 */

/**
 * @type {import("react").ForwardRefRenderFunction<Props>}
 */
const InstantSelectTextBoxRefFunction = ({ onClick, ...textBoxProps }, ref) => {
  /**
   * @type {import("react").MouseEventHandler<HTMLInputElement>}
   */
  const handleClick = (e) => {
    e.currentTarget.select();
    onClick?.(e);
  };

  return html`<input ...${textBoxProps} ref=${ref} onClick=${handleClick} />`;
};

const InstantSelectTextBox = forwardRef(InstantSelectTextBoxRefFunction);

export default InstantSelectTextBox;
