import drawRandomRenderingObject from "./draw-random-rendering-object.js";
import HistoryStash from "./history-stash.js";
import ImageCollection from "./image-collection.js";

/**
 * @typedef {{
 *   drawing: {
 *     shapes: Record<string, boolean>;
 *     images: {
 *       src: string;
 *       enabled: boolean;
 *       title: string;
 *     }[];
 *     minSize: number;
 *     maxSize: number;
 *     spread: number;
 *     colors: Record<"red" | "green" | "blue" | "alpha", {
 *       min: number;
 *       max: number;
 *     }>;
 *   };
 *   background: {
 *     mode: "color" | "image";
 *     width: number;
 *     height: number;
 *     rgb: string;
 *     src: string;
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
   * @type {import("p5").Image}
   */
  let backgroundImage;

  /**
   * @returns {void}
   */
  const resetBackground = () => {
    const options = detail.getOptions();

    const { background } = options;

    const { width, height } = p.drawingContext.canvas;
    p.drawingContext.clearRect(0, 0, width, height);

    if (background.mode === "color") {
      const { rgb, alpha } = options.background;
      const backgroundColor = p.color(rgb);
      backgroundColor.setAlpha(alpha);
      p.drawingContext.save();
      p.drawingContext.fillStyle = backgroundColor.toString();
      p.drawingContext.fillRect(0, 0, width, height);
      p.drawingContext.restore();
    } else {
      const { alpha } = background;
      p.tint(255, alpha);
      p.image(backgroundImage, 0, 0, width, height);
    }
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
      .style(
        "max-width",
        `min(100%, ${options.background.width / devicePixelRatio}px)`
      )
      .style("max-height", "85vh");
  };

  const resize = () => {
    const options = detail.getOptions();

    p.resizeCanvas(options.background.width, options.background.height);

    updateCanvasSizeStyle();
  };

  const images = new ImageCollection(p);

  p.preload = () => {
    const options = detail.getOptions();
    images.setImages(options.drawing.images);
    backgroundImage = p.loadImage(options.background.src);
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
        options.drawing,
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
      currentOptions.background.width !== prevOptions.background.width ||
      currentOptions.background.height !== prevOptions.background.height
    ) {
      resize();
    }

    if (currentOptions.drawing.images !== prevOptions.drawing.images) {
      images.setImages(currentOptions.drawing.images);
    }

    if (currentOptions.background.src !== prevOptions.background.src) {
      backgroundImage = p.loadImage(currentOptions.background.src);
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

  /**
   * @param {KeyboardEvent} e
   */
  const isCtrlXorMetaKey = (e) =>
    (e.ctrlKey || e.metaKey) && !(e.ctrlKey && e.metaKey);

  document.addEventListener(
    "keydown",
    (e) => {
      if (
        e.target === document.body &&
        e.code === "KeyZ" &&
        isCtrlXorMetaKey(e)
      ) {
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
