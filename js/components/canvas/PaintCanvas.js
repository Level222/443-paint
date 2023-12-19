import { forwardRef } from "react";
import html from "../../utils/html.js";
import P5Canvas from "../p5-react/P5Canvas.js";
import sketch from "./sketch/sketch.js";

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
  return html`<${P5Canvas} sketch=${sketch} options=${options} ref=${ref} />`;
};

const PaintCanvas = forwardRef(PaintCanvasRefFunction);

export default PaintCanvas;
