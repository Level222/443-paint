import html from "../../utils/html.js";

/**
 * @typedef {{
 *   title: string;
 *   children: import("react").ReactNode;
 * }} Props
 */

/**
 * @type {import("react").FC<Props>}
 */
const OptionsGroup = ({ title, children }) => {
  return html`
    <div>
      <div className="options-group-title">${title}</div>
      <div className="options-group-content">${children}</div>
    </div>
  `;
};

export default OptionsGroup;
