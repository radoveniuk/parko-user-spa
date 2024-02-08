import { IPrepayment } from 'interfaces/prepayment.interface';

export type ClientRowProps = {
  cols: string[];
  data: IPrepayment;
  selected?: boolean;
}
