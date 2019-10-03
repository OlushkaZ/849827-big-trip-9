export class ModelOffer {
  constructor(data) {
    this.offers = data[`offers`] || [];
    this.type = data[`type`];
  }

  static parseOffer(data) {
    return new ModelOffer(data);
  }

  static parseOffers(data) {
    return data.map(ModelOffer.parseOffer);
  }

  toRAW() {
    return {
      'offers': [...this.offers.values()],
      'type': this.type,
    };
  }
}
