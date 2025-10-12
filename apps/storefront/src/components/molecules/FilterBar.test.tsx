import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import FilterBar from './FilterBar';

const mockTags = ['electronics', 'clothing', 'home'];

describe('FilterBar', () => {
  it('renders all tag buttons', () => {
    render(
      <FilterBar
        tags={mockTags}
        selectedTag={null}
        onSelectTag={vi.fn()}
        sortBy="default"
        onSortChange={vi.fn()}
      />
    );
    
    expect(screen.getByText('electronics')).toBeInTheDocument();
    expect(screen.getByText('clothing')).toBeInTheDocument();
    expect(screen.getByText('home')).toBeInTheDocument();
  });

  it('renders All button', () => {
    render(
      <FilterBar
        tags={mockTags}
        selectedTag={null}
        onSelectTag={vi.fn()}
        sortBy="default"
        onSortChange={vi.fn()}
      />
    );
    
    expect(screen.getByText('All')).toBeInTheDocument();
  });

  it('renders sort dropdown', () => {
    render(
      <FilterBar
        tags={mockTags}
        selectedTag={null}
        onSelectTag={vi.fn()}
        sortBy="default"
        onSortChange={vi.fn()}
      />
    );
    
    const select = screen.getByRole('combobox');
    expect(select).toBeInTheDocument();
  });

  it('calls onSelectTag when tag is clicked', () => {
    const handleSelectTag = vi.fn();
    render(
      <FilterBar
        tags={mockTags}
        selectedTag={null}
        onSelectTag={handleSelectTag}
        sortBy="default"
        onSortChange={vi.fn()}
      />
    );
    
    fireEvent.click(screen.getByText('electronics'));
    expect(handleSelectTag).toHaveBeenCalledWith('electronics');
  });

  it('calls onSelectTag with null when All is clicked', () => {
    const handleSelectTag = vi.fn();
    render(
      <FilterBar
        tags={mockTags}
        selectedTag="electronics"
        onSelectTag={handleSelectTag}
        sortBy="default"
        onSortChange={vi.fn()}
      />
    );
    
    fireEvent.click(screen.getByText('All'));
    expect(handleSelectTag).toHaveBeenCalledWith(null);
  });

  it('highlights selected tag', () => {
    render(
      <FilterBar
        tags={mockTags}
        selectedTag="electronics"
        onSelectTag={vi.fn()}
        sortBy="default"
        onSortChange={vi.fn()}
      />
    );
    
    const electronicsButton = screen.getByText('electronics');
    expect(electronicsButton).toHaveClass('bg-blue-600', 'text-white');
  });

  it('calls onSortChange when sort option changes', () => {
    const handleSortChange = vi.fn();
    render(
      <FilterBar
        tags={mockTags}
        selectedTag={null}
        onSelectTag={vi.fn()}
        sortBy="default"
        onSortChange={handleSortChange}
      />
    );
    
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'price-asc' } });
    
    expect(handleSortChange).toHaveBeenCalledWith('price-asc');
  });
});