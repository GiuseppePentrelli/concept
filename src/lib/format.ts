export const formatPrice = (value: number) => `€${value.toFixed(2).replace('.', ',')}`;

export const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());
