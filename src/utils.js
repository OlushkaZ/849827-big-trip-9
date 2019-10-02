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
