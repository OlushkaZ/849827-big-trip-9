export class ModelOffer {
  constructor(offer) {
    this.offers = offer[`offers`] || [];
    this.type = offer[`type`];
  }

  static parseOffer(offer) {
    return new ModelOffer(offer);
  }

  static parseOffers(offers) {
    return offers.map(ModelOffer.parseOffer);
  }

  toRAW() {
    return {
      'offers': [...this.offers.values()],
      'type': this.type,
    };
  }
}
