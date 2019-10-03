import {SiteMenuTemplate} from './components/site-menu.js';
import {SiteFilterTemplate} from './components/site-filter.js';
import {RouteTemplate} from './components/current-route.js';
import {RouteLoadingTemplate} from './components/current-route-loading.js';
import {TripController} from './controllers/trip.js';
import {Statistics} from './components/statistics.js';
import {API} from './api.js';
import {render, unrender, Position, getTotalCost, filter, menu} from './utils.js';

const AUTHORIZATION = `Basic ao0w590ik29889aaa=${Math.random()}`;
const END_POINT = `https://htmlacademy-es-9.appspot.com/big-trip`;
let tripPoints = [];
let tripController = {};

export const api = new API({endPoint: END_POINT, authorization: AUTHORIZATION});

const getRoute = ()=>{
  const cities = tripPoints.map(({destination}) => destination.name);
  const routePoints = new Array(3);
  routePoints[0] = cities.shift();
  routePoints[2] = cities.length === 0 ? routePoints[0] : cities.pop();
  routePoints[1] = cities.length === 1 ? cities.pop() : `...`;
  routePoints[3] = tripPoints.length > 0 ? tripPoints[0].startDate : ``;
  routePoints[4] = tripPoints.length > 0 ? tripPoints[tripPoints.length - 1].finishDate : ``;
  return routePoints;
};
const statistics = new Statistics();
statistics.getElement().classList.add(`visually-hidden`);

const tripMainElement = document.querySelector(`.trip-main`);
const siteControlsElement = tripMainElement.querySelector(`.trip-main__trip-controls`);
const renderSiteMenuTemplate = () => {
  const siteMenuTemplate = new SiteMenuTemplate(menu);
  const tripTabs = siteMenuTemplate.getElement();
  const tableLink = tripTabs.firstElementChild;
  const statisticsLink = tripTabs.lastElementChild;
  siteMenuTemplate.getElement().addEventListener(`click`, (evt) => {
    evt.preventDefault();

    if (evt.target.tagName !== `A`) {
      return;
    }

    switch (evt.target.textContent) {
      case menu[0].title:
        tripEventsElement.classList.remove(`trip-events--hidden`);
        siteFilterTemplate.getElement().classList.remove(`trip-filters--hidden`);
        unrender(statistics);
        if (!tableLink.classList.contains(`trip-tabs__btn--active`)) {
          tableLink.classList.add(`trip-tabs__btn--active`);
        }
        statisticsLink.classList.remove(`trip-tabs__btn--active`);
        break;
      case menu[1].title:
        if (!tripEventsElement.classList.contains(`trip-events--hidden`)) {
          tripEventsElement.classList.add(`trip-events--hidden`);
        }
        const siteFilter = siteFilterTemplate.getElement();
        if (!siteFilter.classList.contains(`trip-filters--hidden`)) {
          siteFilter.classList.add(`trip-filters--hidden`);
        }
        render(tripEventsElement, statistics.getElement(), Position.AFTEREND);
        statistics.getElement().classList.remove(`visually-hidden`);
        statistics.buildChart(tripPoints);

        if (!statisticsLink.classList.contains(`trip-tabs__btn--active`)) {
          statisticsLink.classList.add(`trip-tabs__btn--active`);
        }
        tableLink.classList.remove(`trip-tabs__btn--active`);
        break;
    }
  });
  render(siteControlsElement.firstElementChild, siteMenuTemplate.getElement(), Position.AFTEREND);
};
renderSiteMenuTemplate();

const siteFilterTemplate = new SiteFilterTemplate(filter);
const renderSiteFilterTemplate = () => {
  render(siteControlsElement, siteFilterTemplate.getElement(), Position.BEFOREEND);
  siteFilterTemplate.getElement().addEventListener(`click`, (evt) => onFilterLinkClick(evt));
};
renderSiteFilterTemplate();
const newEventButton = tripMainElement.querySelector(`.trip-main__event-add-btn`);
newEventButton.addEventListener(`click`, (evt) => {
  evt.preventDefault();
  tripController.createTripPoint();
});

const siteRouteElement = tripMainElement.querySelector(`.trip-main__trip-info`);
let routeLoadingTemplate;
const renderRouteLoadingTemplate = () => {
  routeLoadingTemplate = new RouteLoadingTemplate();
  render(siteRouteElement, routeLoadingTemplate.getElement(), Position.AFTERBEGIN);
};
renderRouteLoadingTemplate();

const renderRouteTemplate = () => {
  unrender(routeLoadingTemplate);
  const routeTemplate = new RouteTemplate(getRoute());
  render(siteRouteElement, routeTemplate.getElement(), Position.AFTERBEGIN);
};

const tripCost = tripMainElement.querySelector(`.trip-info__cost-value`);
const renderTotalCost = () => {
  tripCost.textContent = getTotalCost(tripPoints);
};
const tripEventsElement = document.querySelector(`.trip-events`);
api.getPoints().then((points) => {
  tripController = new TripController(tripEventsElement, onDataChange);
  tripController.show(points);
  tripPoints = points;
}).then(renderRouteTemplate).then(renderTotalCost);

const refreshPoints = (points)=>{
  tripPoints = points;
  renderTotalCost();
  tripController.show(points);
};

const onDataChange = (actionType, update, shake, unblock, deleteNewPoint) => {
  switch (actionType) {
    case `update`:
      api.updatePoint({
        id: update.id,
        data: update.toRAW()
      })
      .then((response) => {
        if (response) {
          return api.getPoints();
        }
        throw new Error(`Неизвестный статус: ${response.status} ${response.statusText}`);
      })
      .then((points) => {
        refreshPoints(points);
      })
      .catch(() => {
        shake();
        unblock();
      });
      break;
    case `create`:
      api.createPoint({
        data: update
      })
        .then((response) => {
          if (response) {
            return api.getPoints();
          }
          throw new Error(`Неизвестный статус: ${response.status} ${response.statusText}`);
        })
        .then((points) => {
          deleteNewPoint();
          refreshPoints(points);
        })
        .catch(() => {
          shake();
          unblock();
        });
      break;
    case `delete`:
      api.deletePoint({
        id: update.id
      })
        .then((response) => {
          if (response.ok) {
            return api.getPoints();
          }
          throw new Error(`Неизвестный статус: ${response.status} ${response.statusText}`);
        })
        .then((points) => {
          refreshPoints(points);
        })
        .catch(() => {
          shake();
          unblock();
        });
      break;
  }
};

const onFilterLinkClick = (evt)=> {
  evt.preventDefault();
  if (evt.target.tagName !== `LABEL`) {
    return;
  }
  tripController.setFilter(evt.target.htmlFor);
  tripController.show(tripPoints);
  document.getElementById(evt.target.htmlFor).checked = true;
};
