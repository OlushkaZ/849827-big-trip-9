import {EventTemplate} from '../components/trip-event.js';
import {EventEditTemplate} from '../components/trip-event-edit.js';
import {TripDayTemplate} from '../components/trip-day.js';
import {EventListTemplate} from '../components/trip-event-list.js';
import {NoPointsTemplate} from '../components/no-points.js';
import {SortingList} from '../components/sorting-list.js';
import {render, Position, Key} from '../utils.js';

export class TripController {
  constructor(container, tripPoints) {
    this._container = container;
    this._tripPoints = tripPoints;
    // this._tripDay = new TripDayTemplate(454545, 3);
    this._sort = new SortingList();
    this._eventList = new EventListTemplate();
    this._noPointsTemplate = new NoPointsTemplate();
  }
  static renderDays(tripPoints, container) {
    // let years = {};
    const allDays = tripPoints.map(({startDate}) => (new Date(startDate)).setHours(0, 0, 0, 0)).slice().sort((a, b)=>a - b);
    const unicumDays = allDays.filter((item, pos)=>allDays.indexOf(item) === pos);
    // const days = tripPoints.map(({startDate}) => new Date(startDate));
    unicumDays.forEach(function (day) {
      const countEventsInDay = allDays.filter((item)=>item === day).length;
      // for (let i = countEventsInDay; i--;) {
      render(container.getElement(), new TripDayTemplate(day, countEventsInDay).getElement(), Position.BEFOREEND);
      // }
    });
    // return unicumDays;
  }
  init() {
    if (this._tripPoints.length === 0) {
      render(this._container, this._noPointsTemplate.getElement(), Position.BEFOREEND);
    } else {
      render(this._container, this._sort.getElement(), Position.BEFOREEND);
      this._sort.getElement().addEventListener(`click`, (evt) => this._onSortLinkClick(evt));
      render(this._container, this._eventList.getElement(), Position.BEFOREEND);
      TripController.renderDays(this._tripPoints, this._eventList);
      const containers = this._eventList.getElement().querySelectorAll(`.trip-events__item`);
      const sortedByStartTime = this._tripPoints.slice().sort((a, b) => a.startDate - b.startDate);
      sortedByStartTime.forEach((tripPoint, ind) => this._renderTripPoint(tripPoint, containers[ind]));
    }
  }

  _renderTripPoint(point, container) {
    const tripEvent = new EventTemplate(point);
    const tripEventEdit = new EventEditTemplate(point);

    const onEscKeyDown = (evt) => {
      if (evt.key === Key.ESCAPE || evt.key === Key.ESCAPE_IE) {
        container.replaceChild(tripEvent.getElement(), tripEventEdit.getElement());
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };

    tripEvent.getElement()
       .querySelector(`.event__rollup-btn`)
       .addEventListener(`click`, () => {
         container.replaceChild(tripEventEdit.getElement(), tripEvent.getElement());
         document.addEventListener(`keydown`, onEscKeyDown);
       });

    tripEventEdit.getElement()
     // .querySelector(`.event`)
     .addEventListener(`submit`, ()=>{
       container.replaceChild(tripEvent.getElement(), tripEventEdit.getElement());
       document.removeEventListener(`keydown`, onEscKeyDown);
     });

    render(container, tripEvent.getElement(), Position.BEFOREEND);
  }

  _onSortLinkClick(evt) {
    evt.preventDefault();

    if (evt.target.tagName !== `LABEL`) {
      return;
    }

    this._eventList.getElement().innerHTML = ``;
    // let containers = this._eventList.getElement().querySelectorAll(`.trip-events__item`);

    switch (evt.target.htmlFor) {
      case `sort-event`:
        TripDayTemplate.count = null;
        TripController.renderDays(this._tripPoints, this._eventList);
        const containers = this._eventList.getElement().querySelectorAll(`.trip-events__item`);
        const sortedByStartTime = this._tripPoints.slice().sort((a, b) => a.startDate - b.startDate);
        sortedByStartTime.forEach((tripPoint, ind) => this._renderTripPoint(tripPoint, containers[ind]));
        // this._tripPoints.forEach((tripPoint) => this._renderTripPoint(tripPoint, this._eventList.getElement()));
        document.getElementById(evt.target.htmlFor).checked = true;
        break;
      case `sort-time`:
      // TripDayTemplate.count = null;
        render(this._eventList.getElement(), new TripDayTemplate(0, this._tripPoints.length).getElement(), Position.BEFOREEND);
        const containersByTime = this._eventList.getElement().querySelectorAll(`.trip-events__item`);
        const sortedByTime = this._tripPoints.slice().map(function (point) {
          point.duration = point.finishDate - point.startDate;
          return point;
        }).sort((a, b) => b.duration - a.duration);
        sortedByTime.forEach((tripPoint, ind) => this._renderTripPoint(tripPoint, containersByTime[ind]));
        break;
      case `sort-price`:
        // TripDayTemplate.count = null;
        render(this._eventList.getElement(), new TripDayTemplate(0, this._tripPoints.length).getElement(), Position.BEFOREEND);
        const containersByPrice = this._eventList.getElement().querySelectorAll(`.trip-events__item`);
        const sortedByPrice = this._tripPoints.slice().sort((a, b) => b.price - a.price);
        sortedByPrice.forEach((tripPoint, ind) => this._renderTripPoint(tripPoint, containersByPrice[ind]));
        break;
    }
    document.getElementById(evt.target.htmlFor).checked = true;
  }
}
