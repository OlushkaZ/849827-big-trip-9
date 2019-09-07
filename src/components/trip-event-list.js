import {AbstractComponent} from './abstract-component.js';
export class EventListTemplate extends AbstractComponent {

  getTemplate() {
    return `<ul class="trip-events__list">
        </ul>`;
  }
}
