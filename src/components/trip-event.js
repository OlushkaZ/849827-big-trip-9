const getDate = (date)=> new Date(date);
const getDateString = (date)=> date.toDateString();
export const createEventTemplate = ({tripPointType, destination, startDate, finishDate, price, offers}) => {
  return `
 <li class="trip-events__item">
  <div class="event">
    <div class="event__type">
      <img class="event__type-icon" width="42" height="42" src="img/icons/${tripPointType.name}.png" alt="Event type icon">
    </div>
    <h3 class="event__title">${tripPointType.name} ${tripPointType.move ? ` to` : ` in`} ${destination}</h3>

    <div class="event__schedule">
      <p class="event__time">
        <time class="event__start-time" datetime="${getDate(startDate)}">${getDateString(getDate(startDate))}</time>
        &mdash;
        <time class="event__end-time" datetime="${getDate(finishDate)}">${getDateString(getDate(finishDate))}</time>
      </p>
      <p class="event__duration">${getDate(finishDate) - getDate(startDate)}</p>
    </div>

    <p class="event__price">
      &euro;&nbsp;<span class="event__price-value">${price}</span>
    </p>

    <h4 class="visually-hidden">Offers:</h4>
    <ul class="event__selected-offers">
    ${offers.map((offer)=>offer.check ? `<li class="event__offer">
          <span class="event__offer-title">${offer.name}</span>
          &plus;
          &euro;&nbsp;<span class="event__offer-price">${offer.price}</span>
         </li>` : ``).slice(0, 2).join(``)}

    </ul>

    <button class="event__rollup-btn" type="button">
      <span class="visually-hidden">Open event</span>
    </button>
  </div>
</li>`;
};
