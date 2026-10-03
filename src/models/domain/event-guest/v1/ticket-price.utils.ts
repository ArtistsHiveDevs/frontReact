export const DEFAULT_TICKET_CURRENCY = 'COP';

export const formatTicketPrice = (price?: number, currency?: string): string => {
  if (price === undefined || price === null) {
    return '';
  }
  if (!currency) {
    return `${price}`;
  }
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(price);
  } catch {
    return `${currency} ${price}`;
  }
};
