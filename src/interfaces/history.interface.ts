import { IProject } from './project.interface';

export interface IWorkHistoryLog {
  _id?: string,
  dateFrom: string;
  dateTo?: string;
  project: string | Pick<IProject, '_id' | 'name' | 'client'>
  user: string;
  position: string;
};
