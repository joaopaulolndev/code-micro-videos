import * as fns from 'date-fns';

export const { format: formatPrice } = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

// eslint-disable-next-line arrow-body-style
export const formatDate = (date: string, format: string) => {
  return fns.format(fns.parseISO(date), format);
};
