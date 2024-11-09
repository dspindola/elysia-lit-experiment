import { SignalWatcher } from "@lit-labs/signals";
import { html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import { counter } from "./store";

@customElement("app-root")
export class AppRoot extends SignalWatcher(LitElement) {
  render() {
    return html`<div>
      <button @click=${this.#increment}>${counter.get()}</button>
      <slot></slot>
    </div>`;
  }

  #increment() {
    counter.set(counter.get() + 1);
  }
}
