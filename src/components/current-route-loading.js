import {AbstractComponent} from './abstract-component.js';
// import moment from 'moment';
export class RouteLoadingTemplate extends AbstractComponent {
  // constructor([one, two, three, startDate, finishDate]) {
  //   super();
  //   this._pointOne = one;
  //   this._pointTwo = two;
  //   this._pointThree = three;
  //   this._startDate = startDate;
  //   this._finishDate = finishDate;
  // }

  getTemplate() {
    return `<div class="trip-info__main">
    <h1 class="trip-info__title">Loading...</h1>

    <p class="trip-info__dates"></p>
  </div>`;
  }
}
