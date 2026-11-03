export const mapSum = (objectMap: any, field: string) => {
  return objectMap.reduce((acc: any, current: any) => acc + current[field], 0);
};

export const formatCurrency = (value?: number | null) => {
  return `₱${Number(value ?? 0).toLocaleString()}`;
};
