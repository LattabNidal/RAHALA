import React from 'react';

interface PriceTagProps {
  amount: number | string;
  currency?: string;
  className?: string;
}

export const PriceTag: React.FC<PriceTagProps> = ({
  amount,
  currency = 'DZD',
  className = ''
}) => {
  const formattedAmount = typeof amount === 'number' 
    ? amount.toLocaleString('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 2 })
    : amount;

  return (
    <span className={`font-mono tabular-nums text-gold font-bold ${className}`}>
      {formattedAmount} <span className="text-xs">{currency}</span>
    </span>
  );
};
