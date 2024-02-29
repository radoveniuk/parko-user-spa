import { IUser } from 'interfaces/users.interface';

export type ProfileRowProps = {
  cols: string[];
  data: IUser & { employmentStatus: string };
  selected: boolean;
  onChangeSelect(val: boolean): void;
}
