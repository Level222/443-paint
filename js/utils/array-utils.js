/**
 * @template T
 * @param {T[]} array
 * @param {number} index
 * @param {T} value
 * @returns T[]
 */
export const arrayWith = (array, index, value) => {
  const newArray = array.slice();
  newArray[index] = value;
  return newArray;
};
