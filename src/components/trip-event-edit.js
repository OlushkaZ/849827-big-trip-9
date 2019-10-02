// import {destinations} from '../data.js';
import moment from 'moment';
import {tripPointTypes} from '../utils.js';

import {AbstractComponent} from './abstract-component.js';
export class EventEditTemplate extends AbstractComponent {
  constructor({type, destination, startDate, finishDate, price, offers, isFavorite}) {
    super();
    this._type = type;
    this._types = tripPointTypes;
    this._startDate = new Date(startDate);
    this._finishDate = new Date(finishDate);
    this._destination = destination.name;
    this._description = destination.description;
    this._price = price;
    this._offers = offers;
    this._pictures = destination.pictures;
    this._isFavorite = isFavorite;
  }

  static getDateString(date) {
    return moment(date).format(`DD/MM/YY HH:mm`);
  }

  _isMove(currentType) {
    if (currentType) {
      const pointType = this._types.filter((type)=>type.name === currentType)[0];
      return pointType.move ? ` to` : ` in`;
    }
    return ``;
  }

  // _checkMove(currentType) {
  //   const pointType = this._types.filter((type)=>type.name === currentType)[0];
  //   return pointType.move ? ` checked` : ``;
  // }
  //
  // _getPhotos() {
  //   return this._pictures.map((picture)=>`<img class="event__photo" src="${picture.src}" alt="${picture.description}">
  //    `).join(``);
  // }
  // getPhotos() {
  //   return new Array(Math.floor(Math.random() * 4) + 1).fill(``).map(()=>`
  //    <img class="event__photo" src="http://picsum.photos/300/150?r=${Math.random()}" alt="Event photo">
  //    `).join(``);
  // }

  // getOffersSection() {
  //   return `<section class="event__section  event__section--offers">
  //                           <h3 class="event__section-title  event__section-title--offers">Offers</h3>
  //
  //                           <div class="event__available-offers">
  //                             ${this._offers.map((offer)=>`
  //                             <div class="event__offer-selector">
  //                               <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.title}-1" type="checkbox" name="${offer.title}" ${offer.accepted ? `checked` : ``}>
  //                               <label class="event__offer-label" for="event-offer-${offer.title}-1">
  //                                 <span class="event__offer-title">${offer.title}</span>
  //                                 &plus;
  //                                 &euro;&nbsp;<span class="event__offer-price">${offer.price}</span>
  //                               </label>
  //                             </div>
  //                             `).join(``)}
  //                           </div>
  //                         </section>`;
  // }
  // getDestinationSection() {
  //   return `<section class="event__section  event__section--destination">
  //     <h3 class="event__section-title  event__section-title--destination">Destination</h3>
  //     <p class="event__destination-description">${this._description}</p>
  //
  //     <div class="event__photos-container">
  //       <div class="event__photos-tape">
  //       ${this._getPhotos()}
  //       </div>
  //     </div>
  //   </section>`;
  // }

  // getDetailsSection() {
  //   return `<section class="event__details">
  //         </section>`;
  // }

  getTemplate() {
    return `<form class="event  event--edit" action="#" method="post">
                      <header class="event__header">
                        <div class="event__type-wrapper">
                          <label class="event__type  event__type-btn" for="event-type-toggle-1">
                            <span class="visually-hidden">Choose event type</span>
                            ${this._type ? `<img class="event__type-icon" width="17" height="17" src="img/icons/${this._type}.png" alt="Event type icon">` : ``}
                          </label>
                          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

                          <div class="event__type-list">
                            <fieldset class="event__type-group">
                              <legend class="visually-hidden">Transfer</legend>

                              ${this._types.map((type) =>type.move ? `
                                <div class="event__type-item">
                                  <input id="event-type-${type.name}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type.name}" ${type.name === this._type ? `checked` : ``}>
                                  <label class="event__type-label  event__type-label--${type.name}" for="event-type-${type.name}-1">${type.name}</label>
                                </div>
                                ` : ``).join(``)}
                            </fieldset>

                            <fieldset class="event__type-group">
                              <legend class="visually-hidden">Activity</legend>

                              ${this._types.map((type) => !type.move ? `
                                <div class="event__type-item">
                                  <input id="event-type-${type.name}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type.name}" ${type.name === this._type ? `checked` : ``}>
                                  <label class="event__type-label  event__type-label--${type.name}" for="event-type-${type.name}-1">${type.name}</label>
                                </div>
                                ` : ``).join(``)}
                            </fieldset>
                          </div>
                        </div>

                        <div class="event__field-group  event__field-group--destination">
                          <label class="event__label  event__type-output" for="event-destination-1">
                            ${this._type} ${this._isMove(this._type)}
                          </label>
                          <input class="event__input  event__input--destination" id="event-destination-1" name="event-destination" value="${this._destination}" list="destination-list-1">
                          <datalist id="destination-list-1">

                          </datalist>
                        </div>

                        <div class="event__field-group  event__field-group--time">
                          <label class="visually-hidden" for="event-start-time-1">
                            From
                          </label>
                          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${EventEditTemplate.getDateString(this._startDate)}">
                          &mdash;
                          <label class="visually-hidden" for="event-end-time-1">
                            To
                          </label>
                          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${EventEditTemplate.getDateString(this._finishDate)}">
                        </div>

                        <div class="event__field-group  event__field-group--price">
                          <label class="event__label" for="event-price-1">
                            <span class="visually-hidden">${this._price}</span>
                            &euro;
                          </label>
                          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${this._price}">
                        </div>

                        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
                        <button class="event__reset-btn" type="reset">Delete</button>

                        <input id="event-favorite-1" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" ${this._isFavorite ? `checked` : ``}>
                        <label class="event__favorite-btn" for="event-favorite-1">
                          <span class="visually-hidden">Add to favorite</span>
                          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
                            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
                          </svg>
                        </label>

                        <button class="event__rollup-btn" type="button">
                          <span class="visually-hidden">Open event</span>
                        </button>
                      </header>

                    </form>`;
  }
  // getTemplate() {
  //   return this.getDefaultTemplate();
  //
  // }
}
