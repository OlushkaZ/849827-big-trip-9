import {AbstractComponent} from './abstract-component.js';
import moment from 'moment';

export class EventTemplate extends AbstractComponent {
  constructor({tripPointType, destination, startDate, finishDate, price, offers}) {
    super();
    this._tripPointType = tripPointType;
    this._startDate = new Date(startDate);
    this._finishDate = new Date(finishDate);
    this._destination = destination;
    this._price = price;
    this._offers = offers;
  }

  static getTimeFromDate(date) {
    return moment(date).format(` HH:mm`);
  }

  static isMove(tripPointType) {
    return tripPointType.move ? ` to` : ` in`;
  }
  static getDurationTime(startDate, finishDate) {
    const duration = finishDate - startDate;
    const durationInMinutes = Math.floor((duration) / 1000 / 60);
    const durationInHours = Math.floor((durationInMinutes) / 60);
    const days = Math.floor((durationInHours) / 24);
    const minutes = durationInMinutes % 60;
    const hours = days ? durationInHours % 24 : durationInHours;
    let result = (`00` + minutes).slice(-2) + `M`;
    result = hours ? (`00` + hours).slice(-2) + `H ` + result : result;
    result = days ? (`00` + days).slice(-2) + `D ` + result : result;
    return result;
  }

  getTemplate() {
    return `<div class="event">
       <div class="event__type">
         ${this._tripPointType ? `<img class="event__type-icon" width="42" height="42" src="img/icons/${this._tripPointType.name}.png" alt="Event type icon">` : ``}
       </div>
       <h3 class="event__title">${this._tripPointType.name} ${EventTemplate.isMove(this._tripPointType)} ${this._destination}</h3>

       <div class="event__schedule">
         <p class="event__time">
           <time class="event__start-time" datetime="${moment(this._startDate).format()}">${EventTemplate.getTimeFromDate(this._startDate)}</time>
           &mdash;
           <time class="event__end-time" datetime="${moment(this._finishDate).format()}">${EventTemplate.getTimeFromDate(this._finishDate)}</time>
         </p>
         <p class="event__duration">${EventTemplate.getDurationTime(this._startDate, this._finishDate)}</p>
       </div>

       <p class="event__price">
         &euro;&nbsp;<span class="event__price-value">${this._price}</span>
       </p>

       <h4 class="visually-hidden">Offers:</h4>
       <ul class="event__selected-offers">
       ${this._offers.map((offer)=>offer.check ? `<li class="event__offer">
             <span class="event__offer-title">${offer.name}</span>
             &plus;
             &euro;&nbsp;<span class="event__offer-price">${offer.price}</span>
            </li>` : ``).slice(0, 2).join(``)}

       </ul>

       <button class="event__rollup-btn" type="button">
         <span class="visually-hidden">Open event</span>
       </button>
     </div>`;
  }
}
