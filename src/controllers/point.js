import {EventTemplate} from '../components/trip-event.js';
import {EventEditTemplate} from '../components/trip-event-edit.js';
import {render, Position, Key} from '../utils.js';
import moment from 'moment';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.css';
import 'flatpickr/dist/themes/light.css';
// const flatpickr = require(`flatpickr`);
// import flatpickr from 'https://cdn.jsdelivr.net/npm/flatpickr';
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
     .addEventListener(`submit`, ()=>{
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
       this._onDataChange(entry, this._data);
       document.removeEventListener(`keydown`, onEscKeyDown);
     });
    this._tripEventEdit
            .getElement()
            .querySelectorAll(`.event__input--time`).forEach((timeInput)=>{
              flatpickr(timeInput, {
                enableTime: true,
                altInput: true,
                allowInput: true,
                // defaultDate: timeInput.value.getTime(),
                defaultDate: moment(timeInput.value, `DD-MM-YY HH:mm`).toDate().getTime(),
                // defaultDate: this._data.startDate,
                altFormat: `d/m/y H:i`,
              });
            });

    //     flatpickr(this._tripEventEdit.getElement()
    //.querySelector(`.event__input--time`), {
    //   // plugins: [new confirmDatePlugin()],
    //dataFormat: `d/m/y H:i`,
    // });
    render(this._container, this._tripEvent.getElement(), Position.BEFOREEND);
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
