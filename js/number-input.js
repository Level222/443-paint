import noUiSlider from "nouislider";

/**
 * @typedef {import("p5").Element} p5Element
 * @typedef {import("nouislider").Options} NoUiSliderOptions
 */

/**
 * @param {number} value
 * @returns {p5Element}
 */
const createNumberInputText = (value) => (
  createInput(String(value)).addClass("number-input-text")
);

/**
 * @template T
 * @param {T | T[]} value
 * @returns T[]
 */
const arrayWrap = (value) => Array.isArray(value) ? value : [value];

/**
 * @param {{
 *   texts: p5Element[];
 *   sliderOptions: NoUiSliderOptions;
 *   onInput?: (newNumbers: number[]) => void;
 *   onChange?: (newNumbers: number[]) => void;
 * }} options
 * @returns {p5Element}
 */
const createNumberInputBase = (options) => {
  const { sliderOptions, texts, onInput, onChange } = options;

  const sliderDiv = createDiv()
    .addClass("number-input-slider");

  const slider = noUiSlider.create(sliderDiv.elt, sliderOptions);

  /**
   * @returns {number[]}
   */
  const getSliderValues = () => arrayWrap(slider.get(false)).map(Number);

  /**
   * @param {((newNumbers: number[]) => void) | undefined} eventCallback
   */
  const handleSliderUpdate = (eventCallback) => {
    const sliderValues = getSliderValues();

    for (const [index, sliderValue] of sliderValues.entries()) {
      texts[index].value(sliderValue);
    }

    eventCallback?.(sliderValues);
  };

  slider.on("slide", () => {
    handleSliderUpdate(onInput);
  });

  slider.on("change", () => {
    handleSliderUpdate(onChange);
  });

  for (const [index, textInput] of texts.entries()) {
    /**
     * @param {((newNumbers: number[]) => void) | undefined} eventCallback
     */
    const handleInputUpdate = (eventCallback) => {
      const inputValue = Number(textInput.value());

      if (!Number.isFinite(inputValue)) {
        return;
      }

      const currentSliderValues = getSliderValues();
      currentSliderValues[index] = inputValue;

      slider.set(currentSliderValues);

      eventCallback?.(currentSliderValues);
    };

    textInput.input(() => {
      handleInputUpdate(onInput);
    });

    textInput.changed(() => {
      handleInputUpdate(onChange);
    });

    textInput.elt.addEventListener("focus", () => {
      textInput.elt.select();
    });
  }

  return sliderDiv;
};

/**
 * @typedef {{
 *   slider: Omit<NoUiSliderOptions, "start">;
 * }} CommonOptions
 */

/**
 * @param {CommonOptions & {
 *   onInput?: (newNumber: number) => void;
 *   onChange?: (newNumber: number) => void;
 *   value: number;
 * }} options
 * @returns {p5Element}
 */
export const createNumberInput = (options) => {
  const { slider, onInput, onChange, value } = options;

  const textInput = createNumberInputText(value);

  return createDiv()
    .addClass("number-input")
    .child(createNumberInputBase({
      texts: [textInput],
      sliderOptions: {
        ...slider,
        start: [value]
      },
      onInput: (newNumbers) => onInput?.(newNumbers[0]),
      onChange: (newNumbers) => onChange?.(newNumbers[0])
    }))
    .child(textInput);
};

/**
 * @typedef {{
 *   start: number;
 *   end: number;
 * }} NewRange
 */

/**
 * @param {CommonOptions & {
 *   onInput?: (newRange: NewRange) => void;
 *   onChange?: (newRange: NewRange) => void;
 *   startValue: number;
 *   endValue: number;
 * }} options
 * @returns {p5Element}
 */
export const createRangeInput = (options) => {
  const { slider, onInput, onChange, startValue, endValue } = options;

  const startTextInput = createNumberInputText(startValue);
  const endTextInput = createNumberInputText(endValue);

  return createDiv()
    .addClass("number-input")
    .addClass("range")
    .child(startTextInput)
    .child(createNumberInputBase({
      texts: [startTextInput, endTextInput],
      sliderOptions: { ...slider, start: [startValue, endValue] },
      onInput: (newNumbers) => onInput?.({ start: newNumbers[0], end: newNumbers[1] }),
      onChange: (newNumbers) => onChange?.({ start: newNumbers[0], end: newNumbers[1] })
    }))
    .child(endTextInput);
};
