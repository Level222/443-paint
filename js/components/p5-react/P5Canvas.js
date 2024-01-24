import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState
} from "react";
import html from "../../utils/html.js";
import p5 from "p5";
import PaintDetail from "./paint-detail.js";

/**
 * @template {object} T
 * @template U
 * @typedef {(p5: import("p5"), paintDetail: PaintDetail<T, U>) => void} Sketch
 */

/**
 * @template {object} T
 * @template U
 * @typedef {{
 *   options: T;
 *   sketch: Sketch<T, U>;
 *   fallback: import("react").ReactNode;
 * }} Props
 */

/**
 * @template U;
 * @typedef {{
 *   sendMessage: (message: U) => void;
 * }} P5CanvasRef
 */

/**
 * @template {object} T
 * @template U
 * @type {import("react").ForwardRefRenderFunction<P5CanvasRef<U>, Props<T, U>>}
 */
const P5CanvasRefFunction = ({ options, sketch, fallback }, ref) => {
  const [isLoading, setIsLoading] = useState(true);

  useImperativeHandle(ref, () => ({
    sendMessage: (/** @type {U} */ message) => {
      paintDetailRef.current?.message(message);
    }
  }));

  /**
   * @type {import("react").MutableRefObject<PaintDetail<T, U> | null>}
   */
  const paintDetailRef = useRef(null);

  /**
   * @type {import("react").MutableRefObject<HTMLElement | null>}
   */
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    setIsLoading(true);

    const newPaintDetail = new PaintDetail(options);
    paintDetailRef.current = newPaintDetail;

    const p5Instance = new p5((p) => {
      p._setup = new Proxy(p._setup, {
        apply(target, thisArg, argArray) {
          setIsLoading(false);
          Reflect.apply(target, thisArg, argArray);
        }
      });

      sketch(p, newPaintDetail);
    }, containerRef.current);

    return () => {
      paintDetailRef.current?.unmount();
      p5Instance.remove();
    };
  }, [sketch]);

  useEffect(() => {
    paintDetailRef.current?.setOptions(options);
  }, [options]);

  return html`
    ${isLoading && fallback}
    <div
      ref=${containerRef}
      style=${isLoading ? { display: "none" } : {}}
    />
  `;
};

const P5Canvas = forwardRef(P5CanvasRefFunction);

export default P5Canvas;
