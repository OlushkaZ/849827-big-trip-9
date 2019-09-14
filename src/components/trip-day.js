import {AbstractComponent} from './abstract-component.js';
import moment from 'moment';
export class TripDayTemplate extends AbstractComponent {
  constructor(date, eventCount) {
    super();
    this._date = date ? new Date(date) : 0;
    this._eventCount = eventCount;
    TripDayTemplate.count = TripDayTemplate.count ? ++TripDayTemplate.count : 1;
  }

  getTemplate() {
    const result = `<li class="trip-days__item  day">
    <div class="day__info">
    ${this._date ? `
      <span class="day__counter">${TripDayTemplate.count}</span>
      <time class="day__date" datetime="${moment(this._date).format()}">${moment(this._date).format(`MMM DD`)}</time>
    ` : ``}
    </div>
      <ul class="trip-events__list">
      ${new Array(this._eventCount)
      .fill(``)
      .map(() => `<li class="trip-events__item"></li>`).join(``)}
      </ul>
    </li>`;
    return result;
  }
}
