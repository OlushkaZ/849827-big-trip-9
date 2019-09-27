import {EventTemplate} from '../components/trip-event.js';
import {EventEditTemplate} from '../components/trip-event-edit.js';
import {EventNewTemplate} from '../components/trip-event-new.js';
import {render, createElement, Position, Key} from '../utils.js';
import {api} from '../main.js';
import moment from 'moment';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.css';
import 'flatpickr/dist/themes/light.css';

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
    this.shake = this.shake.bind(this);
    this.unblock = this.unblock.bind(this);

    this.init(mode);
  }

  init(mode) {
    let renderPosition = Position.BEFOREEND;
    let currentView = this._tripEvent;

    if (mode === Mode.ADDING) {
      renderPosition = Position.BEFOREBEGIN;
      currentView = this._tripEventNew;
    }
    const onTypeChoose = (evt)=>{
      if (evt.target.tagName === `INPUT`) {
        const pointType = tripPointTypes.filter((type)=>type.name === evt.target.value)[0];

        this._tripEventEdit.getElement()
                  .querySelector(`.event__label`).textContent = evt.target.value + (pointType.move ? ` to` : ` in`);
        this._tripEventEdit.getElement()
                  .querySelector(`.event__type-icon`).src = `img/icons/${evt.target.value}.png`;
        evt.target.checked = true;
        typeToggle.checked = false;
        typeList.removeEventListener(`click`, onTypeChoose);
      }
    };
    const typeList = this._tripEventEdit.getElement().querySelector(`.event__type-list`);
    const typeToggle = this._tripEventEdit.getElement().querySelector(`.event__type-toggle`);
    typeToggle.addEventListener(`change`, ()=>
      typeList.addEventListener(`click`, onTypeChoose)
    );

    let currentDestination = this._data.destination;
    const destinationList = this._tripEventEdit.getElement().querySelector(`datalist`);
    while (destinationList.firstElementChild) {
      destinationList.removeChild(destinationList.firstElementChild);
    }
    this._api.getDestinations().then((destinations) => destinations
       .map(({name}) => render(destinationList, `<option value="` + name + `">`, Position.BEFOREEND)));
    const destinationDescriptionContainer = this._tripEventEdit.getElement()
       .querySelector(`.event__destination-description`);
    const fillDesinationDescription = (desc)=>{
      destinationDescriptionContainer.textContent = desc;
    };
    const destinationPhotoContainer = this._tripEventEdit.getElement()
       .querySelector(`.event__photos-tape`);

    const getPhotoTemplate = (pict)=>`<img class="event__photo" src="${pict.src}" alt="${pict.description}">`;

    const fillDesinationPhotos = (pictures)=>{
      while (destinationPhotoContainer.firstElementChild) {
        destinationPhotoContainer.removeChild(destinationPhotoContainer.firstElementChild);
      }
      pictures.map((pict)=>render(destinationPhotoContainer, createElement(getPhotoTemplate(pict)), Position.BEFOREEND));
      // render(destinationPhotoContainer, createElement(getPhotos(pictures)), Position.BEFOREEND);
    };
    const onDestinationChange = (evt) =>{
      const newDestination = evt.target.value;
      this._api.getDestinations().then((destinations) => destinations
          .filter(({name})=> name === newDestination))
          .then(([dest])=>{
            currentDestination = dest;
            fillDesinationDescription(dest.description);
            fillDesinationPhotos(dest.pictures);
          });
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
          // this._onDataChange(null, null);
        }
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
       const newPoint = Object.create(this._data);

       newPoint.type = formData.get(`event-type`);
       newPoint.destination = currentDestination;
       newPoint.isFavorite = formData.get(`event-favorite`) ? true : false;
       newPoint.startDate = moment(formData.get(`event-start-time`), `YYYY-MM-DD HH:mm`).toDate();
       newPoint.finishDate = moment(formData.get(`event-end-time`), `YYYY-MM-DD HH:mm`).toDate();
       newPoint.price = Number(formData.get(`event-price`));
       newPoint.offers = this._getOffers();

       this._onDataChange(`update`, mode === Mode.DEFAULT ? newPoint : null);

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
      .addEventListener(`click`, (evt) => {
        this.block();
        evt.target.textContent = `Deleting...`;
        this._onDataChange(`delete`, this._data, this.shake, this.unblock);
      });

    render(this._container, currentView.getElement(), renderPosition);
  }

  _getOffers() {
    const offerChecks = this._tripEventEdit.getElement().querySelectorAll(`.event__offer-checkbox`);
    const offerTitle = this._tripEventEdit.getElement().querySelectorAll(`.event__offer-title`);
    const offerPrice = this._tripEventEdit.getElement().querySelectorAll(`.event__offer-price`);
    const offers = [];
    offerChecks.forEach(function (item, ind) {
      const offer = {};
      offer.title = offerTitle[ind].textContent;
      offer.price = Number(offerPrice[ind].textContent);
      offer.accepted = item.checked;
      offers.push(offer);
    });
    return offers;
  }
  // _getEventType() {
  //   const typeCheckbox = this._tripEventEdit.getElement().querySelector(`.event__type-toggle`);
  //   const inputs = this._tripEventEdit.getElement().querySelectorAll(`.event__type-input`);
  //   const eventTypeInput = Array.from(inputs).filter((input)=>input.checked);
  //   const eventType = {};
  //   eventType.name = eventTypeInput[0].value;
  //   eventType.move = typeCheckbox.checked;
  //   return eventType;
  // }
  shake() {
    const ANIMATION_TIMEOUT = 600;
    this._tripEventEdit.getElement().style.animation = `shake ${ANIMATION_TIMEOUT / 1000}s`;
    this._tripEventEdit.getElement().style.border = `2px solid red`;
    setTimeout(() => {
      this._tripEventEdit.getElement().style.animation = ``;
    }, ANIMATION_TIMEOUT);
  }

  block() {
    this._tripEventEdit.getElement().querySelector(`.event__save-btn`).disabled = true;
    this._tripEventEdit.getElement().querySelector(`.event__reset-btn`).disabled = true;
  }

  unblock() {
    this._tripEventEdit.getElement().querySelector(`.event__save-btn`).disabled = false;
    this._tripEventEdit.getElement().querySelector(`.event__reset-btn`).disabled = false;
  }

  setDefaultView() {
    if (this._container.contains(this._tripEventEdit.getElement())) {
      this._container.replaceChild(this._tripEvent.getElement(), this._tripEventEdit.getElement());
    }
  }
}
