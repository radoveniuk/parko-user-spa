import { IClient } from 'interfaces/client.interface';

export type ClientRowProps = {
  cols: string[];
  data: IClient;
  selected?: boolean;
  editingMode: boolean;
  startEdit(): void;
  saveEdit(values: IClient): void;
}
