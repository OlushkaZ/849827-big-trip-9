import {EventTemplate} from '../components/trip-event.js';
import {EventEditTemplate} from '../components/trip-event-edit.js';
import {render, Position, Key} from '../utils.js';
export class PointController {
  constructor(container, data, onDataChange, onChangeView) {
    this._container = container;
    this._data = data;
    this._onChangeView = onChangeView;
    this._onDataChange = onDataChange;
    this._tripEvent = new EventTemplate(data);
    this._tripEventEdit = new EventEditTemplate(data);

    this.init();
  }
  init() {
    const onEscKeyDown = (evt) => {
      if (evt.key === Key.ESCAPE || evt.key === Key.ESCAPE_IE) {
        this._container.replaceChild(this._tripEvent.getElement(), this._tripEventEdit.getElement());
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };

    this._tripEvent.getElement()
       .querySelector(`.event__rollup-btn`)
       .addEventListener(`click`, (evt) => {
         evt.preventDefault();
         this._onChangeView();
         this._container.replaceChild(this._tripEventEdit.getElement(), this._tripEvent.getElement());
         document.addEventListener(`keydown`, onEscKeyDown);
       });

    this._tripEventEdit.getElement()
     // .querySelector(`.event`)
     .addEventListener(`submit`, ()=>{
       this._container.replaceChild(this._tripEvent.getElement(), this._tripEventEdit.getElement());
       document.removeEventListener(`keydown`, onEscKeyDown);
     });

    render(this._container, this._tripEvent.getElement(), Position.BEFOREEND);
  }

  setDefaultView() {
    if (this._container.contains(this._tripEventEdit.getElement())) {
      this._container.replaceChild(this._tripEvent.getElement(), this._tripEventEdit.getElement());
    }
  }
}
