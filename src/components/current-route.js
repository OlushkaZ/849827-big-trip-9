import {AbstractComponent} from './abstract-component.js';
export class RouteTemplate extends AbstractComponent {
  constructor([one, two, three]) {
    super();
    this._element = null;
    this._pointOne = one;
    this._pointTwo = two;
    this._pointThree = three;
  }

  getTemplate() {
    return `<div class="trip-info__main">
    <h1 class="trip-info__title">${this._pointOne} &mdash; ${this._pointTwo} &mdash; ${this._pointThree}</h1>

    <p class="trip-info__dates">Mar 18&nbsp;&mdash;&nbsp;21</p>
  </div>`;
  }
}
