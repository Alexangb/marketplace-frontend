'use client';

import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  size?: number;
  interactive?: boolean;
  onChange?: (rating: number) => void;
}

export default function StarRating({ rating, size = 20, interactive = false, onChange }: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);

  const handleClick = (star: number) => {
    if (interactive && onChange) {
      onChange(star);
    }
  };

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => handleClick(star)}
          onMouseEnter={() => interactive && setHoverRating(star)}
          onMouseLeave={() => interactive && setHoverRating(0)}
          className={interactive ? 'cursor-pointer' : 'cursor-default'}
          disabled={!interactive}
        >
          <Star
            size={size}
            className={`${
              star <= (hoverRating || rating)
                ? 'fill-yellow-500 text-yellow-500'
                : 'text-slate-600'
            } transition-colors`}
          />
        </button>
      ))}
    </div>
  );
}