import { LitElement, property } from "@polymer/lit-element";

export class PageViewElement extends LitElement {
  // Only render this page if it's actually visible.
  protected shouldUpdate() {
    return this.active;
  }

  @property({ type: Boolean })
  active = false;
}
