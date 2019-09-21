import {EventTemplate} from '../components/trip-event.js';
import {EventEditTemplate} from '../components/trip-event-edit.js';
import {EventNewTemplate} from '../components/trip-event-new.js';
import {render, Position, Key} from '../utils.js';
import {api} from '../main.js';
import moment from 'moment';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.css';
import 'flatpickr/dist/themes/light.css';
// const flatpickr = require(`flatpickr`);
// import flatpickr from 'https://cdn.jsdelivr.net/npm/flatpickr';
export const Mode = {
  ADDING: `adding`,
  DEFAULT: `default`
};
const tripPointTypes = [
  {name: `bus`, move: true},
  {name: `flight`, move: true},
  {name: `drive`, move: true},
  {name: `ship`, move: true},
  {name: `taxi`, move: true},
  {name: `train`, move: true},
  {name: `transport`, move: true},
  {name: `check-in`, move: false},
  {name: `restaurant`, move: false},
  {name: `sightseeing`, move: false}
];

export class PointController {
  constructor(container, data, mode, onDataChange, onChangeView) {
    this._container = container;
    this._data = data;
    this._onChangeView = onChangeView;
    this._onDataChange = onDataChange;
    this._tripEvent = new EventTemplate(data, tripPointTypes);
    this._tripEventEdit = new EventEditTemplate(data, tripPointTypes);
    this._tripEventNew = new EventNewTemplate(data, tripPointTypes);
    this._api = api;
    // this._arr = [];

    this.init(mode);
  }

  init(mode) {
    let renderPosition = Position.BEFOREEND;
    let currentView = this._tripEvent;

    if (mode === Mode.ADDING) {
      renderPosition = Position.BEFOREBEGIN;
      currentView = this._tripEventNew;
    }
    const destinationList = this._tripEventEdit.getElement().querySelector(`datalist`);
    while (destinationList.firstElementChild) {
      destinationList.removeChild(destinationList.firstElementChild);
    }

    this._api.getDestinations().then((destinations) => destinations
       .map(({name}) => render(destinationList, `<option value="` + name + `">`, Position.BEFOREEND)));
    const destinationDescriptionContainer = this._tripEventEdit.getElement()
       .querySelector(`.event__destination-description`);
    const fillDesinationDescription = (dest)=>{
      destinationDescriptionContainer.textContent = dest;
    };
    const onDestinationChange = (evt) =>{
      // Array.from(destinationList.children).map();
      const newDestination = evt.target.value;
      this._api.getDestinations().then((destinations) => destinations
          .filter(({name})=> name === newDestination))
          .then(([dest])=>fillDesinationDescription(dest.description));
      // .then(([dest])=>render(destinationList, dest.description, Position.BEFOREEND));
    };
    this._tripEventEdit.getElement()
              .querySelector(`.event__input--destination`)
              .addEventListener(`change`, onDestinationChange);


    const onEscKeyDown = (evt) => {
      if (evt.key === Key.ESCAPE || evt.key === Key.ESCAPE_IE) {

        if (mode === Mode.DEFAULT) {
          if (this._container.contains(this._tripEventEdit.getElement())) {
            // this._container.getElement().replaceChild(this._taskView.getElement(), this._taskEdit.getElement());
            this._container.replaceChild(this._tripEvent.getElement(), this._tripEventEdit.getElement());
          }
        } else if (mode === Mode.ADDING) {
          this._container.removeChild(currentView.getElement());
          // Захотели создать карточку, но не стали ее сохранять
          this._onDataChange(null, null);
        }
        // this._container.replaceChild(this._tripEvent.getElement(), this._tripEventEdit.getElement());
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
     .addEventListener(`submit`, (evt)=>{
       evt.preventDefault();
       this._container.replaceChild(this._tripEvent.getElement(), this._tripEventEdit.getElement());
       document.removeEventListener(`keydown`, onEscKeyDown);
     });

    this._tripEventEdit.getElement()
     .querySelector(`.event__save-btn`)
     .addEventListener(`click`, (evt) => {
       evt.preventDefault();

       const formData = new FormData(this._tripEventEdit.getElement());

       const entry = {
         tripPointType: this._getEventType(),
         destination: formData.get(`event-destination`),
         startDate: moment(formData.get(`event-start-time`), `YYYY-MM-DD HH:mm`).toDate().getTime(),
         finishDate: moment(formData.get(`event-end-time`), `YYYY-MM-DD HH:mm`).toDate().getTime(),
         price: formData.get(`event-price`),
         description: this._tripEventEdit.getElement().querySelector(`.event__destination-description`).textContent,
         offers: this._getOffers()
       };

       this._onDataChange(entry, mode === Mode.DEFAULT ? this._data : null);
       // this._onDataChange(entry, this._data);
       document.removeEventListener(`keydown`, onEscKeyDown);
     });

    this._tripEventEdit
            .getElement()
            .querySelectorAll(`.event__input--time`).forEach((timeInput)=>{
              flatpickr(timeInput, {
                enableTime: true,
                altInput: true,
                allowInput: true,
                defaultDate: moment(timeInput.value, `DD-MM-YY HH:mm`).toDate().getTime(),
                altFormat: `d/m/y H:i`,
              });
            });

    this._tripEventEdit.getElement().querySelector(`.event__reset-btn`)
      .addEventListener(`click`, () => {
        this._onDataChange(null, this._data);
      });

    render(this._container, currentView.getElement(), renderPosition);
  // render(this._container.getElement(), currentView.getElement(), renderPosition);
  }

  _getOffers() {
    const offerChecks = this._tripEventEdit.getElement().querySelectorAll(`.event__offer-checkbox`);
    const offerTitle = this._tripEventEdit.getElement().querySelectorAll(`.event__offer-title`);
    const offerPrice = this._tripEventEdit.getElement().querySelectorAll(`.event__offer-price`);
    const offers = [];
    offerChecks.forEach(function (item, ind) {
      const offer = {};
      offer.name = offerTitle[ind].textContent;
      offer.price = offerPrice[ind].textContent;
      offer.check = item.checked;
      offers.push(offer);
    });
    return offers;
  }
  _getEventType() {
    const typeCheckbox = this._tripEventEdit.getElement().querySelector(`.event__type-toggle`);
    const inputs = this._tripEventEdit.getElement().querySelectorAll(`.event__type-input`);
    const eventTypeInput = Array.from(inputs).filter((input)=>input.checked);
    // const type = eventTypeInput[0].parentNode.parentNode.textContent
    const eventType = {};
    eventType.name = eventTypeInput[0].value;
    eventType.move = typeCheckbox.checked;
    return eventType;
  }

  setDefaultView() {
    if (this._container.contains(this._tripEventEdit.getElement())) {
      this._container.replaceChild(this._tripEvent.getElement(), this._tripEventEdit.getElement());
    }
  }
}