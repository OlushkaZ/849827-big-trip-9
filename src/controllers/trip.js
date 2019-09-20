import {TripDayTemplate} from '../components/trip-day.js';
import {EventListTemplate} from '../components/trip-event-list.js';
import {NoPointsTemplate} from '../components/no-points.js';
import {SortingList} from '../components/sorting-list.js';
import {PointController, Mode} from './point.js';
import {render, unrender, Position} from '../utils.js';
const PointControllerMode = Mode;

export class TripController {
  constructor(container, tripPoints) {
    this._container = container;
    this._tripPoints = tripPoints;
    this._sort = new SortingList();
    this._eventList = new EventListTemplate();
    this._noPointsTemplate = new NoPointsTemplate();
    this._subscriptions = [];
    this._creatingTripPoint = null;
    this._onChangeView = this._onChangeView.bind(this);
    this._onDataChange = this._onDataChange.bind(this);
  }
  init() {
    if (this._tripPoints.length === 0) {
      render(this._container, this._noPointsTemplate.getElement(), Position.BEFOREEND);
    } else {
      render(this._container, this._sort.getElement(), Position.BEFOREEND);
      this._sort.getElement().addEventListener(`click`, (evt) => this._onSortLinkClick(evt));
      const sortedByStartTime = this._tripPoints.slice().sort((a, b) => a.startDate - b.startDate);
      render(this._container, this._eventList.getElement(), Position.BEFOREEND);
      this._renderEvents(sortedByStartTime);
    }
  }

  createTripPoint() {

    if (this._creatingTripPoint) {
      return;
    }

    const defaultPoint = {
      description: ``,
      startDate: new Date(),
      finishDate: new Date(),
      destination: [],
      tripPointType: {},
      price: 0,
      offers: [],
    };

    this._creatingTripPoint = true;
    // this._onDataChange(defaultPoint, null);
    const container = this._container.querySelector(`.trip-days`);
    this._creatingTripPoint = new PointController(container, defaultPoint, PointControllerMode.ADDING, this._onChangeView, this._onDataChange);
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

  _renderEvents(sortedTripPoints) {
    this._renderDays();
    const containers = this._eventList.getElement().querySelectorAll(`.trip-events__item`);
    sortedTripPoints.forEach((tripPoint, ind) => this._renderTripPoint(containers[ind], tripPoint));
  }

  _renderEventList() {
    unrender(this._eventList.getElement());
    this._eventList.removeElement();
    render(this._container, this._eventList.getElement(), Position.BEFOREEND);
    const sortedByStartTime = this._tripPoints.slice().sort((a, b) => a.startDate - b.startDate);
    this._renderEvents(sortedByStartTime);
  }

  _renderTripPoint(container, point) {
    const pointController = new PointController(container, point, PointControllerMode.DEFAULT, this._onDataChange, this._onChangeView);
    this._subscriptions.push(pointController.setDefaultView.bind(pointController));
  }

  _onChangeView() {
    this._subscriptions.forEach((it) => it());
  }

  _onDataChange(newData, oldData) {
    const index = this._tripPoints.findIndex((point) => point === oldData);

    if (newData === null && oldData === null) {
      this._creatingTripPoint = null;
    }

    if (newData === null) {
      this._tripPoints = [...this._tripPoints.slice(0, index), ...this._tripPoints.slice(index + 1)];
      // this._showedPoints = Math.min(this._showedPoints, this._tripPoints.length);
    } else if (oldData === null) {
      this._creatingTripPoint = null;
      this._tripPoints = [newData, ...this._tripPoints];
    } else {
      this._tripPoints[index] = newData;
    }

    this._renderEventList(this._tripPoints);
  }

  _onSortLinkClick(evt) {
    evt.preventDefault();

    if (evt.target.tagName !== `LABEL`) {
      return;
    }

    this._eventList.getElement().innerHTML = ``;

    switch (evt.target.htmlFor) {
      case `sort-event`:
        // TripDayTemplate.count = null;
        const sortedByStartTime = this._tripPoints.slice().sort((a, b) => a.startDate - b.startDate);
        this._renderEvents(sortedByStartTime);
        document.getElementById(evt.target.htmlFor).checked = true;
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
    document.getElementById(evt.target.htmlFor).checked = true;
  }
}
