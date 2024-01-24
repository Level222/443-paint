/**
 * @param {string} filename
 */
const removeFilenameExtension = (filename) => {
  const lastDotIndex = filename.lastIndexOf(".");
  return lastDotIndex === -1 ? filename : filename.substring(0, lastDotIndex);
};

export default removeFilenameExtension;
