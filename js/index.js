/// <reference types="p5/global" />

import "p5";
import { createNumberInput, createRangeInput } from "./number-input.js";
import createStyledFileInput from "./create-styled-file-input.js";

/**
 * @typedef {import("p5").Element} p5Element
 * @typedef {import("p5").Renderer} p5Renderer
 * @typedef {import("p5").Image} p5Image
 * @typedef {import("nouislider").Options} NoUiSliderOptions
 * @typedef {import("nouislider").Options["range"]} NoUiSliderRange
 */

/**
 * @type {{
 *   width: number;
 *   height: number;
 *   shapes: Record<string, boolean>;
 *   images: {
 *     img: p5Image;
 *     enabled: boolean;
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
 *   output: {
 *     filename: string;
 *     extension: string;
 *   };
 * }}
 */
const options = {
  width: 1200,
  height: 800,
  shapes: {
    circle: true,
    square: true,
    triangle: true
  },
  images: [],
  minSize: 10,
  maxSize: 40,
  spread: 32,
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
  },
  background: {
    rgb: "#fafafa",
    alpha: 255
  },
  output: {
    filename: "untitled",
    extension: "png"
  }
};

/**
 * @type {Partial<NoUiSliderOptions>}
 */
const commonSliderOptions = {
  step: 1
};

/**
 * @type {Partial<NoUiSliderOptions>}
 */
const commonNumberSliderOptions = {
  ...commonSliderOptions,
  connect: [true, false]
};

/**
 * @type {Partial<NoUiSliderOptions>}
 */
const commonRangeSliderOptions = {
  ...commonSliderOptions,
  connect: [false, true, false],
  behaviour: "drag"
};

/**
 * @type {NoUiSliderRange}
 */
const colorRange = {
  min: 0,
  max: 255
};

/**
 * @returns {p5Element}
 */
const createControls = () => {
  const filenameInput = createInput(options.output.filename)
    .attribute("title", "filename")
    .addClass("filename-input");
  filenameInput.input(() => {
    options.output.filename = String(filenameInput.value());
  });

  const extensionInput = createSelect()
    .attribute("title", "extension");
  extensionInput.option(".png", "png");
  extensionInput.option(".jpg", "jpg");
  extensionInput.selected(options.output.extension);
  extensionInput.changed(() => {
    options.output.extension = String(extensionInput.value());
  });

  const saveButton = createButton("download")
    .attribute("title", "download");
  saveButton.mouseClicked(() => {
    saveCanvas(options.output.filename, options.output.extension);
  });

  const resetButton = createButton("reset")
    .attribute("title", "reset");
  resetButton.mouseClicked(() => {
    reset();
  });

  return createDiv()
    .addClass("controls")
    .child(filenameInput)
    .child(extensionInput)
    .child(saveButton)
    .child(resetButton);
};

/**
 * @returns {p5Element}
 */
const createShapesInput = () => {
  const container = createDiv()
    .addClass("shapes-input");

  for (const [shapeName, checked] of Object.entries(options.shapes)) {
    const checkbox = createCheckbox(shapeName, checked)
      .attribute("title", `enable ${shapeName} shape`);
    checkbox.changed(() => {
      options.shapes[shapeName] = checkbox.checked();
    });
    container.child(checkbox);
  }

  return container;
};

/**
 * @returns {p5Element}
 */
const createImageInput = () => {
  const imageContainer = createDiv();

  // /**
  //  * @param {p5Element} image
  //  */
  // const addImage = (image) => {
  //   createDiv()
  //     .child();
  // };

  // for (const { img } of options.images) {
  //   addImage(img);
  // }

  const fileInput = createStyledFileInput({
    content: "+Image",
    accept: "image/*",
    onChange: (file) => {
      if (file.type === "image") {
        const img = loadImage(file.data);
        options.images.push({
          img,
          enabled: true
        });
        // addImage(img);
      } else {
        alert("Not image");
      }
    }
  });

  return createDiv()
    .child(imageContainer)
    .child(fileInput);
};

/**
 * @returns {p5Element}
 */
const createNumberParametersInput = () => {
  const sizeInput = createRangeInput({
    startValue: options.minSize,
    endValue: options.maxSize,
    slider: {
      ...commonRangeSliderOptions,
      range: {
        min: 0,
        max: 150
      }
    },
    onInput: ({ start, end }) => {
      options.minSize = start;
      options.maxSize = end;
    }
  })
    .attribute("title", "size of shape");

  const spreadInput = createNumberInput({
    value: options.spread,
    slider: {
      ...commonNumberSliderOptions,
      range: {
        min: 0,
        max: 300
      }
    },
    onInput: (newSpread) => {
      options.spread = newSpread;
    }
  })
    .attribute("title", "spread of shape");

  const redInput = createRangeInput({
    startValue: options.colors.red.min,
    endValue: options.colors.red.max,
    slider: {
      ...commonRangeSliderOptions,
      range: colorRange
    },
    onInput: ({ start, end }) => {
      options.colors.red.min = start;
      options.colors.red.max = end;
    }
  })
    .attribute("title", "red color range");

  const greenInput = createRangeInput({
    startValue: options.colors.green.min,
    endValue: options.colors.green.max,
    slider: {
      ...commonRangeSliderOptions,
      range: colorRange
    },
    onInput: ({ start, end }) => {
      options.colors.green.min = start;
      options.colors.green.max = end;
    }
  })
    .attribute("title", "green color range");

  const blueInput = createRangeInput({
    startValue: options.colors.blue.min,
    endValue: options.colors.blue.max,
    slider: {
      ...commonRangeSliderOptions,
      range: colorRange
    },
    onInput: ({ start, end }) => {
      options.colors.blue.min = start;
      options.colors.blue.max = end;
    }
  })
    .attribute("title", "blue color range");

  const alphaInput = createRangeInput({
    startValue: options.colors.alpha.min,
    endValue: options.colors.alpha.max,
    slider: {
      ...commonRangeSliderOptions,
      range: colorRange
    },
    onInput: ({ start, end }) => {
      options.colors.alpha.min = start;
      options.colors.alpha.max = end;
    }
  })
    .attribute("title", "opacity range");

  const widthInput = createNumberInput({
    value: options.width,
    slider: {
      ...commonNumberSliderOptions,
      range: {
        min: 1,
        max: 5000
      }
    },
    onChange: (newWidth) => {
      options.width = newWidth;
      resize();
    }
  })
    .attribute("title", "canvas width");

  const heightInput = createNumberInput({
    value: options.height,
    slider: {
      ...commonNumberSliderOptions,
      range: {
        min: 1,
        max: 5000
      }
    },
    onChange: (newHeight) => {
      options.height = newHeight;
      resize();
    }
  })
    .attribute("title", "canvas height");

  return createDiv()
    .addClass("number-input-grid")
    .child(createDiv("size"))
    .child(sizeInput)
    .child(createDiv("spread"))
    .child(spreadInput)
    .child(createDiv("red"))
    .child(redInput)
    .child(createDiv("blue"))
    .child(blueInput)
    .child(createDiv("green"))
    .child(greenInput)
    .child(createDiv("alpha"))
    .child(alphaInput)
    .child(createDiv("width"))
    .child(widthInput)
    .child(createDiv("height"))
    .child(heightInput);
};

/**
 * @returns {p5Element}
 */
const createBackgroundInput = () => {
  const rgbInput = createColorPicker(options.background.rgb)
    .attribute("title", "background color");
  rgbInput.changed(() => {
    options.background.rgb = String(rgbInput.value());
    reset();
  });

  const alphaInput = createNumberInput({
    value: options.background.alpha,
    slider: {
      ...commonNumberSliderOptions,
      range: colorRange
    },
    onInput: (newAlpha) => {
      options.background.alpha = Math.min(Math.max(0, newAlpha), 255);
      reset();
    }
  })
    .attribute("title", "opacity of the background color");

  return createDiv()
    .addClass("background-input")
    .child(createDiv("background"))
    .child(rgbInput)
    .child(alphaInput);
};

/**
 * @returns {void}
 */
const reset = () => {
  const { width, height } = drawingContext.canvas;
  drawingContext.clearRect(0, 0, width, height);
  const { rgb, alpha } = options.background;
  const backgroundColor = color(rgb);
  backgroundColor.setAlpha(alpha);
  drawingContext.save();
  drawingContext.fillStyle = backgroundColor.toString();
  drawingContext.fillRect(0, 0, width, height);
  drawingContext.restore();
};

const updateCanvasSizeStyle = () => {
  renderer
    .style("width", "auto")
    .style("height", "auto")
    .style("max-width", `min(100%, ${options.width / devicePixelRatio}px)`)
    .style("max-height", "85vh");
};

/**
 * @type {p5Renderer}
 */
let renderer;

const resize = () => {
  resizeCanvas(options.width, options.height);

  updateCanvasSizeStyle();

  reset();
};

/**
 * @returns {p5Element}
 */
const createOptionsInput = () => {
  return createDiv()
    .addClass("options")
    .child(createControls())
    .child(createShapesInput())
    .child(createImageInput())
    .child(createNumberParametersInput())
    .child(createBackgroundInput());
};

window.preload = () => {
  options.images.push(
    {
      img: loadImage("../images/smile-face-white.png"),
      enabled: true
    }
  );
};

window.setup = () => {
  renderer = createCanvas(0, 0)
    .addClass("main-canvas");

  const rendererParent = renderer.parent();
  if ((rendererParent instanceof Element) && rendererParent.tagName === "MAIN") {
    rendererParent.remove();
  }

  pixelDensity(1);

  resize();

  renderer.mousePressed((e) => {
    e.preventDefault();
  });

  const canvasElt = renderer.elt;

  if (canvasElt instanceof HTMLElement) {
    canvasElt.addEventListener("touchstart", (e) => {
      e.preventDefault();
    });
  }

  createElement("main")
    .child(createElement("h1", "443 Paint"))
    .child(renderer)
    .child(createOptionsInput());
};

window.windowResized = () => {
  updateCanvasSizeStyle();
};

/**
 * @param {number} x
 * @param {number} y
 * @param {number} s
 * @returns {void}
 */
const equilateralTriangle = (x, y, s) => {
  const adjacent = s / 2;
  const leftX = x - adjacent;
  const rightX = x + adjacent;
  const oppositeRatio = sqrt(3);
  const bottomY = y + adjacent / oppositeRatio;
  const topY = bottomY - adjacent * oppositeRatio;
  triangle(leftX, bottomY, x, topY, rightX, bottomY);
};

/**
 * @type {number}
 */
let prevMouseX;

/**
 * @type {number}
 */
let prevMouseY;

window.draw = () => {
  if (
    !mouseIsPressed
    || mouseX < 0
    || mouseX > options.width
    || mouseY < 0
    || mouseY > options.height
    || (mouseX === prevMouseX && mouseY === prevMouseY)
  ) {
    return;
  }

  const enabledShapes = Object.entries(options.shapes).filter(([, checked]) => checked);
  const enabledImages = options.images.filter(({ enabled }) => enabled);
  const totalEnabledObjects = enabledShapes.length + enabledImages.length;

  if (!totalEnabledObjects) {
    return;
  }

  const { colors } = options;

  const red = random(colors.red.min, colors.red.max);
  const green = random(colors.green.min, colors.green.max);
  const blue = random(colors.blue.min, colors.blue.max);
  const alpha = random(colors.alpha.min, colors.alpha.max);

  const shapeColor = color(red, green, blue, alpha);

  const { spread } = options;
  const maxSpread = spread / 2;
  const minSpread = -maxSpread;

  const x = mouseX + random(minSpread, maxSpread);
  const y = mouseY + random(minSpread, maxSpread);

  const size = random(options.minSize, options.maxSize);

  translate(x, y);
  rotate(random(0, TWO_PI));

  const objectIndex = floor(random(totalEnabledObjects));
  const mode = objectIndex < enabledShapes.length ? "shape" : "image";

  if (mode === "shape") {
    noStroke();
    fill(shapeColor);

    const [shapeName] = enabledShapes[objectIndex];

    switch (shapeName) {
      case "circle":
        circle(0, 0, size);
        break;
      case "square":
        rectMode(CENTER);
        square(0, 0, size);
        break;
      case "triangle":
        equilateralTriangle(0, 0, size);
        break;
    }
  } else {
    tint(shapeColor);

    const imageIndex = objectIndex - enabledShapes.length;
    const { img } = enabledImages[imageIndex];

    image(img, 0, 0, size, size);
  }

  prevMouseX = mouseX;
  prevMouseY = mouseY;
};
