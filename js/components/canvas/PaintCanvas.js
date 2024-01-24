import { forwardRef } from "react";
import html from "../../utils/html.js";
import P5Canvas from "../p5-react/P5Canvas.js";
import sketch from "./sketch/sketch.js";
import calcCanvasMaxSize from "./calc-canvas-max-size.js";

/**
 * @typedef {(
 *   import("../p5-react/P5Canvas.js").P5CanvasRef<
 *     import("./sketch/sketch.js").PaintMessage
 *   >
 * )} PaintCanvasRef
 */

/**
 * @typedef {{
 *   options: import("./sketch/sketch.js").PaintOptions
 * }} Props
 */

/**
 * @type {import("react").ForwardRefRenderFunction<PaintCanvasRef, Props>}
 */
const PaintCanvasRefFunction = ({ options }, ref) => {
  const { maxWidth, maxHeight } = calcCanvasMaxSize(options.background.width);

  return html`
    <${P5Canvas}
      sketch=${sketch}
      options=${options}
      fallback=${html`
        <div
          className="main-canvas-fallback"
          style=${{
            aspectRatio: `${options.background.width} / ${options.background.height}`,
            maxWidth: `min(${maxWidth}, ${options.background.width}px)`,
            maxHeight: `min(${maxHeight}, ${options.background.height}px)`
          }}
        />
      `}
      ref=${ref}
    />
  `;
};

const PaintCanvas = forwardRef(PaintCanvasRefFunction);

export default PaintCanvas;
