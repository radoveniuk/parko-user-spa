export const isMongoId = (text: string) => /^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i.test(text);
