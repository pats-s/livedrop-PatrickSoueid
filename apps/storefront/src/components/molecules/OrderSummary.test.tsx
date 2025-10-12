import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import OrderSummary from './OrderSummary';

describe('OrderSummary', () => {
  it('renders order summary title', () => {
    render(<OrderSummary subtotal={100} total={100} />);
    expect(screen.getByText('Order Summary')).toBeInTheDocument();
  });

  it('displays subtotal', () => {
    render(<OrderSummary subtotal={159.98} total={159.98} />);
    expect(screen.getByText('Subtotal')).toBeInTheDocument();
    const prices = screen.getAllByText('$159.98');
    expect(prices.length).toBeGreaterThan(0);
  });

  it('displays tax when provided', () => {
    render(<OrderSummary subtotal={100} tax={8.50} total={108.50} />);
    expect(screen.getByText('Tax')).toBeInTheDocument();
    expect(screen.getByText('$8.50')).toBeInTheDocument();
  });

  it('displays shipping when provided', () => {
    render(<OrderSummary subtotal={100} shipping={9.99} total={109.99} />);
    expect(screen.getByText('Shipping')).toBeInTheDocument();
    expect(screen.getByText('$9.99')).toBeInTheDocument();
  });

  it('does not display tax when not provided', () => {
    render(<OrderSummary subtotal={100} total={100} />);
    expect(screen.queryByText('Tax')).not.toBeInTheDocument();
  });

  it('does not display shipping when not provided', () => {
    render(<OrderSummary subtotal={100} total={100} />);
    expect(screen.queryByText('Shipping')).not.toBeInTheDocument();
  });

  it('displays total', () => {
    render(<OrderSummary subtotal={100} tax={8} shipping={10} total={118} />);
    expect(screen.getByText('Total')).toBeInTheDocument();
    expect(screen.getByText('$118.00')).toBeInTheDocument();
  });

  it('formats currency correctly', () => {
    render(<OrderSummary subtotal={99.99} total={99.99} />);
    const prices = screen.getAllByText('$99.99');
    expect(prices.length).toBeGreaterThan(0);
  });
});