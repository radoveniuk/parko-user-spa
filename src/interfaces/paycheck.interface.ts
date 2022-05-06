export interface IPaycheck {
  _id: string;
  userId: string;
  project: string;
  date: string;
  linkedFile: string;
  createdAt?: string;
}
