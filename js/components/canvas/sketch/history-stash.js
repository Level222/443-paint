/**
 * @typedef {(pg: import("p5").Graphics) => void} GraphicSketch
 */

class HistoryStash {
  /**
   * @type {import("p5").Image[]}
   */
  history = [];

  currentPosition = -1;

  /**
   * @param {import("p5").p5InstanceExtensions} p
   */
  constructor(p) {
    this.p = p;
  }

  /**
   * @param {GraphicSketch} graphicSketch
   */
  push(graphicSketch) {
    const prevPosition = this.currentPosition;
    this.currentPosition++;
    this.history = this.history.slice(0, this.currentPosition);

    this.updateHistory(graphicSketch, prevPosition, this.currentPosition);
  }

  /**
   * @param {GraphicSketch} graphicSketch
   */
  attach(graphicSketch) {
    this.updateHistory(
      graphicSketch,
      this.currentPosition,
      this.currentPosition
    );
  }

  forward() {
    const newPosition = this.currentPosition + 1;

    if (newPosition < this.history.length) {
      this.currentPosition = newPosition;
    }
  }

  back() {
    const newPosition = this.currentPosition - 1;

    if (newPosition >= -1) {
      this.currentPosition = newPosition;
    }
  }

  draw() {
    const image = this.history[this.currentPosition];

    if (image) {
      this.p.image(image, 0, 0);
    }
  }

  /**
   * @private
   * @param {GraphicSketch} graphicSketch
   * @param {number} baseHistoryPosition
   * @param {number} newHistoryPosition
   */
  updateHistory(graphicSketch, baseHistoryPosition, newHistoryPosition) {
    const pg = this.p.createGraphics(this.p.width, this.p.height);
    const baseHistory = this.history[baseHistoryPosition];

    if (baseHistory) {
      pg.image(baseHistory, 0, 0);
    }

    graphicSketch(pg);
    pg.remove();

    const { width, height } = pg;
    const image = pg.createImage(width, height);
    image.copy(pg, 0, 0, width, height, 0, 0, width, height);
    this.history[newHistoryPosition] = image;
  }
}

export default HistoryStash;
