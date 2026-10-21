export const formatPrice = (price?: string | number | null): string => {
  if (price === null || price === undefined) return '₦0';
  if (typeof price === 'number') {
    if (isNaN(price)) return '₦0';
    return `₦${Math.round(price).toLocaleString('en-NG')}`;
  }
  const cleaned = String(price).replace(/[^0-9.-]+/g, '');
  const parsed = parseFloat(cleaned);
  if (isNaN(parsed)) return '₦0';
  return `₦${Math.round(parsed).toLocaleString('en-NG')}`;
};
