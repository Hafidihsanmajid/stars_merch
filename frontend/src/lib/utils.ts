/**
 * Utility functions for Stars Merch Frontend
 */

/**
 * Format number to Indonesian Rupiah (IDR)
 * Example: 189000 -> "Rp 189.000"
 */
export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Basic className helper without external dependencies
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
