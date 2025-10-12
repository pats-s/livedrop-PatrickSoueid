import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ProductCard from './ProductCard';
import type { Product } from '../../lib/api';

const mockProduct: Product = {
  id: 'PROD001',
  title: 'Test Product',
  price: 99.99,
  image: 'https://example.com/image.jpg',
  tags: ['electronics', 'test'],
  stockQty: 10,
  description: 'Test description',
};

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('ProductCard', () => {
  it('renders product title', () => {
    renderWithRouter(<ProductCard product={mockProduct} onAddToCart={vi.fn()} />);
    expect(screen.getByText('Test Product')).toBeInTheDocument();
  });

  it('renders product price', () => {
    renderWithRouter(<ProductCard product={mockProduct} onAddToCart={vi.fn()} />);
    expect(screen.getByText('$99.99')).toBeInTheDocument();
  });

  it('renders product image', () => {
    renderWithRouter(<ProductCard product={mockProduct} onAddToCart={vi.fn()} />);
    const image = screen.getByAltText('Test Product');
    expect(image).toHaveAttribute('src', mockProduct.image);
  });

  it('renders product tags', () => {
    renderWithRouter(<ProductCard product={mockProduct} onAddToCart={vi.fn()} />);
    expect(screen.getByText('electronics')).toBeInTheDocument();
    expect(screen.getByText('test')).toBeInTheDocument();
  });

  it('shows low stock badge when stock is low', () => {
    const lowStockProduct = { ...mockProduct, stockQty: 3 };
    renderWithRouter(<ProductCard product={lowStockProduct} onAddToCart={vi.fn()} />);
    expect(screen.getByText('Low Stock')).toBeInTheDocument();
  });

  it('shows out of stock badge when stock is 0', () => {
    const outOfStockProduct = { ...mockProduct, stockQty: 0 };
    renderWithRouter(<ProductCard product={outOfStockProduct} onAddToCart={vi.fn()} />);
    expect(screen.getAllByText('Out of Stock')[0]).toBeInTheDocument();
  });

  it('disables add to cart button when out of stock', () => {
    const outOfStockProduct = { ...mockProduct, stockQty: 0 };
    renderWithRouter(<ProductCard product={outOfStockProduct} onAddToCart={vi.fn()} />);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('calls onAddToCart when button is clicked', () => {
    const handleAddToCart = vi.fn();
    renderWithRouter(<ProductCard product={mockProduct} onAddToCart={handleAddToCart} />);
    
    const button = screen.getByRole('button', { name: /add to cart/i });
    fireEvent.click(button);
    
    expect(handleAddToCart).toHaveBeenCalledWith(mockProduct);
  });

  it('links to product detail page', () => {
    renderWithRouter(<ProductCard product={mockProduct} onAddToCart={vi.fn()} />);
    const links = screen.getAllByRole('link');
    expect(links[0]).toHaveAttribute('href', '/p/PROD001');
  });
});