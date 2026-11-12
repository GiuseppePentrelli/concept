import { Heart } from 'lucide-react';
import { useUI } from '../../store/ui';

interface Props {
  productId: string;
  size?: number;
  className?: string;
}

export function WishButton({ productId, size = 26, className = '' }: Props) {
  const { wishlist, toggleWish, notify } = useUI();
  const active = wishlist.includes(productId);

  return (
    <button
      type="button"
      className={`icon-btn ${className}`}
      aria-pressed={active}
      aria-label={active ? 'Rimuovi dai preferiti' : 'Aggiungi ai preferiti'}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        notify(toggleWish(productId) ? 'Aggiunto ai preferiti' : 'Rimosso dai preferiti');
      }}
    >
      <Heart
        size={size}
        strokeWidth={1.4}
        className="transition-[fill,transform] duration-200 ease-out"
        style={{ fill: active ? 'currentColor' : 'transparent', transform: active ? 'scale(1.06)' : 'scale(1)' }}
      />
    </button>
  );
}
