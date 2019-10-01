// const EVENTS_COUNT = 4;
let tripPoints = [];
let tripController = {};
import {SiteMenuTemplate} from './components/site-menu.js';
import {SiteFilterTemplate} from './components/site-filter.js';
import {RouteTemplate} from './components/current-route.js';
import {TripController} from './controllers/trip.js';
import {Statistics} from './components/statistics.js';
import {API} from './api.js';

import {filter, menu} from './data.js';
import {render, Position} from './utils.js';

const AUTHORIZATION = `Basic ao0w590ik29889aaa=${Math.random()}`;
const END_POINT = `https://htmlacademy-es-9.appspot.com/big-trip`;

export const api = new API({endPoint: END_POINT, authorization: AUTHORIZATION});
const zzz = api.getPoints().then((points) => console.log(points));
const rrr = api.getDestinations().then((destinations) => console.log(destinations));
// const uuu = api.getDestinations();
// console.log(uuu);
// const onDataChange = () => {};

// const boardController = new BoardController(taskListElement, onDataChange);

// api.getTasks().then((tasks) => boardController.show(tasks));

const getRoute = ()=>{
  const cities = tripPoints.map(({destination}) => destination);
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
  siteMenuTemplate.getElement().addEventListener(`click`, (evt) => {
    evt.preventDefault();

    if (evt.target.tagName !== `A`) {
      return;
    }
    // tripEventsElement.classList.toggle(`trip-events--hidden`);
    // statistics.getElement().classList.toggle(`visually-hidden`);

    switch (evt.target.textContent) {
      case `table`:
        tripEventsElement.classList.remove(`trip-events--hidden`);
        siteFilterTemplate.getElement().classList.remove(`trip-filters--hidden`);
        const stat = statistics.getElement();
        if (!stat.classList.contains(`visually-hidden`)) {
          stat.classList.add(`visually-hidden`);
        }
        break;
      case `stats`:
        if (!tripEventsElement.classList.contains(`trip-events--hidden`)) {
          tripEventsElement.classList.add(`trip-events--hidden`);
        }
        const siteFilter = siteFilterTemplate.getElement();
        if (!siteFilter.classList.contains(`trip-filters--hidden`)) {
          siteFilter.classList.add(`trip-filters--hidden`);
        }
        statistics.getElement().classList.remove(`visually-hidden`);
        break;
    }
  });
  render(siteControlsElement.firstElementChild, siteMenuTemplate.getElement(), Position.AFTEREND);
};
renderSiteMenuTemplate();

const siteFilterTemplate = new SiteFilterTemplate(filter);
const renderSiteFilterTemplate = () => {
  render(siteControlsElement, siteFilterTemplate.getElement(), Position.BEFOREEND);
};
renderSiteFilterTemplate();
const newEventButton = tripMainElement.querySelector(`.trip-main__event-add-btn`);
newEventButton.addEventListener(`click`, (evt) => {
  evt.preventDefault();
  tripController.createTripPoint();
});

// const pointMocks = new Array(EVENTS_COUNT)
// .fill(``)
// .map(getTripPoint);
// tripPoints.push(...pointMocks);

const tripEventsElement = document.querySelector(`.trip-events`);
api.getPoints().then((points) => {
  tripController = new TripController(tripEventsElement, onDataChange);
  tripController.show(points);
  tripPoints = points;
});
// const tripController = new TripController(tripEventsElement, pointMocks);
// tripController.init();
render(tripEventsElement, statistics.getElement(), Position.AFTEREND);

const siteRouteElement = tripMainElement.querySelector(`.trip-main__trip-info`);
const renderRouteTemplate = () => {
  const routeTemplate = new RouteTemplate(getRoute());
  render(siteRouteElement, routeTemplate.getElement(), Position.AFTERBEGIN);
};
renderRouteTemplate();

const tripCost = tripMainElement.querySelector(`.trip-info__cost-value`);
const getTotalCost = () => tripPoints.reduce((sum, {price})=> sum + price, 0);
tripCost.textContent = getTotalCost();

const onDataChange = (actionType, update, shake, unblock) => {
  // eventTemplate.block();
  switch (actionType) {
    case `update`:
      api.updatePoint({
        id: update.id,
        data: update.toRAW()
      })
      .then(() => api.getPoints())
      .then((points) => {
        tripController.show(points);
      });
      break;
    case `create`:
      api.createPoint({
        data: update
      })
        .then(() => api.getPoints())
        .then((points) => {
          tripController.show(points);
        });
      break;
    case `delete`:
      api.deletePoint({
        id: update.id
      })
        .then((response) => {
          if (response.ok) {
            // shake();
            return api.getPoints();
          }
          throw new Error(`Неизвестный статус: ${response.status} ${response.statusText}`);
        })
        .then((points) => {
          tripController.show(points);
          // this._eventList.getElement().innerHTML = ``;
          // this._tripPoints = tasks;
          // this._renderEventList(this._tripPoints);
        })
        .catch(() => {
          shake();
          unblock();
        });
      break;
  }
}
