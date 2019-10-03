
import {AbstractComponent} from './abstract-component.js';
export class EventEditTemplateDestination extends AbstractComponent {
  constructor({destination}) {
    super();
    this._destination = destination.name;
    this._description = destination.description;
    this._pictures = destination.pictures;
  }

  _getPhotos() {
    if (this._pictures) {
      return this._pictures.map((picture)=>`<img class="event__photo" src="${picture.src}" alt="${picture.description}">
     `).join(``);
    }
    return ``;
  }

  getTemplate() {
    return `<section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${this._description}</p>

      <div class="event__photos-container">
        <div class="event__photos-tape">
        ${this._getPhotos()}
        </div>
      </div>
    </section>`;
  }
}
