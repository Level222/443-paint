/**
 * @template {any[]} T
 * @typedef {(...args: T) => void} EventHandler
 */

/**
 * @template {any[]} T
 */
export class EventRegistrar {
  /**
   * @type {EventHandler<T>[]}
   */
  handlers = [];

  /**
   * @param  {T} args
   * @returns {void}
   */
  fire(...args) {
    for (const handler of this.handlers) {
      handler(...args);
    }
  }

  /**
   * @param {EventHandler<T>} handler
   * @returns {void}
   */
  registrar = (handler) => {
    this.handlers.push(handler);
  };
}

/**
 * @template {object} T
 * @typedef {(newOptions: T) => void} OptionChangedHandler
 */

/**
 * @template {object} T
 * @template U
 */
class PaintDetail {
  unmounted = false;

  /**
   * @private
   * @type {T}
   */
  options;

  /**
   * @private
   * @type {EventRegistrar<[T, T]>}
   */
  optionChangeEvent = new EventRegistrar();

  /**
   * @private
   * @type {EventRegistrar<[]>}
   */
  unmountEvent = new EventRegistrar();

  /**
   * @private
   * @type {EventRegistrar<[U]>}
   */
  messageEvent = new EventRegistrar();

  /**
   * @param {T} defaultOptions
   */
  constructor(defaultOptions) {
    this.options = defaultOptions;
  }

  /**
   * @returns {T}
   */
  getOptions() {
    return this.options;
  }

  /**
   * @param {T} options
   * @returns {void}
   */
  setOptions(options) {
    const prevOptions = this.options;
    this.options = options;
    this.optionChangeEvent.fire(options, prevOptions);
  }

  /**
   * @returns {void}
   */
  unmount() {
    this.unmounted = true;
    this.unmountEvent.fire();
  }

  /**
   * @param {U} message
   * @returns {void}
   */
  message(message) {
    this.messageEvent.fire(message);
  }

  onOptionChange = this.optionChangeEvent.registrar;

  onUnmount = this.unmountEvent.registrar;

  onMessage = this.messageEvent.registrar;
}

export default PaintDetail;
