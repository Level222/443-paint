import html from "../../utils/html.js";
import { arrayWith } from "../../utils/array-utils.js";
import StyledFileInput from "../StyledFileInput.js";
import { useId } from "react";
import PlusCircle from "../svg/PlusCircle.js";
import removeFilenameExtension from "../../utils/remove-filename-extension.js";

/**
 * @typedef {{
 *   images: import("../canvas/sketch/sketch.js").PaintOptions["drawing"]["images"]
 *   onChange: (newImages: import("../canvas/sketch/sketch.js").PaintOptions["drawing"]["images"]) => void;
 * }} Props
 */

/**
 * @type {import("react").FC<Props>}
 */
const ImagesInput = ({ images, onChange }) => {
  const idPrefix = useId();

  /**
   * @type {import("react").ChangeEventHandler<HTMLInputElement>}
   */
  const handleFileChange = ({ target }) => {
    if (!target.files) {
      return;
    }

    onChange([
      ...images,
      ...[...target.files].flatMap((file) =>
        /^image\//.test(file.type)
          ? [
              {
                src: URL.createObjectURL(file),
                enabled: true,
                title: removeFilenameExtension(file.name)
              }
            ]
          : []
      )
    ]);
  };

  return html`
    <div className="images-input">
      <div className="images-container">
        ${images.map(({ src, enabled, title }, index) => {
          const id = `${idPrefix}-${index}`;

          return html`
            <label key=${index} className="image-wrapper" htmlFor=${id}>
              <input
                type="checkbox"
                id=${id}
                checked=${enabled}
                onChange=${
                  /** @type {import("react").ChangeEventHandler<HTMLInputElement>} */ ({
                    target
                  }) => {
                    onChange(
                      arrayWith(images, index, {
                        src,
                        enabled: target.checked,
                        title
                      })
                    );
                  }
                }
              />
              <img src=${src} className="images-input-image" alt=${title} />
            </label>
          `;
        })}
      </div>
      <${StyledFileInput}
        accept="image/*"
        multiple
        title="add images"
        onChange=${handleFileChange}
      >
        <${PlusCircle} />
      <//>
    </div>
  `;
};

export default ImagesInput;
