import drawRandomRenderingObject from "./draw-random-rendering-object.js";
import HistoryStash from "./history-stash.js";
import ImageCollection from "./image-collection.js";

/**
 * @typedef {{
 *   width: number;
 *   height: number;
 *   shapes: Record<string, boolean>;
 *   images: {
 *     src: string;
 *     enabled: boolean;
 *     title: string;
 *   }[];
 *   minSize: number;
 *   maxSize: number;
 *   spread: number;
 *   colors: Record<"red" | "green" | "blue" | "alpha", {
 *     min: number;
 *     max: number;
 *   }>;
 *   background: {
 *     rgb: string;
 *     alpha: number;
 *   };
 * }} PaintOptions
 */

/**
 * @typedef {{
 *   type: "download";
 *   filename: string;
 *   extension: string;
 * }} DownloadMessage
 */

/**
 * @typedef {{
 *   type: "forward";
 * }} ForwardMessage
 */

/**
 * @typedef {{
 *   type: "back";
 * }} BackMessage
 */

/**
 * @typedef {{
 *   type: "clear";
 * }} ClearMessage
 */

/**
 * @typedef {(
 *   DownloadMessage
 *   | BackMessage
 *   | ForwardMessage
 *   | ClearMessage
 * )} PaintMessage
 */

/**
 * @type {import("../../p5-react/P5Canvas.js").Sketch<PaintOptions, PaintMessage>}
 */
const sketch = (p, detail) => {
  /**
   * @returns {void}
   */
  const resetBackground = () => {
    const options = detail.getOptions();

    const { width, height } = p.drawingContext.canvas;
    p.drawingContext.clearRect(0, 0, width, height);
    const { rgb, alpha } = options.background;
    const backgroundColor = p.color(rgb);
    backgroundColor.setAlpha(alpha);
    p.drawingContext.save();
    p.drawingContext.fillStyle = backgroundColor.toString();
    p.drawingContext.fillRect(0, 0, width, height);
    p.drawingContext.restore();
  };

  /**
   * @type {import("p5").Renderer}
   */
  let renderer;

  const updateCanvasSizeStyle = () => {
    const options = detail.getOptions();

    renderer
      .style("width", "auto")
      .style("height", "auto")
      .style("max-width", `min(100%, ${options.width / devicePixelRatio}px)`)
      .style("max-height", "85vh");
  };

  const resize = () => {
    const options = detail.getOptions();

    p.resizeCanvas(options.width, options.height);

    updateCanvasSizeStyle();
  };

  const images = new ImageCollection(p);

  p.preload = () => {
    const options = detail.getOptions();
    images.setImages(options.images);
  };

  const renderingObjectsHistory = new HistoryStash(p);

  /**
   * @param {"push" | "attach"} updateType
   */
  const updateRenderingObjectHistory = (updateType) => {
    const options = detail.getOptions();

    renderingObjectsHistory[updateType]((pg) => {
      drawRandomRenderingObject(
        pg,
        options,
        p.mouseX,
        p.mouseY,
        images.getSuccessEnabledImages()
      );
    });
  };

  p.setup = () => {
    renderer = p.createCanvas(0, 0).addClass("main-canvas");

    p.pixelDensity(1);

    resize();

    renderer.mousePressed((e) => {
      e.preventDefault();
    });

    const canvasElt = renderer.elt;

    if (canvasElt instanceof HTMLElement) {
      canvasElt.addEventListener("touchstart", (e) => {
        e.preventDefault();
      });

      canvasElt.addEventListener("pointerdown", () => {
        updateRenderingObjectHistory("push");
      });

      canvasElt.addEventListener("pointermove", () => {
        if (p.mouseIsPressed) {
          updateRenderingObjectHistory("attach");
        }
      });
    }
  };

  p.windowResized = () => {
    updateCanvasSizeStyle();
  };

  p.draw = () => {
    resetBackground();
    renderingObjectsHistory.draw();
  };

  detail.onOptionChange((currentOptions, prevOptions) => {
    if (
      currentOptions.width !== prevOptions.width ||
      currentOptions.height !== prevOptions.height
    ) {
      resize();
    }

    if (currentOptions.images !== prevOptions.images) {
      images.setImages(currentOptions.images);
    }
  });

  detail.onMessage((message) => {
    switch (message.type) {
      case "download":
        p.saveCanvas(message.filename, message.extension);
        break;
      case "forward":
        renderingObjectsHistory.forward();
        break;
      case "back":
        renderingObjectsHistory.back();
        break;
      case "clear":
        renderingObjectsHistory.push((pg) => {
          pg.clear(0, 0, 0, 0);
        });
        break;
    }
  });

  const eventListenerController = new AbortController();

  document.addEventListener(
    "keydown",
    (e) => {
      if (e.target === document.body && e.code === "KeyZ") {
        e.preventDefault();

        if (e.shiftKey) {
          renderingObjectsHistory.forward();
        } else {
          renderingObjectsHistory.back();
        }
      }
    },
    {
      signal: eventListenerController.signal
    }
  );

  detail.onUnmount(() => {
    p.noLoop();
    eventListenerController.abort();
  });
};

export default sketch;
