import {TripDayTemplate} from '../components/trip-day.js';
import {EventListTemplate} from '../components/trip-event-list.js';
import {NoPointsTemplate} from '../components/no-points.js';
import {SortingList} from '../components/sorting-list.js';
import {PointController, Mode} from './point.js';
import {render, unrender, Position} from '../utils.js';
const PointControllerMode = Mode;
const DEFAULT_POINT_TYPE = `flight`;

export class TripController {
  constructor(container, onDataChange) {
    this._container = container;
    this._tripPoints = [];
    this._currentSorting = `sort-event`;
    this._sort = new SortingList(this._currentSorting);
    this._eventList = new EventListTemplate();
    this._noPointsTemplate = new NoPointsTemplate();
    this._subscriptions = [];
    this._creatingTripPoint = null;
    this._onChangeView = this._onChangeView.bind(this);
    this._onDataChange = onDataChange;
    this._deleteNewPoint = this._deleteNewPoint.bind(this);
  }

  show(points) {
    this._tripPoints = points;

    // this._container.innerHTML = ``;
    // this._eventList.getElement().innerHTML = ``;
    unrender(this._sort);
    unrender(this._eventList);
    if (this._tripPoints.length === 0) {
      render(this._container, this._noPointsTemplate.getElement(), Position.BEFOREEND);
    } else {//если есть хоть одна точка
      this._sort = new SortingList(this._currentSorting);
      render(this._container, this._sort.getElement(), Position.BEFOREEND);
      this._sort.getElement().addEventListener(`click`, (evt) => this._onSortLinkClick(evt));

      render(this._container, this._eventList.getElement(), Position.BEFOREEND);
      this._renderEvents();
    }
  }

  createTripPoint() {

    if (this._creatingTripPoint) {
      return;
    }

    const defaultPoint = {
      // description: ``,
      startDate: new Date(),
      finishDate: new Date(),
      destination: {},
      type: DEFAULT_POINT_TYPE,
      price: 0,
      offers: [],
    };

    this._creatingTripPoint = true;
    // this._onDataChange(defaultPoint, null);
    let container = ``;
    if (this._tripPoints.length > 0) {
      container = this._container.querySelector(`.trip-events__trip-sort`);
    } else {
      unrender(this._noPointsTemplate);
      container = this._container.firstElementChild;
    }
    this._creatingTripPoint = new PointController(container, defaultPoint, PointControllerMode.ADDING, this._onDataChange, this._onChangeView, this._deleteNewPoint);
  }

  _renderDays() {
    TripDayTemplate.count = null;
    const allDays = this._tripPoints.map(({startDate}) => (new Date(startDate)).setHours(0, 0, 0, 0)).slice().sort((a, b)=>a - b);
    const unicumDays = allDays.filter((item, pos)=>allDays.indexOf(item) === pos);
    const container = this._eventList.getElement();
    unicumDays.forEach(function (day) {
      const countEventsInDay = allDays.filter((item)=>item === day).length;
      render(container, new TripDayTemplate(day, countEventsInDay).getElement(), Position.BEFOREEND);
    });
  }

  _renderEvents() {
    switch (this._currentSorting) {
      case `sort-event`:
        // TripDayTemplate.count = null;
        this._renderDays();
        const containers = this._eventList.getElement().querySelectorAll(`.trip-events__item`);
        const sortedByStartTime = this._tripPoints.slice().sort((a, b) => a.startDate - b.startDate);
        sortedByStartTime.forEach((tripPoint, ind) => this._renderTripPoint(containers[ind], tripPoint));
        break;
      case `sort-time`:
        render(this._eventList.getElement(), new TripDayTemplate(0, this._tripPoints.length).getElement(), Position.BEFOREEND);
        const containersByTime = this._eventList.getElement().querySelectorAll(`.trip-events__item`);
        const sortedByTime = this._tripPoints.slice().map(function (point) {
          point.duration = point.finishDate - point.startDate;
          return point;
        }).sort((a, b) => b.duration - a.duration);
        sortedByTime.forEach((tripPoint, ind) => this._renderTripPoint(containersByTime[ind], tripPoint));
        break;
      case `sort-price`:
        render(this._eventList.getElement(), new TripDayTemplate(0, this._tripPoints.length).getElement(), Position.BEFOREEND);
        const containersByPrice = this._eventList.getElement().querySelectorAll(`.trip-events__item`);
        const sortedByPrice = this._tripPoints.slice().sort((a, b) => b.price - a.price);
        sortedByPrice.forEach((tripPoint, ind) => this._renderTripPoint(containersByPrice[ind], tripPoint));
        break;
    }
  }

  _renderTripPoint(container, point) {
    const pointController = new PointController(container, point, PointControllerMode.DEFAULT, this._onDataChange, this._onChangeView, this._deleteNewPoint);
    this._subscriptions.push(pointController.setDefaultView.bind(pointController));
  }

  _onChangeView() {
    this._subscriptions.forEach((it) => it());
  }

  _deleteNewPoint() {
    if (this._creatingTripPoint) {
      unrender(this._creatingTripPoint._tripEventNew);
      this._creatingTripPoint = null;
      // this.show(this._tripPoints);
    }
  }

  _onSortLinkClick(evt) {
    // if (this._creatingTripPoint) {
    //   return;
    // }
    evt.preventDefault();
    if (evt.target.tagName !== `LABEL`) {
      return;
    }
    this._eventList.getElement().innerHTML = ``;
    this._currentSorting = evt.target.htmlFor;
    this._renderEvents();
    document.getElementById(evt.target.htmlFor).checked = true;
  }
}
