export const createSiteFilterTemplate = (filter) => `
  <form class="trip-filters" action="#" method="get">
  ${filter.map((filterItem)=>`
  <div class="trip-filters__filter">
    <input id="filter-${filterItem.title}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${filterItem.title}" ${filterItem.checked ? `checked` : ``}>
    <label class="trip-filters__filter-label" for="filter-${filterItem.title}">${filterItem.title}</label>
  </div>
  `).join(``)}
  <button class="visually-hidden" type="submit">Accept filter</button>
</form>
`;
