import { Decimal } from 'decimal.js-light';
import BN from 'bn.js';

Decimal.set({
  precision: 30,
  toExpNeg: -7,
  toExpPos: 29,
});

const n = new Decimal(60 * 60 * 24 * 365);

const lookup: { [fee: string]: string } = {};

/**
 * Get interest rate in percentage points for a specified fee.
 * This function uses a lookup table for performance reasons.
 * This function uses decimal.js-light, since we need non-integer powers for our calculations here.
 * We can remove that dependency in the future if we decide to either add a hardcoded
 * lookup table for fees and interest rates or if we decide to implement the relevant
 * functions here by hand.
 * @param fee Fee
 */
export const feeToInterestRate = (fee: string|BN): string => {

  if (typeof fee !== 'string' && typeof fee !== 'number') { fee = fee.toString(); }
  
  if ( fee.toString() === "0") { return fee.toString() }

  if (lookup[fee]) { return lookup[fee]; }

  const i = new Decimal(fee).div('1e27').pow(n);

  const interestRate = i.minus(1).mul(100).toSignificantDigits(2);

  const interestRateString = interestRate.toString();

  lookup[fee] = interestRateString;

  return interestRateString;
};
