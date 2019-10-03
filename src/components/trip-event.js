import {AbstractComponent} from './abstract-component.js';
import moment from 'moment';
import {tripPointTypes, getDurationTime} from '../utils.js';

export class EventTemplate extends AbstractComponent {
  constructor({type, destination, startDate, finishDate, price, offers}) {
    super();
    this._type = type;
    this._types = tripPointTypes;
    this._startDate = new Date(startDate);
    this._finishDate = new Date(finishDate);
    this._destination = destination;
    this._price = price;
    this._offers = offers;
  }

  static getTimeFromDate(date) {
    return moment(date).format(` HH:mm`);
  }

  _isMove(currentType) {
    if (currentType) {
      const pointType = this._types.filter((type)=>type.name === currentType)[0];
      return pointType.move ? ` to` : ` in`;
    }
    return ``;
  }

  getTemplate() {
    return `<div class="event">
       <div class="event__type">
         ${this._type ? `<img class="event__type-icon" width="42" height="42" src="img/icons/${this._type}.png" alt="Event type icon">` : ``}
       </div>
       <h3 class="event__title">${this._type} ${this._isMove(this._type)} ${this._destination.name}</h3>

       <div class="event__schedule">
         <p class="event__time">
           <time class="event__start-time" datetime="${moment(this._startDate).format()}">${EventTemplate.getTimeFromDate(this._startDate)}</time>
           &mdash;
           <time class="event__end-time" datetime="${moment(this._finishDate).format()}">${EventTemplate.getTimeFromDate(this._finishDate)}</time>
         </p>
         <p class="event__duration">${getDurationTime(this._finishDate - this._startDate)}</p>
       </div>

       <p class="event__price">
         &euro;&nbsp;<span class="event__price-value">${this._price}</span>
       </p>

       <h4 class="visually-hidden">Offers:</h4>
       <ul class="event__selected-offers">
       ${this._offers.map((offer)=>offer.accepted ? `<li class="event__offer">
             <span class="event__offer-title">${offer.title}</span>
             &plus;
             &euro;&nbsp;<span class="event__offer-price">${offer.price}</span>
            </li>` : ``).filter((offer)=>offer).slice(0, 3).join(``)}

       </ul>

       <button class="event__rollup-btn" type="button">
         <span class="visually-hidden">Open event</span>
       </button>
     </div>`;
  }
}
