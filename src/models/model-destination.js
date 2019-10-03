export class ModelDestination {
  constructor(data) {
    this.description = data[`description`] || ``;
    this.pictures = data[`pictures`] || [];
    this.name = data[`name`];
  }

  static parseDestination(data) {
    return new ModelDestination(data);
  }

  static parseDestinations(data) {
    return data.map(ModelDestination.parseDestination);
  }
}
