import { postalCodeToRegion } from './postalCodeToRegion';

const allPostalCodes = [
  "75001", "69002", "13001", "34000", "33000", "31000", "44000", "67000", "06000"
];

export const suggestions = allPostalCodes.map(code => ({
  code,
  region: postalCodeToRegion(code)
}));
