import {AbstractComponent} from './abstract-component.js';
export class SiteMenuTemplate extends AbstractComponent {
  constructor(menu) {
    super();
    this._element = null;
    this._menu = menu;
  }

  getTemplate() {
    return `<nav class="trip-controls__trip-tabs  trip-tabs">
      ${this._menu.map((menuItem)=>`<a class="trip-tabs__btn  ${menuItem.active ? `trip-tabs__btn--active` : ``}" href="#">${menuItem.title}</a>`).join(``)}

    </nav>`;
  }
}
