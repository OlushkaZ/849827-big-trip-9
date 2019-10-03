export class ModelDestination {
  constructor(destination) {
    this.description = destination[`description`] || ``;
    this.pictures = destination[`pictures`] || [];
    this.name = destination[`name`];
  }

  static parseDestination(destination) {
    return new ModelDestination(destination);
  }

  static parseDestinations(destinations) {
    return destinations.map(ModelDestination.parseDestination);
  }
}
