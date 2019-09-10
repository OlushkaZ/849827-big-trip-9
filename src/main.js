const EVENTS_COUNT = 4;
const tripPoints = [];
import {SiteMenuTemplate} from './components/site-menu.js';
import {SiteFilterTemplate} from './components/site-filter.js';
import {RouteTemplate} from './components/current-route.js';
import {TripController} from './controllers/trip.js';

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
const tripController = new TripController(tripEventsElement, pointMocks);
tripController.init();

const siteRouteElement = tripMainElement.querySelector(`.trip-main__trip-info`);
const renderRouteTemplate = () => {
  const routeTemplate = new RouteTemplate(getRoute());
  render(siteRouteElement, routeTemplate.getElement(), Position.AFTERBEGIN);
};
renderRouteTemplate();

const tripCost = tripMainElement.querySelector(`.trip-info__cost-value`);
const getTotalCost = () => tripPoints.reduce((sum, {price})=> sum + price, 0);
tripCost.textContent = getTotalCost();
