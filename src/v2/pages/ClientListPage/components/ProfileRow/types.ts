import { IClient } from 'interfaces/client.interface';
import { IUser } from 'interfaces/users.interface';

export type ClientRowProps = {
  cols: string[];
  data: IClient;
  selected?: boolean;
  onChangeSelect?(val: boolean): void;
  startEdit?(): void;
  saveEdit?(values: IUser): void;
}
