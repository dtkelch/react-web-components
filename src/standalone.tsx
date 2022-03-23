import * as React from "react";
import * as ReactDom from "react-dom";
import { FetchData } from "./fetch-data";

class StandaloneComponent extends HTMLElement {
  mountPoint!: HTMLSpanElement;
  name!: string;

  connectedCallback() {
    const mountPoint = document.createElement("span");
    this.attachShadow({ mode: "open" }).appendChild(mountPoint);

    const name = this.getAttribute("name");
    if (name) {
      ReactDom.render(<FetchData name={name} />, mountPoint);
    }
  }
}
export default StandaloneComponent;

window.customElements.get("standalone-component") ||
  window.customElements.define("standalone-component", StandaloneComponent);
