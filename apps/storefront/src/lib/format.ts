
/**
 * Format a number as USD currency
 * @param amount - The numeric amount to format
 * @returns Formatted currency string (e.g., "$99.99")
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

/**
 * Format a date string or Date object into a readable format
 * @param date - Date string or Date object
 * @returns Formatted date string (e.g., "Oct 12, 2025")
 */
export function formatDate(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(dateObj);
}

/**
 * Format a date with time
 * @param date - Date string or Date object
 * @returns Formatted datetime string (e.g., "Oct 12, 2025 at 3:45 PM")
 */
export function formatDateTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(dateObj);
}

/**
 * Mask sensitive IDs showing only last 4 characters
 * @param id - The ID string to mask
 * @returns Masked ID (e.g., "****1234")
 */
export function maskId(id: string): string {
  if (id.length <= 4) return id;
  return '****' + id.slice(-4);
}

/**
 * Pluralize a word based on count
 * @param count - The count to check
 * @param singular - Singular form of the word
 * @param plural - Plural form (optional, adds 's' by default)
 * @returns Pluralized string with count
 */
export function pluralize(count: number, singular: string, plural?: string): string {
  const word = count === 1 ? singular : (plural || `${singular}s`);
  return `${count} ${word}`;
}

/**
 * Truncate text to a maximum length
 * @param text - The text to truncate
 * @param maxLength - Maximum length before truncating
 * @returns Truncated text with ellipsis if needed
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

/**
 * Generate a random order ID
 * @returns Random order ID (e.g., "ORD7X9K2M4")
 */
export function generateOrderId(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let id = 'ORD';
  for (let i = 0; i < 7; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
}

/**
 * Calculate order total with optional tax
 * @param subtotal - Subtotal amount
 * @param taxRate - Tax rate as decimal (e.g., 0.08 for 8%)
 * @returns Total with tax
 */
export function calculateTotal(subtotal: number, taxRate: number = 0): number {
  return subtotal * (1 + taxRate);
}

/**
 * Get stock status label
 * @param qty - Stock quantity
 * @returns Status label string
 */
export function getStockStatus(qty: number): string {
  if (qty === 0) return 'Out of Stock';
  if (qty < 5) return 'Low Stock';
  if (qty < 20) return 'Limited Stock';
  return 'In Stock';
}

/**
 * Get stock status color class
 * @param qty - Stock quantity
 * @returns Tailwind color class
 */
export function getStockStatusColor(qty: number): string {
  if (qty === 0) return 'text-red-600';
  if (qty < 5) return 'text-orange-600';
  if (qty < 20) return 'text-yellow-600';
  return 'text-green-600';
}