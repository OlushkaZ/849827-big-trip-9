import {AbstractComponent} from './abstract-component.js';
import moment from 'moment';
export class RouteTemplate extends AbstractComponent {
  constructor([one, two, three, startDate, finishDate]) {
    super();
    this._pointOne = one;
    this._pointTwo = two;
    this._pointThree = three;
    this._startDate = startDate;
    this._finishDate = finishDate;
  }

  getTemplate() {
    return `<div class="trip-info__main">
    <h1 class="trip-info__title">${this._pointOne} &mdash; ${this._pointTwo} &mdash; ${this._pointThree}</h1>

    <p class="trip-info__dates">${moment(this._startDate).format(`DD MMM`)}&nbsp;&mdash;&nbsp;${moment(this._finishDate).format(`DD MMM`)}</p>
  </div>`;
  }
}
