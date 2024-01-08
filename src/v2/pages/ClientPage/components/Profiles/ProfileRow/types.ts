import { IUser } from 'interfaces/users.interface';

export type ProfileRowProps = {
  cols: string[];
  data: IUser;
  selected: boolean;
  onChangeSelect(val: boolean): void;
}
