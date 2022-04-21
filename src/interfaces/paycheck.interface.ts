export interface IPaycheck {
  _id: string;
  userId: string;
  project: string;
  date: Date;
  createdAt?: Date;
}
