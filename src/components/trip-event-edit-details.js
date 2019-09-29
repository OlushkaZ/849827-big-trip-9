import {AbstractComponent} from './abstract-component.js';
export class EventEditTemplateDetails extends AbstractComponent {
  // constructor({type, offers}, tripPointTypes) {
  //   super();
  //   // this._type = type;
  //   // this._types = tripPointTypes;
  //   // this._startDate = new Date(startDate);
  //   // this._finishDate = new Date(finishDate);
  //   // this._destination = destination.name;
  //   // this._description = destination.description;
  //   // this._price = price;
  //   // this._offers = offers;
  //   // this._pictures = destination.pictures;
  //   // this._isFavorite = isFavorite;
  // }

  getTemplate() {
    return `<section class="event__details">
          </section>`;
  }

}
