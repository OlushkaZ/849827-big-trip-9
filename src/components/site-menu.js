import {createElement} from '../utils.js';
export class SiteMenuTemplate {
  constructor(menu) {
    this._element = null;
    this._menu = menu;
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }
    return this._element;
  }

  removeElement() {
    this._element = null;
  }

  getTemplate() {
    return `<nav class="trip-controls__trip-tabs  trip-tabs">
      ${this._menu.map((menuItem)=>`<a class="trip-tabs__btn  ${menuItem.active ? `trip-tabs__btn--active` : ``}" href="#">${menuItem.title}</a>`).join(``)}

    </nav>`;
  }
}
