const EVENTS_COUNT = 4;
const tripPoints = [];
import {createSiteMenuTemplate} from './components/site-menu.js';
import {createSiteFilterTemplate} from './components/site-filter.js';
import {createRouteTemplate} from './components/current-route.js';
import {createEventTemplate} from './components/trip-event.js';
import {createEventEditTemplate} from './components/trip-event-edit.js';
import {createEventListTemplate} from './components/trip-event-list.js';

import {getTripPoint} from './data.js';
import {filter} from './data.js';
import {menu} from './data.js';

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};
const getRoute = ()=>{
  const cities = tripPoints.map(({destination}) => destination);
  const routePoints = new Array(3);
  routePoints[0] = cities.shift();
  routePoints[2] = cities.length === 0 ? routePoints[0] : cities.pop();
  routePoints[1] = cities.length === 1 ? cities.pop() : `...`;
  return routePoints;
};
const tripMainElement = document.querySelector(`.trip-main`);
const siteControlsElement = tripMainElement.querySelector(`.trip-main__trip-controls`);
render(siteControlsElement.firstElementChild, createSiteMenuTemplate(menu), `afterend`);
render(siteControlsElement, createSiteFilterTemplate(filter), `beforeend`);

const tripEventsElement = document.querySelector(`.trip-events`);
render(tripEventsElement, createEventListTemplate(), `beforeend`);
const eventsListElement = tripEventsElement.querySelector(`.trip-events__list`);
const newTripPoint = getTripPoint();
tripPoints.push(newTripPoint);
render(eventsListElement, createEventEditTemplate(newTripPoint), `afterbegin`);
tripPoints.push(...(new Array(EVENTS_COUNT - 1)
  .fill(``)
  .map(getTripPoint)));

const renderEvents = (container) => {
  container.insertAdjacentHTML(`beforeend`,
      tripPoints.slice(1).map(createEventTemplate)
    .join(``));
};

renderEvents(eventsListElement);
const siteRouteElement = tripMainElement.querySelector(`.trip-main__trip-info`);
render(siteRouteElement, createRouteTemplate(getRoute()), `afterbegin`);

const tripCost = tripMainElement.querySelector(`.trip-info__cost-value`);
const getTotalCost = () => tripPoints.reduce((sum, {price})=> sum + price, 0);
tripCost.textContent = getTotalCost();
