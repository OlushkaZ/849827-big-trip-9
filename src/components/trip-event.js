
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
        <time class="event__start-time" datetime="${new Date(startDate)}">${new Date(startDate).toDateString()}</time>
        &mdash;
        <time class="event__end-time" datetime="${new Date(finishDate)}">${new Date(finishDate).toDateString()}</time>
      </p>
      <p class="event__duration">${new Date(finishDate) - new Date(startDate)}</p>
    </div>

    <p class="event__price">
      &euro;&nbsp;<span class="event__price-value">${price}</span>
    </p>

    <h4 class="visually-hidden">Offers:</h4>
    <ul class="event__selected-offers">
    ${offers.map((offer, ind)=>offer.check && ind < 2 ? `<li class="event__offer">
          <span class="event__offer-title">${offer.name}</span>
          &plus;
          &euro;&nbsp;<span class="event__offer-price">${offer.price}</span>
         </li>` : ``).join(``)}

    </ul>

    <button class="event__rollup-btn" type="button">
      <span class="visually-hidden">Open event</span>
    </button>
  </div>
</li>`;
};
