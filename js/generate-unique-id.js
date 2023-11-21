let idNumber = 0;

/**
 * @returns {string}
 */
const generateUniqueId = () => {
  return "uid:" + (idNumber++).toString(36);
};

export default generateUniqueId;
