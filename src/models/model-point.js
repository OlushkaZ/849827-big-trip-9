export class ModelPoint {
  constructor(data) {
    this.id = data[`id`];
    this.price = data[`base_price`];
    this.startDate = new Date(data[`date_from`]);
    this.finishDate = new Date(data[`date_to`]);
    this.destination = data[`destination`] || {};
    this.isFavorite = Boolean(data[`is_favorite`]);
    this.offers = data[`offers`] || [];
    this.type = data[`type`];
  }

  static parsePoint(data) {
    return new ModelPoint(data);
  }

  static parsePoints(data) {
    return data.map(ModelPoint.parsePoint);
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
