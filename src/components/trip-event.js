import {AbstractComponent} from './abstract-component.js';
export class EventTemplate extends AbstractComponent {
  constructor({tripPointType, destination, startDate, finishDate, price, offers}) {
    super();
    this._tripPointType = tripPointType;
    this._startDate = new Date(startDate);
    this._finishDate = new Date(finishDate);
    this._destination = destination;
    this._price = price;
    this._offers = offers;
    this._element = null;
  }

  static getDateString(date) {
    return date.toDateString();
  }

  static isMove(tripPointType) {
    return tripPointType.move ? ` to` : ` in`;
  }

  getTemplate() {
    return `<li class="trip-events__item">
     <div class="event">
       <div class="event__type">
         <img class="event__type-icon" width="42" height="42" src="img/icons/${this._tripPointType.name}.png" alt="Event type icon">
       </div>
       <h3 class="event__title">${this._tripPointType.name} ${EventTemplate.isMove(this._tripPointType)} ${this._destination}</h3>

       <div class="event__schedule">
         <p class="event__time">
           <time class="event__start-time" datetime="${this._startDate}">${EventTemplate.getDateString(this._startDate)}</time>
           &mdash;
           <time class="event__end-time" datetime="${this._finishDate}">${EventTemplate.getDateString(this._finishDate)}</time>
         </p>
         <p class="event__duration">${this._finishDate - this._startDate}</p>
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
     </div>
   </li>`;
  }
}
