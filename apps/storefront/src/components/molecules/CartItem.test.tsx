import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import CartItem from './CartItem';
import type { CartItem as CartItemType } from '../../lib/store';
import { Product } from '@/lib/api';

const mockCartItem: CartItemType = {
  product: {
    _id: 'PROD001',
    name: 'Test Product',
    description: 'Test',
    price: 50.0,
    imageUrl: 'https://example.com/image.jpg',
    tags: ['test'],

    // ✅ new required fields to satisfy Product
    category: 'General',
    rating: 4.5,
    reviewCount: 12,

    stock: 10,
  } as Product,
  quantity: 2,
};

describe('CartItem', () => {
  it('renders product title', () => {
    render(<CartItem item={mockCartItem} onUpdateQuantity={vi.fn()} onRemove={vi.fn()} />);
    expect(screen.getByText('Test Product')).toBeInTheDocument();
  });

  it('renders product price', () => {
    render(<CartItem item={mockCartItem} onUpdateQuantity={vi.fn()} onRemove={vi.fn()} />);
    expect(screen.getByText('$50.00')).toBeInTheDocument();
  });

  it('renders item total', () => {
    render(<CartItem item={mockCartItem} onUpdateQuantity={vi.fn()} onRemove={vi.fn()} />);
    expect(screen.getByText('$100.00')).toBeInTheDocument();
  });

  it('displays quantity', () => {
    render(<CartItem item={mockCartItem} onUpdateQuantity={vi.fn()} onRemove={vi.fn()} />);
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('renders product image', () => {
    render(<CartItem item={mockCartItem} onUpdateQuantity={vi.fn()} onRemove={vi.fn()} />);
    const image = screen.getByAltText('Test Product');
    expect(image).toHaveAttribute('src', mockCartItem.product.imageUrl);
  });

  it('calls onUpdateQuantity when increase button is clicked', () => {
    const handleUpdate = vi.fn();
    render(<CartItem item={mockCartItem} onUpdateQuantity={handleUpdate} onRemove={vi.fn()} />);
    
    const increaseButton = screen.getByLabelText('Increase quantity');
    fireEvent.click(increaseButton);
    
    expect(handleUpdate).toHaveBeenCalledWith('PROD001', 3);
  });

  it('calls onUpdateQuantity when decrease button is clicked', () => {
    const handleUpdate = vi.fn();
    render(<CartItem item={mockCartItem} onUpdateQuantity={handleUpdate} onRemove={vi.fn()} />);
    
    const decreaseButton = screen.getByLabelText('Decrease quantity');
    fireEvent.click(decreaseButton);
    
    expect(handleUpdate).toHaveBeenCalledWith('PROD001', 1);
  });

  it('disables increase button when at stock limit', () => {
    const atLimitItem = { ...mockCartItem, quantity: 10 };
    render(<CartItem item={atLimitItem} onUpdateQuantity={vi.fn()} onRemove={vi.fn()} />);
    
    const increaseButton = screen.getByLabelText('Increase quantity');
    expect(increaseButton).toBeDisabled();
  });

  it('calls onRemove when remove button is clicked', () => {
    const handleRemove = vi.fn();
    render(<CartItem item={mockCartItem} onUpdateQuantity={vi.fn()} onRemove={handleRemove} />);
    
    const removeButton = screen.getByText('Remove');
    fireEvent.click(removeButton);
    
    expect(handleRemove).toHaveBeenCalledWith('PROD001');
  });
});