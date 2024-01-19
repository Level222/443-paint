import { useId } from "react";
import html from "../utils/html.js";

/**
 * @template {string} T
 * @typedef {Omit<import("react").JSX.IntrinsicElements["div"], "onChange"> & {
 *   contents: {
 *     value: T;
 *     content: import("react").ReactNode;
 *   }[];
 *   onChange: (value: T) => void;
 *   value: T;
 *   name?: string;
 * }} Props
 */

/**
 * @template {string} T
 * @type {import("react").FC<Props<T>>}
 */
const Radio = ({ contents, onChange, value, name, className, ...containerProps }) => {
  const idBase = useId();

  return html`
    <div className=${`radio${className ? ` ${className}` : ""}`} ...${containerProps}>
      ${contents.map(({ value: contentValue, content }) => {
        const id = `${idBase}-${contentValue}`;

        return html`
          <label key=${contentValue} className="radio-label" for=${id}>
            <input
              className="radio-input"
              type="radio"
              name=${name || idBase}
              id=${id}
              value=${value}
              checked=${value === contentValue}
              onChange=${
                /** @type {import("react").ChangeEventHandler<HTMLInputElement>} */
                ({ target }) => {
                  if (target.checked) {
                    onChange(contentValue);
                  }
                }
              }
            />
            ${content}
          </label>
        `;
      })}
    </div>
  `;
};

export default Radio;
