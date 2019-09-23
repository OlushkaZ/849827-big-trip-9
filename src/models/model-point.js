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
    // this.isArchive = Boolean(data[`is_archive`]);
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
}
