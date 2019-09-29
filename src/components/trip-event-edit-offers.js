
import {AbstractComponent} from './abstract-component.js';
export class EventEditTemplateOffers extends AbstractComponent {
  constructor({type, offers}, tripPointTypes) {
    super();
    this._type = type;
    this._types = tripPointTypes;
    // this._startDate = new Date(startDate);
    // this._finishDate = new Date(finishDate);
    // this._destination = destination.name;
    // this._description = destination.description;
    // this._price = price;
    this._offers = offers;
    // this._pictures = destination.pictures;
    // this._isFavorite = isFavorite;
  }

  getTemplate() {
    return `<section class="event__section  event__section--offers">
                            <h3 class="event__section-title  event__section-title--offers">Offers</h3>

                            <div class="event__available-offers">
                              ${this._offers.map((offer)=>`
                              <div class="event__offer-selector">
                                <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.title}-1" type="checkbox" name="${offer.title}" ${offer.accepted ? `checked` : ``}>
                                <label class="event__offer-label" for="event-offer-${offer.title}-1">
                                  <span class="event__offer-title">${offer.title}</span>
                                  &plus;
                                  &euro;&nbsp;<span class="event__offer-price">${offer.price}</span>
                                </label>
                              </div>
                              `).join(``)}
                            </div>
                          </section>`;
  }
}
