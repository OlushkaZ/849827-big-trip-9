const EVENTS_COUNT = 4;
const tripPoints = [];
import {SiteMenuTemplate} from './components/site-menu.js';
import {SiteFilterTemplate} from './components/site-filter.js';
import {RouteTemplate} from './components/current-route.js';
import {EventTemplate} from './components/trip-event.js';
import {EventEditTemplate} from './components/trip-event-edit.js';
import {EventListTemplate} from './components/trip-event-list.js';
import {NoPointsTemplate} from './components/no-points.js';

import {getTripPoint, filter, menu} from './data.js';
import {render, Position} from './utils.js';

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
const renderSiteMenuTemplate = () => {
  const siteMenuTemplate = new SiteMenuTemplate(menu);
  render(siteControlsElement.firstElementChild, siteMenuTemplate.getElement(), Position.ARTEREND);
};
renderSiteMenuTemplate();

const renderSiteFilterTemplate = () => {
  const siteFilterTemplate = new SiteFilterTemplate(filter);
  render(siteControlsElement, siteFilterTemplate.getElement(), Position.BEFOREEND);
};
renderSiteFilterTemplate();

const pointMocks = new Array(EVENTS_COUNT)
.fill(``)
.map(getTripPoint);
tripPoints.push(...pointMocks);

const tripEventsElement = document.querySelector(`.trip-events`);
const renderEventListTemplate = () => {
  const eventListTemplate = new EventListTemplate();
  render(tripEventsElement, eventListTemplate.getElement(), Position.BEFOREEND);
};
const renderNoPointsTemplate = () => {
  const noPointsTemplate = new NoPointsTemplate();
  render(tripEventsElement, noPointsTemplate.getElement(), Position.BEFOREEND);
};
if (tripPoints.length === 0) {
  renderNoPointsTemplate();
} else {
  renderEventListTemplate();
}


const eventsListContainer = tripEventsElement.querySelector(`.trip-events__list`);
const renderTripPoint = (pointMock) => {
  const tripEvent = new EventTemplate(pointMock);
  const tripEventEdit = new EventEditTemplate(pointMock);

  const onEscKeyDown = (evt) => {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      eventsListContainer.replaceChild(tripEvent.getElement(), tripEventEdit.getElement());
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  tripEvent.getElement()
    .querySelector(`.event__rollup-btn`)
    .addEventListener(`click`, () => {
      eventsListContainer.replaceChild(tripEventEdit.getElement(), tripEvent.getElement());
      document.addEventListener(`keydown`, onEscKeyDown);
    });

  tripEventEdit.getElement()
  .querySelector(`.event--edit`)
  .addEventListener(`submit`, ()=>{
    eventsListContainer.replaceChild(tripEvent.getElement(), tripEventEdit.getElement());
    document.removeEventListener(`keydown`, onEscKeyDown);
  });

  render(eventsListContainer, tripEvent.getElement(), Position.BEFOREEND);
};

if (eventsListContainer) {
  pointMocks.forEach((pointMock) => renderTripPoint(pointMock));
}


const siteRouteElement = tripMainElement.querySelector(`.trip-main__trip-info`);
const renderRouteTemplate = () => {
  const routeTemplate = new RouteTemplate(getRoute());
  render(siteRouteElement, routeTemplate.getElement(), Position.AFTERBEGIN);
};
renderRouteTemplate();

const tripCost = tripMainElement.querySelector(`.trip-info__cost-value`);
const getTotalCost = () => tripPoints.reduce((sum, {price})=> sum + price, 0);
tripCost.textContent = getTotalCost();
