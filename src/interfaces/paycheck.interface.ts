export interface IPaycheck {
  _id: string;
  user: string;
  project: string;
  date: string;
  linkedFile: string;
  createdAt?: string;
}
