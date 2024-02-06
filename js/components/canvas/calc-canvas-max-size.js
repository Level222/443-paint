/**
 * @param {number} width
 * @returns {{
 *   maxWidth: string;
 *   maxHeight: string;
 * }}
 */
const calcCanvasMaxSize = (width) => ({
  maxWidth: `min(100%, ${width / devicePixelRatio}px)`,
  maxHeight: "85vh"
});

export default calcCanvasMaxSize;
