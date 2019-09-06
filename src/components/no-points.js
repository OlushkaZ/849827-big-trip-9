import {AbstractComponent} from './abstract-component.js';
export class NoPointsTemplate extends AbstractComponent {
  constructor() {
    super();
    this._element = null;
  }

  getTemplate() {
    return `<p class="trip-events__msg">Click New Event to create your first point</p>`;
  }
}
