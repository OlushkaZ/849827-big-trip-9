// import {tripPointTypes, destinations} from '../data.js';
import moment from 'moment';
import {tripPointTypes} from '../utils.js';

import {AbstractComponent} from './abstract-component.js';
export class EventNewTemplate extends AbstractComponent {
  constructor({type, startDate, finishDate, price, offers}) {
    super();
    this._type = type;
    this._types = tripPointTypes;
    this._startDate = new Date(startDate);
    this._finishDate = new Date(finishDate);
    // this._destination = destination.name;
    // this._description = destination.description;
    this._price = price;
    this._offers = offers;
    // this._pictures = destination.pictures;
    // this._isFavorite = isFavorite;
  }

  static getDateString(date) {
    return moment(date).format(`DD/MM/YY HH:mm`);
  }

  // static isMove(tripPointType) {
  //   return tripPointType.move ? ` to` : ` in`;
  // }

  _isMove(currentType) {
    if (currentType) {
      const pointType = this._types.filter((type)=>type.name === currentType)[0];
      return pointType.move ? ` to` : ` in`;
    }
    return ``;
  }

  // static checkMove(tripPointType) {
  //   return tripPointType.move ? ` checked` : ``;
  // }

  // static getPhotos() {
  //   return new Array(Math.floor(Math.random() * 4) + 1).fill(``).map(()=>`
  //    <img class="event__photo" src="http://picsum.photos/300/150?r=${Math.random()}" alt="Event photo">
  //    `).join(``);
  // }

  getTemplate() {
    return `<form class="trip-events__item event  event--edit" action="#" method="post">
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
                          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="" list="destination-list-1">
                          <datalist id="destination-list-1">

                          </datalist>
                        </div>

                        <div class="event__field-group  event__field-group--time">
                          <label class="visually-hidden" for="event-start-time-1">
                            From
                          </label>
                          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${EventNewTemplate.getDateString(this._startDate)}">
                          &mdash;
                          <label class="visually-hidden" for="event-end-time-1">
                            To
                          </label>
                          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${EventNewTemplate.getDateString(this._finishDate)}">
                        </div>

                        <div class="event__field-group  event__field-group--price">
                          <label class="event__label" for="event-price-1">
                            <span class="visually-hidden">${this._price}</span>
                            &euro;
                          </label>
                          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${this._price}">
                        </div>

                        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
                        <button class="event__reset-btn" type="reset">Cancel</button>
                      </header>
                    </form>`;
  }
}
