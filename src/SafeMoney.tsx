import { money } from './logic';
import { isSafeMoney, UNSAFE_MONEY_MESSAGE } from './limits';

// Last display barrier, independent of input validation. Never format an unsafe sum.
export default function SafeMoney({ value }: { value: number }) {
  return isSafeMoney(value) ? <>{money(value)}</> : <span className="money-warning" role="status">{UNSAFE_MONEY_MESSAGE}</span>;
}
