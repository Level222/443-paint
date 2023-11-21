import p5 from "p5";

type EventFunction<T> = (listener: (event: T) => void) => void;

declare global {
  export var draw: () => void;
  export var setup: () => void;
  export var preload: () => void;
}

declare module "p5" {
  interface Element {
    input: EventFunction<InputEvent>;
    changed: EventFunction<InputEvent>;
    parent(): ParentNode;
    option(name: string, value?: string): void;
    selected(value: string): void;
    checked(value: boolean): void;
    checked(): boolean;
  }
}
