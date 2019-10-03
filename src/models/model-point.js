export class ModelPoint {
  constructor(point) {
    this.id = point[`id`];
    this.price = point[`base_price`];
    this.startDate = new Date(point[`date_from`]);
    this.finishDate = new Date(point[`date_to`]);
    this.destination = point[`destination`] || {};
    this.isFavorite = Boolean(point[`is_favorite`]);
    this.offers = point[`offers`] || [];
    this.type = point[`type`];
  }

  static parsePoint(point) {
    return new ModelPoint(point);
  }

  static parsePoints(points) {
    return points.map(ModelPoint.parsePoint);
  }

  toRAW() {
    return {
      'id': this.id,
      'base_price': this.price,
      'date_from': this.startDate.getTime(),
      'date_to': this.finishDate.getTime(),
      'destination': this.destination,
      'is_favorite': this.isFavorite,
      'offers': [...this.offers.values()],
      'type': this.type,
    };
  }

  static toRAWNewPoint(point) {
    return {
      'base_price': point.price,
      'date_from': point.startDate.getTime(),
      'date_to': point.finishDate.getTime(),
      'destination': point.destination,
      'is_favorite': point.isFavorite,
      'offers': [...point.offers.values()],
      'type': point.type,
    };
  }
}
