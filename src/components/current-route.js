export const createRouteTemplate = ([one, two, three]) => {
  return `<div class="trip-info__main">
  <h1 class="trip-info__title">${one} &mdash; ${two} &mdash; ${three}</h1>

  <p class="trip-info__dates">Mar 18&nbsp;&mdash;&nbsp;21</p>
</div>`;
};
