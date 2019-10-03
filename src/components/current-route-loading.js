import {AbstractComponent} from './abstract-component.js';
export class RouteLoadingTemplate extends AbstractComponent {

  getTemplate() {
    return `<div class="trip-info__main">
    <h1 class="trip-info__title">Loading...</h1>

    <p class="trip-info__dates"></p>
  </div>`;
  }
}
