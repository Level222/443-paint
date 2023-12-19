/**
 * @param {import("p5").p5InstanceExtensions} p
 * @param {number} x
 * @param {number} y
 * @param {number} s
 * @returns {void}
 */
const equilateralTriangle = (p, x, y, s) => {
  const adjacent = s / 2;
  const leftX = x - adjacent;
  const rightX = x + adjacent;
  const oppositeRatio = p.sqrt(3);
  const bottomY = y + adjacent / oppositeRatio;
  const topY = bottomY - adjacent * oppositeRatio;
  p.triangle(leftX, bottomY, x, topY, rightX, bottomY);
};

export default equilateralTriangle;
