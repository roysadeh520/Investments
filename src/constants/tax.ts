export const ISRAELI_TAX = {
  capitalGains: {
    standard: 0.25,
    significant: 0.30,
  },
  bankInterest: 0.15,
  cpiLinkedInterest: 0.25,
  surtax: {
    threshold: 721560,
    rate: 0.03,
  },
  rental: {
    exemptMonthlyThreshold: 5654,
    flatRate: 0.10,
    minMarginalRate: 0.31,
  },
  realEstate: {
    capitalGains: 0.25,
  },
  purchaseTaxBrackets: {
    firstApartment: [
      { upTo: 1978745, rate: 0 },
      { upTo: 2347040, rate: 0.035 },
      { upTo: 6055070, rate: 0.05 },
      { upTo: 20183565, rate: 0.08 },
      { upTo: Infinity, rate: 0.10 },
    ],
    additionalProperty: [
      { upTo: 6055070, rate: 0.08 },
      { upTo: Infinity, rate: 0.10 },
    ],
  },
};
