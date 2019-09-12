import {AbstractComponent} from './abstract-component.js';
export class TripDayTemplate extends AbstractComponent {
  constructor(date, eventCount) {
    super();
    this._date = new Date(date);
    this._eventCount = eventCount;
    TripDayTemplate.count = TripDayTemplate.count ? ++TripDayTemplate.count : 1;
  }

  //   getTemplate() {
  //     return `<ul class="trip-days">
  //       <li class="trip-days__item  day">
  //         <div class="day__info">
  //           <span class="day__counter">${TripDayTemplate.count}</span>
  //           <time class="day__date" datetime="${this._date}">${this._date}</time>
  //         </div>
  //       </li>
  //       </ul>`;
  //   }

  getTemplate() {
    const result = `<li class="trip-days__item  day">
    <div class="day__info">
      <span class="day__counter">${TripDayTemplate.count}</span>
      <time class="day__date" datetime="${this._date}">${this._date}</time>
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
