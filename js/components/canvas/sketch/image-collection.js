/**
 * @typedef {"loading" | "success" | "failure"} ImageState
 */

/**
 * @typedef {{
 *   image: import("p5").Image;
 *   enabled: boolean;
 *   state: ImageState;
 * }} ImageDetail
 */

class ImageCollection {
  /**
   * @type {Map<string, ImageDetail>}
   */
  images = new Map();

  /**
   * @param {import("p5").p5InstanceExtensions} p
   */
  constructor(p) {
    this.p = p;
  }

  /**
   * @param {import("./sketch").PaintOptions["images"]} images
   */
  setImages(images) {
    for (const { src, enabled } of images) {
      const existingImage = this.images.get(src);
      if (existingImage) {
        existingImage.enabled = enabled;
        continue;
      }

      const image = this.p.loadImage(
        src,
        () => {
          imageDetail.state = "success";
        },
        () => {
          imageDetail.state = "failure";
        }
      );

      /**
       * @type {ImageDetail}
       */
      const imageDetail = {
        image,
        enabled,
        state: "loading"
      };

      this.images.set(src, imageDetail);
    }
  }

  /**
   * @returns {import("p5").Image[]}
   */
  getSuccessEnabledImages() {
    return [...this.images].flatMap(([, { state, image, enabled }]) =>
      state === "success" && enabled ? [image] : []
    );
  }
}

export default ImageCollection;
