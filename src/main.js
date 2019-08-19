const EVENTS_COUNT = 3;
// let tripPoints = [];
// tripPoints.add(3);
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
  const arr = [];
  arr[0] = tripPoints ? tripPoints[0].destination : ``;
  arr[1] = tripPoints.length > 3 ? `...` : tripPoints[1].destination;
  arr[2] = tripPoints.length > 2 ? tripPoints[tripPoints.length - 1].destination : tripPoints[0].destination;
  return arr;
};
const siteControlsElement = document.querySelector(`.trip-main__trip-controls`);
render(siteControlsElement.firstElementChild, createSiteMenuTemplate(menu), `afterend`);
render(siteControlsElement, createSiteFilterTemplate(filter), `beforeend`);

const tripEventsElement = document.querySelector(`.trip-events`);
render(tripEventsElement, createEventListTemplate(), `beforeend`);
const eventsListElement = tripEventsElement.querySelector(`.trip-events__list`);
render(eventsListElement, createEventEditTemplate(getTripPoint()), `afterbegin`);
const getTripPoints = (count)=>new Array(count)
  .fill(``)
  .map(getTripPoint);
const tripPoints = getTripPoints(EVENTS_COUNT);

const renderEvents = (container) => {
  container.insertAdjacentHTML(`beforeend`,
      // new Array(count)
      // .fill(``)
      // .map(getTripPoint)
      // .map((item)=>tripPoints.push(item))
      tripPoints.map(createEventTemplate)
    .join(``));
};

renderEvents(eventsListElement);
const siteRouteElement = document.querySelector(`.trip-main__trip-info`);
render(siteRouteElement, createRouteTemplate(getRoute()), `afterbegin`);
// new Array(3).fill(``).forEach(() => render(eventsListElement, createEventTemplate(), `beforeend`));
