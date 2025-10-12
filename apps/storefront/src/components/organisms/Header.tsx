
import { Link } from 'react-router-dom';
import { Button, Badge } from '../atoms';
import { useCartStore } from '../../lib/store';

interface HeaderProps {
  onOpenSupport: () => void;
}

export default function Header({ onOpenSupport }: HeaderProps) {
  const itemCount = useCartStore((state) => state.getItemCount());

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">S</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Shoplite</span>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-4">
             <Link to="/orders">
              <Button variant="ghost" size="sm">
              My Orders
              </Button>
              </Link>
            <Button variant="ghost" size="sm" onClick={onOpenSupport}>
              Ask Support
            </Button>

            <Link to="/cart" className="relative">
              <Button variant="ghost" size="sm">
                <span className="flex items-center gap-2">
                  Cart
                  {itemCount > 0 && (
                    <Badge variant="info" size="sm">
                      {itemCount}
                    </Badge>
                  )}
                </span>
              </Button>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}