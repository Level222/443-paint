import generateUniqueId from "./generate-unique-id.js";

/**
 * @param {{
 *   content: string;
 *   onChange: (file: import("p5").File) => void;
 *   accept?: string;
 * }} options
 * @returns {import("p5").Element}
 */
const createStyledFileInput = (options) => {
  const { content, onChange, accept } = options;

  const id = generateUniqueId();

  const fileInput = createFileInput(onChange)
    .id(id)
    .addClass("styled-file-input-main");

  if (accept) {
    fileInput.elt.accept = accept;
  }

  const label = createElement("label", content)
    .addClass("styled-file-input-label")
    .child(fileInput);

  label.elt.htmlFor = id;

  return label;
};

export default createStyledFileInput;
