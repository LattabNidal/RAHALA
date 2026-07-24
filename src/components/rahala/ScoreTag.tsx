import React from 'react';

interface ScoreTagProps {
  score: number | string;
  max?: number;
  showPercent?: boolean;
  className?: string;
  label?: string;
}

export const ScoreTag: React.FC<ScoreTagProps> = ({
  score,
  max,
  showPercent = false,
  className = '',
  label = '',
}) => {
  const strScore = String(score).trim();
  const numScore = parseFloat(strScore.replace(/[^0-9.-]+/g, ''));

  if (isNaN(numScore)) {
    return (
      <span className={`font-mono tabular-nums text-gray-400 font-medium ${className}`}>
        {strScore || '--'}
      </span>
    );
  }

  let formatted = numScore.toLocaleString('fr-FR', { maximumFractionDigits: 1 });
  if (max) {
    formatted = `${formatted}/${max}`;
  } else if (showPercent || strScore.includes('%')) {
    if (!formatted.includes('%')) {
      formatted = `${formatted}%`;
    }
  }

  return (
    <span className={`font-mono tabular-nums font-bold ${className}`}>
      {label && <span className="mr-1 opacity-80">{label}</span>}
      {formatted}
    </span>
  );
};
