export interface IProject {
  _id: string;
  email: string;
  phone: string;
  name: string;
  comment: string;
  dateStart: string | null;
  dateEnd: string | null;
  cost: string;
  tariff: string;
  status: string;
  location: string;
  stages: string[];
  customFields: Record<string, unknown>;
}
