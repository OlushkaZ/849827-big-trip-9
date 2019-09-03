import {createElement} from '../utils.js';
export class RouteTemplate {
  constructor([one, two, three]) {
    this._element = null;
    this._pointOne = one;
    this._pointTwo = two;
    this._pointThree = three;
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }
    return this._element;
  }

  removeElement() {
    this._element = null;
  }

  getTemplate() {
    return `<div class="trip-info__main">
    <h1 class="trip-info__title">${this._pointOne} &mdash; ${this._pointTwo} &mdash; ${this._pointThree}</h1>

    <p class="trip-info__dates">Mar 18&nbsp;&mdash;&nbsp;21</p>
  </div>`;
  }
}
