import { useId } from "react";
import html from "../utils/html.js";

/**
 * @typedef {Omit<import("react").JSX.IntrinsicElements["input"], "type" | "id" | "className">} Props
 */

/**
 * @type {import("react").FC<Props>}
 */
const StyledFileInput = ({ children, title, ...fileInputProps }) => {
  const id = useId();

  return html`
    <label for=${id} className="styled-file-input-label" title=${title}>
      ${children}
      <input type="file" id=${id} className="styled-file-input-file" ...${fileInputProps} />
    </label>
  `;
};

export default StyledFileInput;
