import { IUser } from 'interfaces/users.interface';

export type ProfileRowProps = {
  editingMode: boolean;
  cols: string[];
  data: IUser;
  selected: boolean;
  onChangeSelect(val: boolean): void;
  startEdit(): void;
  saveEdit(values: IUser): void;
}
