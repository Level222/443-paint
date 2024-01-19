import { useEffect, useRef, useState } from "react";
import html from "../../utils/html.js";
import Slider from "rc-slider";
import { arrayWith } from "../../utils/array-utils.js";
import InstantSelectTextBox from "../InstantSelectTextBox.js";
import { useImperativeHandle } from "react";

/**
 * @template T
 * @param {T | T[]} value
 * @returns {T[]}
 */
const ensureArray = (value) => (Array.isArray(value) ? value : [value]);

/**
 * @param {unknown} value
 * @returns {value is HTMLInputElement}
 */
const isHTMLInputElement = (value) => {
  return value instanceof HTMLInputElement;
};

/**
 * @template {{}} T
 * @typedef {{
 *   setValue: (value: T) => void;
 * }} RcsliderWithTextBoxRef
 */

/**
 * @template T
 * @typedef {(
 *   import("rc-slider").SliderProps<T> & {
 *     onChangeComplete?: import("rc-slider").SliderProps<T>["onChangeComplete"]
 *   }
 * )} SliderOptions
 */

/**
 * @template {{}} T
 * @typedef {{
 *   slider: SliderOptions<T>;
 *   ref: import("react").Ref<RcsliderWithTextBoxRef<T>>;
 * }} BaseOptions
 */

/**
 * @typedef {BaseOptions<number[]>} NormalOptions
 */

/**
 * @template {{}} T
 * @typedef {BaseOptions<T> & {
 *   format: {
 *     from: (value: T) => number[];
 *     to: (value: number[]) => T;
 *   }
 * }} OptionsWithFormat
 */

/**
 * @template {{}} T
 * @typedef {NormalOptions | OptionsWithFormat<T>} Options
 */

/**
 * @typedef {{
 *   slider: import("react").ReactNode,
 *   textBoxes: import("react").ReactNode[]
 * }} RcsliderWithTextBox
 */

/**
 * @template {{}} T
 * @param {Options<T>} options
 * @returns {RcsliderWithTextBox}
 */
const useRcsliderWithTextBox = (options) => {
  const isOptionHasFormat = "format" in options;

  /**
   * @param {"onChange" | "onChangeComplete"} event
   * @param {number[]} newValue
   */
  const dispatchSliderEvent = (event, newValue) => {
    if (isOptionHasFormat) {
      options.slider[event]?.(options.format.to(newValue));
    } else {
      options.slider[event]?.(newValue);
    }
  };

  const value = isOptionHasFormat
    ? options.slider.value !== undefined
      ? options.format.from(options.slider.value)
      : undefined
    : options.slider.value;

  const defaultValue = isOptionHasFormat
    ? options.slider.defaultValue !== undefined
      ? options.format.from(options.slider.defaultValue)
      : undefined
    : options.slider.defaultValue;

  const [currentValue, setCurrentValue] = useState(
    value ?? defaultValue ?? [0]
  );

  const [textBoxValue, setTextBoxValue] = useState(currentValue.map(String));

  useImperativeHandle(
    /** @type {import("react").Ref<RcsliderWithTextBoxRef<T>>} */ (options.ref),
    () => ({
      /**
       * @param {T | number[]} newValue
       */
      setValue: (newValue) => {
        const newValueArray = isOptionHasFormat
          ? options.format.from(/** @type {T} */ (newValue))
          : /** @type {number[]} */ (newValue);
        setCurrentValue(newValueArray);
        setTextBoxValue(newValueArray.map(String));
        dispatchSliderEvent("onChange", newValueArray);
        dispatchSliderEvent("onChangeComplete", newValueArray);
      }
    })
  );

  useEffect(() => {
    if (typeof value === "number" || Array.isArray(value)) {
      setCurrentValue(value);
    }
  }, [value]);

  /**
   * @type {import("react").MutableRefObject<(HTMLInputElement | null)[]>}
   */
  const textBoxesRef = useRef([]);

  useEffect(() => {
    const textBoxElements = textBoxesRef.current.filter(isHTMLInputElement);

    const changeHandlers = textBoxElements.map((target, i) => ({
      target,
      handler: () => {
        handleTextBoxChangeComplete(i);
      }
    }));

    for (const { target, handler } of changeHandlers) {
      target.addEventListener("change", handler);
    }

    return () => {
      for (const { target, handler } of changeHandlers) {
        target.removeEventListener("change", handler);
      }
    };
  }, [textBoxesRef.current, currentValue]);

  /**
   * @param {number | number[]} newValue
   */
  const handleSliderChange = (newValue) => {
    const newValueArray = ensureArray(newValue);

    if (!(typeof value === "number" || Array.isArray(value))) {
      setCurrentValue(newValueArray);
    }

    setTextBoxValue(newValueArray.map(String));

    dispatchSliderEvent("onChange", newValueArray);
  };

  /**
   * @param {import("react").ChangeEvent<HTMLInputElement>} e
   * @param {number} index
   */
  const handleTextBoxChange = (e, index) => {
    const newValue = e.target.value;
    setTextBoxValue(arrayWith(textBoxValue, index, newValue));

    const newNumberValue = Number(newValue);

    if (!Number.isFinite(newNumberValue)) {
      return;
    }

    const adjustedValue = Math.max(
      Math.min(newNumberValue, ...currentValue.slice(index + 1, index + 2)),
      ...currentValue.slice(index - 1, index)
    );

    const newValueArray = arrayWith(currentValue, index, adjustedValue);

    if (!(typeof value === "number" || Array.isArray(value))) {
      setCurrentValue(newValueArray);
    }

    dispatchSliderEvent("onChange", newValueArray);
  };

  /**
   * @param {number | number[]} value
   */
  const handleSliderChangeComplete = (value) => {
    dispatchSliderEvent("onChangeComplete", ensureArray(value));
  };

  /**
   * @param {number} index
   */
  const handleTextBoxChangeComplete = (index) => {
    setTextBoxValue(
      arrayWith(textBoxValue, index, String(currentValue[index]))
    );

    dispatchSliderEvent("onChangeComplete", currentValue);
  };

  const slider = html`
    <${Slider}
      ...${options.slider}
      className="slide-input-slider"
      value=${currentValue}
      onChange=${handleSliderChange}
      onChangeComplete=${handleSliderChangeComplete}
    />
  `;

  const textBoxes = textBoxValue.map(
    (value, i) =>
      html`
        <${InstantSelectTextBox}
          type="text"
          className="slide-input-text-box"
          value=${value}
          onChange=${
            /** @type {import("react").ChangeEventHandler<HTMLInputElement>} */ (
              e
            ) => handleTextBoxChange(e, i)
          }
          ref=${
            /** @type {import("react").RefCallback<HTMLInputElement>} */ (
              element
            ) => {
              textBoxesRef.current = arrayWith(
                textBoxesRef.current,
                i,
                element
              );
            }
          }
        />
      `
  );

  return {
    slider,
    textBoxes
  };
};

export default useRcsliderWithTextBox;
