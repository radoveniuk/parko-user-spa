export interface IDayOff {
  _id: string;
  userId: string;
  dateStart: string;
  dateEnd: string;
  reason: string;
  description?: string;
  adminComment?: string;
  isApproved: boolean | null;
  createdAt?: Date;
}
