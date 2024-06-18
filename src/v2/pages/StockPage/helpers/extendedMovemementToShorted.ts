import { IPropertyMovement } from 'interfaces/propertyMovement.interface';

export const movementExtendedToForm = (data: IPropertyMovement<true>): IPropertyMovement => {
  const result: IPropertyMovement = {
    ...data,
    user: data.user._id,
    project: data.project?._id,
    client: data.client?._id,
    contractor: data.contractor?._id,
    recorder: data.recorder?._id,
    property: data.property._id,
    previousMovement: data.previousMovement?._id,
  };
  return result;
};
