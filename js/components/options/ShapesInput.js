import { useId } from "react";
import html from "../../utils/html.js";

/**
 * @typedef {{
 *   shapes: import("../canvas/sketch/sketch.js").PaintOptions["shapes"];
 *   onChange: (newShapes: import("../canvas/sketch/sketch.js").PaintOptions["shapes"]) => void;
 * }} Props
 */

/**
 * @type {import("react").FC<Props>}
 */
const ShapesInput = ({ shapes, onChange }) => {
  const idPrefix = useId();

  return html`
    <div className="shapes-input">
      ${Object.entries(shapes).map(([shapeName, checked]) => {
        const id = `${idPrefix}-${shapeName}`;

        return html`
          <label key=${shapeName} htmlFor=${id} title=${`enable ${shapeName} shapes`}>
            <input
              type="checkbox"
              id=${id}
              checked=${checked}
              onChange=${
                /** @type {import("react").ChangeEventHandler<HTMLInputElement>} */ ({
                  target
                }) => {
                  onChange({ ...shapes, [shapeName]: target.checked });
                }
              }
            />
            ${shapeName}
          </label>
        `;
      })}
    </div>
  `;
};

export default ShapesInput;
