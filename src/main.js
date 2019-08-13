import {createSiteMenuTemplate} from './components/site-menu.js';
import {createSiteFilterTemplate} from './components/site-filter.js';
import {createRouteTemplate} from './components/current-route.js';
import {createEventTemplate} from './components/trip-event.js';
import {createEventEditTemplate} from './components/trip-event-edit.js';
import {createEventListTemplate} from './components/trip-event-list.js';

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const siteControlsElement = document.querySelector(`.trip-main__trip-controls`);
render(siteControlsElement.firstElementChild, createSiteMenuTemplate(), `afterend`);
render(siteControlsElement, createSiteFilterTemplate(), `beforeend`);

const siteRouteElement = document.querySelector(`.trip-main__trip-info`);
render(siteRouteElement, createRouteTemplate(), `afterbegin`);
const tripEventsElement = document.querySelector(`.trip-events`);
render(tripEventsElement, createEventListTemplate(), `beforeend`);
const eventsListElement = tripEventsElement.querySelector(`.trip-events__list`);
render(eventsListElement, createEventEditTemplate(), `afterbegin`);
new Array(3).fill(``).forEach(() => render(eventsListElement, createEventTemplate(), `beforeend`));
