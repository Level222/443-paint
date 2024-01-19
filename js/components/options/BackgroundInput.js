import html from "../../utils/html.js";
import StyledFileInput from "../StyledFileInput.js";
import SliderWithTextBox from "../slider-with-text-box/SliderWithTextBox.js";
import { useState, useEffect, useRef } from "react";
import Radio from "../Radio.js";

/**
 * @typedef {{
 *   background: import("../canvas/sketch/sketch.js").PaintOptions["background"];
 *   onChange: (newBackground: import("../canvas/sketch/sketch.js").PaintOptions["background"]) => void;
 * }} Props
 */

/**
 * @typedef {{
 *   width: number;
 *   height: number;
 * }} ImageSize
 */

/**
 * @param {string} src
 * @returns {Promise<ImageSize>}
 */
const getImageSize = (src) =>
  new Promise((resolve) => {
    const image = new Image();

    image.addEventListener("load", () => {
      resolve({
        width: image.naturalWidth,
        height: image.naturalHeight
      });
    });

    image.src = src;
  });

/**
 * @type {import("react").FC<Props>}
 */
const BackgroundInput = ({ background, onChange }) => {
  const widthSliderRef = useRef(
    /** @type {import("../slider-with-text-box/SliderWithTextBox.js").SliderWithTextBoxRef | null} */ (
      null
    )
  );
  const heightSliderRef = useRef(
    /** @type {import("../slider-with-text-box/SliderWithTextBox.js").SliderWithTextBoxRef | null} */ (
      null
    )
  );

  const [currentImageSize, setCurrentImageSize] = useState(
    /** @type {ImageSize | null} */ (null)
  );

  useEffect(() => {
    getImageSize(background.src).then(setCurrentImageSize);
  }, []);

  /**
   * @type {import("react").ChangeEventHandler<HTMLInputElement>}
   */
  const handleFileChange = async ({ target }) => {
    if (!target.files) {
      return;
    }

    const [file] = target.files;

    if (!/^image\//.test(file.type)) {
      return;
    }

    const src = URL.createObjectURL(file);

    const imageSize = await getImageSize(src);

    setCurrentImageSize(imageSize);

    onChange({
      ...background,
      mode: "image",
      src,
      width: imageSize.width,
      height: imageSize.height
    });
  };

  return html`
    <div className="background-input">
      <${Radio}
        className="background-input-modes"
        name="background-mode"
        contents=${[
          {
            value: "color",
            content: html`
              color
              <input
                type="color"
                value=${background.rgb}
                onChange=${
                  /** @type {import("react").ChangeEventHandler<HTMLInputElement>} */ ({
                    target
                  }) => {
                    onChange({
                      ...background,
                      mode: "color",
                      rgb: target.value
                    });
                  }
                }
                title="background color"
              />
            `
          },
          {
            value: "image",
            content: html`
              image
              <${StyledFileInput}
                accept="image/*"
                title="background image"
                onChange=${handleFileChange}
              >
                <img src=${background.src} className="background-input-image" />
              <//>
            `
          }
        ]}
        value=${background.mode}
        onChange=${
          /**
           * @type {import("../Radio").Props<
           *   import("../canvas/sketch/sketch.js").PaintOptions["background"]["mode"]
           * >["onChange"]}
           */
          (mode) => {
            /**
             * @type {import("../canvas/sketch/sketch.js").PaintOptions["background"]}
             */
            const newBackground = { ...background, mode };

            if (mode === "image" && currentImageSize) {
              const { width, height } = currentImageSize;

              widthSliderRef.current?.setValue(width);
              heightSliderRef.current?.setValue(height);

              newBackground.width = width;
              newBackground.height = height;
            }

            onChange(newBackground);
          }
        }
      />
      <div className="number-options-grid">
        width
        <${SliderWithTextBox}
          ref=${widthSliderRef}
          title="canvas width"
          defaultValue=${background.width}
          min=${1}
          max=${5000}
          onChangeComplete=${(/** @type {number} */ width) => {
            onChange({ ...background, width });
          }}
        />
        height
        <${SliderWithTextBox}
          ref=${heightSliderRef}
          title="canvas height"
          defaultValue=${background.height}
          min=${1}
          max=${5000}
          onChangeComplete=${(/** @type {number} */ height) => {
            onChange({ ...background, height });
          }}
        />
        opacity
        <${SliderWithTextBox}
          title="opacity of the background color"
          value=${background.alpha}
          min=${0}
          max=${255}
          onChange=${(/** @type {number} */ alpha) => {
            onChange({ ...background, alpha });
          }}
        />
      </div>
    </div>
  `;
};

export default BackgroundInput;
