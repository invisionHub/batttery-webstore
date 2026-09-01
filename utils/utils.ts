export const formatPrice = (price: string | number): string => {
  return `₦${price.toLocaleString('en-NG')}`;
};
