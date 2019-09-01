export const createSiteMenuTemplate = (menu) => `<nav class="trip-controls__trip-tabs  trip-tabs">
  ${menu.map((menuItem)=>`<a class="trip-tabs__btn  ${menuItem.active ? `trip-tabs__btn--active` : ``}" href="#">${menuItem.title}</a>`).join(``)}

</nav>`;
