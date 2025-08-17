export const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
};

export const formatDate = (isoDate: string) => {
    const date = new Date(`${isoDate}T00:00:00`); // Interpret as local time
    return date.toLocaleDateString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
};

export const formatShortDate = (isoDate: string) => {
    const date = new Date(`${isoDate}T00:00:00`);
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
};