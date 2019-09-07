import {EventTemplate} from '../components/trip-event.js';
import {EventEditTemplate} from '../components/trip-event-edit.js';
import {TripDaysTemplate} from '../components/trip-days.js';
import {EventListTemplate} from '../components/trip-event-list.js';
import {NoPointsTemplate} from '../components/no-points.js';
import {render, Position, Key} from '../utils.js';

export class TripController {
  constructor(container, tripPoints) {
    this._container = container;
    this._tripPoints = tripPoints;
    this._tripDays = new TripDaysTemplate();
    this._eventList = new EventListTemplate();
    this._noPointsTemplate = new NoPointsTemplate();
  }

  init() {
    if (this._tripPoints.length === 0) {
      render(this._container, this._noPointsTemplate.getElement(), Position.BEFOREEND);
    } else {
      render(this._container, this._tripDays.getElement(), Position.BEFOREEND);
      render(this._tripDays.getElement(), this._eventList.getElement(), Position.BEFOREEND);
      this._tripPoints.forEach((tripPoint) => this._renderTripPoint(tripPoint));
    }
  }

  _renderTripPoint(point) {
    const tripEvent = new EventTemplate(point);
    const tripEventEdit = new EventEditTemplate(point);

    const onEscKeyDown = (evt) => {
      if (evt.key === Key.ESCAPE || evt.key === Key.ESCAPE_IE) {
        this._eventList.getElement().replaceChild(tripEvent.getElement(), tripEventEdit.getElement());
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };

    tripEvent.getElement()
       .querySelector(`.event__rollup-btn`)
       .addEventListener(`click`, () => {
         this._eventList.getElement().replaceChild(tripEventEdit.getElement(), tripEvent.getElement());
         document.addEventListener(`keydown`, onEscKeyDown);
       });

    tripEventEdit.getElement()
     .querySelector(`.event--edit`)
     .addEventListener(`submit`, ()=>{
       this._eventList.getElement().replaceChild(tripEvent.getElement(), tripEventEdit.getElement());
       document.removeEventListener(`keydown`, onEscKeyDown);
     });

    render(this._eventList.getElement(), tripEvent.getElement(), Position.BEFOREEND);
  }
}
