import {EventTemplate} from '../components/trip-event.js';
import {EventEditTemplate} from '../components/trip-event-edit.js';
import {EventEditTemplateOffers} from '../components/trip-event-edit-offers.js';
import {EventEditTemplateDetails} from '../components/trip-event-edit-details.js';
import {EventEditTemplateDestination} from '../components/trip-event-edit-destination.js';
import {EventNewTemplate} from '../components/trip-event-new.js';
import {ModelPoint} from '../models/model-point.js';
import {render, unrender, createElement, isEmpty, Position, Key, tripPointTypes} from '../utils.js';
import {api} from '../main.js';
import moment from 'moment';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.css';
import 'flatpickr/dist/themes/light.css';

export const Mode = {
  ADDING: `adding`,
  DEFAULT: `default`
};

export class PointController {
  constructor(container, data, mode, onDataChange, onChangeView, deleteNewPoint) {
    this._container = container;
    this._data = data;
    this._onChangeView = onChangeView;
    this._onDataChange = onDataChange;
    this._deleteNewPoint = deleteNewPoint;
    this._tripEvent = new EventTemplate(data);
    this._tripEventEdit = new EventEditTemplate(data);
    this._tripEventEditDetails = new EventEditTemplateDetails(data);
    this._tripEventEditOffers = new EventEditTemplateOffers(data.offers);
    this._tripEventEditDestination = new EventEditTemplateDestination(data);
    this._tripEventNew = new EventNewTemplate(data);
    this._api = api;
    this.shake = this.shake.bind(this);
    this.unblock = this.unblock.bind(this);

    this.init(mode);
  }

  init(mode) {
    let renderPosition = Position.BEFOREEND;
    let currentView = this._tripEvent;

    if (mode === Mode.ADDING) {
      renderPosition = Position.AFTEREND;
      currentView = this._tripEventNew;
    }

    const element = mode === Mode.ADDING ? this._tripEventNew : this._tripEventEdit;

    const onTypeChoose = (evt)=>{
      if (evt.target.tagName === `INPUT`) {
        // const element = mode === Mode.ADDING ? this._tripEventNew : this._tripEventEdit;
        const pointType = tripPointTypes.filter((type)=>type.name === evt.target.value)[0];

        element.getElement()
                  .querySelector(`.event__label`).textContent = evt.target.value + (pointType.move ? ` to` : ` in`);
        element.getElement()
                  .querySelector(`.event__type-icon`).src = `img/icons/${evt.target.value}.png`;
        evt.target.checked = true;
        // typeToggle.checked = false;
        element.getElement().querySelector(`.event__type-toggle`).checked = false;
        getNewOffers(evt);
        if (mode === Mode.ADDING) {
          render(this._tripEventNew.getElement(), this._tripEventEditDetails.getElement(), Position.BEFOREEND);
        }
        // render(this._tripEventEditDetails.getElement(), this._tripEventEditOffers.getElement(), Position.AFTERBEGIN);

        typeList.removeEventListener(`click`, onTypeChoose);
      }
    };
    let currentDestination = this._data.destination;
    // if (mode !== Mode.ADDING) {
    const typeList = this._tripEventEdit.getElement().querySelector(`.event__type-list`);
    const typeToggle = this._tripEventEdit.getElement().querySelector(`.event__type-toggle`);
    typeToggle.addEventListener(`change`, ()=>
      typeList.addEventListener(`click`, onTypeChoose)
    );


    const destinationList = element.getElement().querySelector(`datalist`);
    while (destinationList.firstElementChild) {
      destinationList.removeChild(destinationList.firstElementChild);
    }
    this._api.getDestinations().then((destinations) => destinations
       .map(({name}) => render(destinationList, createElement(`<option value="` + name + `">`), Position.BEFOREEND)));
    const destinationDescriptionContainer = this._tripEventEditDestination.getElement()
       .querySelector(`.event__destination-description`);
    const fillDesinationDescription = (desc)=>{
      destinationDescriptionContainer.textContent = desc;
    };
    const destinationPhotoContainer = this._tripEventEditDestination.getElement()
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
            if (dest.description) {
              fillDesinationDescription(dest.description);
            }
            if (dest.pictures) {
              fillDesinationPhotos(dest.pictures);
            }
          });
      };

    this._tripEventEdit.getElement()
              .querySelector(`.event__input--destination`)
              .addEventListener(`change`, onDestinationChange);
/////////////////////////new////////////////////////////////////////

    const getNewOffers = (evt) =>{
      const newPointType = evt.target.value;
      // let newOffers = [];
      this._api.getOffers().then((offers) => offers
                     .filter(({type})=> type === newPointType))
                     .then(([offer])=> {
                       renderNewoffers(offer.offers);
                     });
    };

    const renderNewoffers = (offers) => {
      unrender(this._tripEventEditOffers);
      this._tripEventEditOffers = new EventEditTemplateOffers(offers);
      if (offers.length > 0) {
        render(this._tripEventEditDetails.getElement(), this._tripEventEditOffers.getElement(), Position.AFTERBEGIN);
      }

    };
    const newPointtypeList = this._tripEventNew.getElement().querySelector(`.event__type-list`);
    const newPointtypeToggle = this._tripEventNew.getElement().querySelector(`.event__type-toggle`);
    newPointtypeToggle.addEventListener(`change`, ()=>
      newPointtypeList.addEventListener(`click`, onTypeChoose)
    );

    const onNewPointDestinationChange = (evt) =>{
      render(this._tripEventNew.getElement(), this._tripEventEditDetails.getElement(), Position.BEFOREEND);
      render(this._tripEventEditDetails.getElement(), this._tripEventEditDestination.getElement(), Position.BEFOREEND);

      const newDestination = evt.target.value;
      this._api.getDestinations().then((destinations) => destinations
                  .filter(({name})=> name === newDestination))
                  .then(([dest])=>{
                    currentDestination = dest;
                    if (dest.description) {
                      fillDesinationDescription(dest.description);
                    }
                    if (dest.pictures) {
                      fillDesinationPhotos(dest.pictures);
                    }
                  });
    };

    this._tripEventNew.getElement()
              .querySelector(`.event__input--destination`)
              .addEventListener(`change`, onNewPointDestinationChange);
    // }

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
         this._deleteNewPoint();
         this._onChangeView();
         this._container.replaceChild(this._tripEventEdit.getElement(), this._tripEvent.getElement());
         render(this._tripEventEdit.getElement(), this._tripEventEditDetails.getElement(), Position.BEFOREEND);
         if (this._data.offers.length > 0) {
           render(this._tripEventEditDetails.getElement(), this._tripEventEditOffers.getElement(), Position.BEFOREEND);
         }
         if (this._data.destination.description) {
           render(this._tripEventEditDetails.getElement(), this._tripEventEditDestination.getElement(), Position.BEFOREEND);
         }
         document.addEventListener(`keydown`, onEscKeyDown);
       });

    this._tripEventEdit.getElement()
     .addEventListener(`submit`, (evt)=>{
       evt.preventDefault();
       this._container.replaceChild(this._tripEvent.getElement(), this._tripEventEdit.getElement());
       document.removeEventListener(`keydown`, onEscKeyDown);
     });

    // const element = mode === Mode.ADDING ? this._tripEventNew : this._tripEventEdit;
    element.getElement()
     .querySelector(`.event__save-btn`)
     .addEventListener(`click`, (evt) => {
       evt.preventDefault();

       const formData = new FormData(element.getElement());
       const newPoint = Object.create(this._data);
       // const newPoint = Object.create(new ModelPoint());

       // newPoint.id = this._data.id;
       newPoint.type = formData.get(`event-type`);
       newPoint.destination = currentDestination;
       newPoint.isFavorite = formData.get(`event-favorite`) ? true : false;
       newPoint.startDate = moment(formData.get(`event-start-time`), `YYYY-MM-DD HH:mm`).toDate();
       newPoint.finishDate = moment(formData.get(`event-end-time`), `YYYY-MM-DD HH:mm`).toDate();
       newPoint.price = Number(formData.get(`event-price`));
       newPoint.offers = this._getOffers(element);

       this.block();

       // this._onDataChange(`update`, mode === Mode.DEFAULT ? newPoint : null);
       const badData = this._findBadData(newPoint, element);
       if (badData === null) {
         evt.target.textContent = `Saving...`;
         if (mode === Mode.ADDING) {
           this._onDataChange(`create`, ModelPoint.toRAWNewPoint(newPoint), this.shake, this.unblock, this._deleteNewPoint);
         } else {
           // evt.target.textContent = `Saving...`;
           this._onDataChange(`update`, newPoint, this.shake, this.unblock, this._deleteNewPoint);
         }
       } else {
         this.shake(badData);
         this.unblock();
       }
       // this._deleteNewPoint();

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

    this._tripEventNew
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
        this._onDataChange(`delete`, this._data, this.shake, this.unblock, this._deleteNewPoint);
      });

    this._tripEventNew.getElement().querySelector(`.event__reset-btn`)
      .addEventListener(`click`, () => {
        this._deleteNewPoint();
      });

    render(this._container, currentView.getElement(), renderPosition);
  }

  _getOffers(element) {
    const offerChecks = element.getElement().querySelectorAll(`.event__offer-checkbox`);
    const offerTitle = element.getElement().querySelectorAll(`.event__offer-title`);
    const offerPrice = element.getElement().querySelectorAll(`.event__offer-price`);
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
  shake(element = this._tripEventEdit.getElement()) {
    const ANIMATION_TIMEOUT = 600;
    element.style.animation = `shake ${ANIMATION_TIMEOUT / 1000}s`;
    setTimeout(() => {
      element.style.animation = ``;
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
  _findBadData(newPoint, element) {
    if (isEmpty(newPoint.destination)) {
      return element.getElement().querySelector(`.event__field-group`);
    }
    if (newPoint.startDate > newPoint.finishDate) {
      return element.getElement().querySelector(`.event__field-group--time`);
    }
    return null;
  }

  setDefaultView() {
    if (this._container.contains(this._tripEventEdit.getElement())) {
      this._container.replaceChild(this._tripEvent.getElement(), this._tripEventEdit.getElement());
    }
  }


}
