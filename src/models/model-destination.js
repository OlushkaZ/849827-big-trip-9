export class ModelDestination {
  constructor(data) {
    // this.id = data[`id`];
    this.description = data[`description`] || ``;
    // this.dueDate = new Date(data[`due_date`]);
    this.pictures = data[`pictures`] || [];
    // this.repeatingDays = data[`repeating_days`];
    this.name = data[`name`];
    // this.isFavorite = Boolean(data[`is_favorite`]);
    // this.isArchive = Boolean(data[`is_archive`]);
  }

  static parseDestination(data) {
    return new ModelDestination(data);
  }

  static parseDestinations(data) {
    return data.map(ModelDestination.parseDestination);
  }
}
