import equilateralTriangle from "./equilateral-triangle.js";

/**
 * @param {number} longSideSize
 * @param {number} width
 * @param {number} height
 */
const calcSideSize = (longSideSize, width, height) => {
  if (width > height) {
    return {
      renderWidth: longSideSize,
      renderHeight: longSideSize * (height / width)
    };
  }

  return {
    renderWidth: longSideSize * (width / height),
    renderHeight: longSideSize
  };
};

/**
 * @param {import("p5").p5InstanceExtensions} p
 * @param {import("p5").Image} image
 * @param {number} x
 * @param {number} y
 * @param {number} longSide
 */
const imageWithLongSide = (p, image, x, y, longSide) => {
  const { width, height } = image;

  const {renderWidth, renderHeight} = calcSideSize(longSide, width, height);

  p.image(image, x, y, renderWidth, renderHeight);
};

/**
 * @param {import("p5").p5InstanceExtensions} p
 * @param {import("./sketch").PaintOptions} options
 * @param {number} baseX
 * @param {number} baseY
 * @param {import("p5").Image[]} images
 */
const drawRandomRenderingObject = (p, options, baseX, baseY, images) => {
  const enabledShapes = Object.entries(options.shapes).filter(
    ([, checked]) => checked
  );

  const totalEnabledObjects = enabledShapes.length + images.length;

  if (!totalEnabledObjects) {
    return;
  }

  const objectIndex = p.floor(p.random(totalEnabledObjects));
  const type = objectIndex < enabledShapes.length ? "shape" : "image";

  const maxSpread = options.spread / 2;
  const minSpread = -maxSpread;

  const x = baseX + p.random(minSpread, maxSpread);
  const y = baseY + p.random(minSpread, maxSpread);

  const direction = p.random(0, p.TWO_PI);

  const { colors } = options;

  const red = p.random(colors.red.min, colors.red.max);
  const green = p.random(colors.green.min, colors.green.max);
  const blue = p.random(colors.blue.min, colors.blue.max);
  const alpha = p.random(colors.alpha.min, colors.alpha.max);
  const fillColor = p.color(red, green, blue, alpha);

  const size = p.random(options.minSize, options.maxSize);

  p.push();

  p.translate(x, y);
  p.rotate(direction);

  if (type === "shape") {
    const shape = enabledShapes[objectIndex][0];

    p.noStroke();
    p.fill(fillColor);

    switch (shape) {
      case "circle":
        p.circle(0, 0, size);
        break;
      case "square":
        p.rectMode(p.CENTER);
        p.square(0, 0, size);
        break;
      case "triangle":
        equilateralTriangle(p, 0, 0, size);
        break;
    }
  } else {
    const image = images[objectIndex - enabledShapes.length];

    p.tint(fillColor);
    p.imageMode(p.CENTER);
    imageWithLongSide(p, image, 0, 0, size);
  }

  p.pop();
};

export default drawRandomRenderingObject;
