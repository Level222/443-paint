import { useRef, useState } from "react";
import html from "../utils/html.js";
import PaintCanvas from "./canvas/PaintCanvas.js";
import OptionsInput from "./options/OptionsInput.js";
import Controls from "./Controls.js";
import Footer from "./Footer.js";

/**
 * @type {import("./canvas/sketch/sketch.js").PaintOptions}
 */
const defaultOptions = {
  drawing: {
    shapes: {
      circle: true,
      square: true,
      triangle: true
    },
    images: [
      { src: "./images/star.png", enabled: true, title: "star" },
      { src: "./images/heart.png", enabled: false, title: "heart" },
      { src: "./images/smile-face.png", enabled: false, title: "smile-face" }
    ],
    minSize: 10,
    maxSize: 40,
    spread: 50,
    colors: {
      red: {
        min: 0,
        max: 127
      },
      green: {
        min: 0,
        max: 255
      },
      blue: {
        min: 0,
        max: 255
      },
      alpha: {
        min: 32,
        max: 127
      }
    }
  },
  background: {
    width: 1200,
    height: 800,
    mode: "color",
    rgb: "#fafafa",
    src: "./images/mona-lisa.jpg",
    alpha: 255
  }
};

/**
 * @type {import("react").FC}
 */
const App = () => {
  const [options, setOptions] = useState(defaultOptions);
  const ref = useRef(
    /** @type {import("./canvas/PaintCanvas.js").PaintCanvasRef | null} */ (
      null
    )
  );

  /**
   * @param {import("./canvas/sketch/sketch.js").PaintOptions} newOptions
   */
  const handleChangeOptions = (newOptions) => {
    setOptions(newOptions);
  };

  return html`
    <main>
      <h1>443 Paint</h1>
      <${PaintCanvas} options=${options} ref=${ref} />
      <div className="canvas-detail">
        <${Controls}
          onMessage=${(
            /** @type {import("./canvas/sketch/sketch.js").PaintMessage} */ message
          ) => {
            ref.current?.sendMessage(message);
          }}
        />
        <${OptionsInput} options=${options} onChange=${handleChangeOptions} />
      </div>
    </main>
    <${Footer} />
  `;
};

export default App;
