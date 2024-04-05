import { IOrderStage } from 'interfaces/order.interface';

export const CANDIDATE_ORDER_STAGE: IOrderStage = {
  name: 'Kandidát',
  color: 'gray',
  staticName: 'candidate',
};

export const DEFAULT_ORDER_STAGES: IOrderStage[] = [
  {
    name: 'Kandidát',
    color: 'gray',
    staticName: 'candidate',
  },
  {
    name: 'Zamestnaný',
    color: 'green',
    staticName: 'hired',
  },
  {
    name: 'Zrušený',
    color: 'red',
    staticName: 'canceled',
  },
];
