export interface IDayOff {
  _id: string;
  userId: string;
  dateStart: Date;
  dateEnd: Date;
  reason: string;
  description?: string;
  isApproved: boolean | null;
  createdAt?: Date;
}
