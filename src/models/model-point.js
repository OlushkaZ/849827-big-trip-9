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
}
