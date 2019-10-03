export const Position = {
  AFTERBEGIN: `afterbegin`,
  AFTEREND: `afterend`,
  BEFOREEND: `beforeend`,
  BEFOREBEGIN: `beforebegin`
};

export const Key = {
  ESCAPE: `Esc`,
  ESCAPE_IE: `Escape`
};

export const filter = [
  {title: `everything`, checked: true},
  {title: `future`, checked: false},
  {title: `past`, count: false}
];

export const menu = [
  {title: `table`, active: true},
  {title: `stats`, active: false}
];

export const tripPointTypes = [
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

export const createElement = (template)=>{
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;
  return newElement.firstChild;
};

export const render = (container, element, place)=>{
  switch (place) {
    case Position.AFTERBEGIN:
      container.prepend(element);
      break;
    case Position.AFTEREND:
      container.after(element);
      break;
    case Position.BEFOREBEGIN:
      container.before(element);
      break;
    case Position.BEFOREEND:
      container.append(element);
      break;
  }
};

export const unrender = (element)=>{
  if (element._element) {
    element._element.remove();
  }
  element.removeElement();

};

export const isEmpty = (object)=>{
  return JSON.stringify(object) === `{}` ? true : false;
};

export const getTotalCost = (points)=>points
         .slice()
         .reduce((sum, point)=> sum + point.price + point.offers
         .filter(({accepted})=>accepted)
         .reduce((pointSum, {price})=> pointSum + price, 0), 0);

export const getDurationTime = (duration)=>{
  // const duration = finishDate - startDate;
  const durationInMinutes = Math.floor((duration) / 1000 / 60);
  const durationInHours = Math.floor((durationInMinutes) / 60);
  const days = Math.floor((durationInHours) / 24);
  const minutes = durationInMinutes % 60;
  const hours = days ? durationInHours % 24 : durationInHours;
  let result = (`00` + minutes).slice(-2) + `M`;
  result = hours ? (`00` + hours).slice(-2) + `H ` + result : result;
  result = days ? (`00` + days).slice(-2) + `D ` + result : result;
  return result;
};
