import React from 'react';

interface PriceTagProps {
  amount: number | string;
  currency?: string;
  className?: string;
  showFreeLabel?: boolean;
}

export const PriceTag: React.FC<PriceTagProps> = ({
  amount,
  currency = 'DZD',
  className = '',
  showFreeLabel = false,
}) => {
  const numAmount = typeof amount === 'number' 
    ? amount 
    : typeof amount === 'string' 
      ? parseFloat(amount.replace(/[^0-9.-]+/g, '')) 
      : NaN;

  if (isNaN(numAmount)) {
    return (
      <span className={`font-mono tabular-nums text-gray-400 font-medium ${className}`}>
        -- {currency}
      </span>
    );
  }

  if (numAmount < 0) {
    return (
      <span className={`font-mono tabular-nums text-red-500 font-bold ${className}`} title="Montant invalide">
        Non disponible
      </span>
    );
  }

  if (numAmount === 0 && showFreeLabel) {
    return (
      <span className={`font-mono tabular-nums text-emerald-600 dark:text-emerald-400 font-extrabold ${className}`}>
        Gratuit
      </span>
    );
  }

  const formattedAmount = numAmount.toLocaleString('fr-FR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  return (
    <span className={`font-mono tabular-nums text-gold font-bold ${className}`}>
      {formattedAmount} <span className="text-xs font-normal opacity-90">{currency}</span>
    </span>
  );
};

