import {tripPointTypes, destinations} from '../data.js';
import moment from 'moment';

import {AbstractComponent} from './abstract-component.js';
export class EventNewTemplate extends AbstractComponent {
  constructor({tripPointType, destination, startDate, finishDate, price, offers, description}) {
    super();
    this._tripPointType = tripPointType;
    this._tripPointTypes = tripPointTypes;
    this._startDate = new Date(startDate);
    this._finishDate = new Date(finishDate);
    this._destination = destination;
    this._destinations = destinations;
    this._price = price;
    this._offers = offers;
    this._description = description;
  }

  static getDateString(date) {
    return moment(date).format(`DD/MM/YY HH:mm`);
  }

  static isMove(tripPointType) {
    return tripPointType.move ? ` to` : ` in`;
  }

  static checkMove(tripPointType) {
    return tripPointType.move ? ` checked` : ``;
  }

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
                            ${this._tripPointType ? `<img class="event__type-icon" width="17" height="17" src="img/icons/${this._tripPointType.name}.png" alt="Event type icon">` : ``}
                          </label>
                          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox" ${EventNewTemplate.checkMove(this._tripPointType)}>

                          <div class="event__type-list">
                            <fieldset class="event__type-group">
                              <legend class="visually-hidden">Transfer</legend>

                              ${this._tripPointTypes.map((type) =>type.move ? `
                                <div class="event__type-item">
                                  <input id="event-type-${type.name}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type.name}" ${type.name === this._tripPointType.name ? `checked` : ``}>
                                  <label class="event__type-label  event__type-label--${type.name}" for="event-type-${type.name}-1">${type.name}</label>
                                </div>
                                ` : ``).join(``)}
                            </fieldset>

                            <fieldset class="event__type-group">
                              <legend class="visually-hidden">Activity</legend>

                              ${this._tripPointTypes.map((type) => !type.move ? `
                                <div class="event__type-item">
                                  <input id="event-type-${type.name}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type.name}" ${type.name === this._tripPointType.name ? `checked` : ``}>
                                  <label class="event__type-label  event__type-label--${type.name}" for="event-type-${type.name}-1">${type.name}</label>
                                </div>
                                ` : ``).join(``)}
                            </fieldset>
                          </div>
                        </div>

                        <div class="event__field-group  event__field-group--destination">
                          <label class="event__label  event__type-output" for="event-destination-1">
                            ${this._tripPointType.name} ${EventNewTemplate.isMove(this._tripPointType)}
                          </label>
                          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${this._destination}" list="destination-list-1">
                          <datalist id="destination-list-1">
                            ${this._destinations.map((dest)=>`
                              <option value="${dest}"></option>
                              `).join(``)}
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
