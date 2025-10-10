/**
 * Format a number string with commas for display
 * @param value - The input string to format
 * @returns Formatted string with commas
 */
export const formatNumberWithCommas = (value: string): string => {
  // Handle empty string
  if (!value) return '';
  
  // Remove all non-numeric characters except decimal point
  const numericValue = value.replace(/[^\d.]/g, '');
  
  // Handle empty result after cleaning
  if (!numericValue) return '';
  
  // Split by decimal point
  const parts = numericValue.split('.');
  
  // Handle multiple decimal points (take only first two parts)
  if (parts.length > 2) {
    parts[1] = parts.slice(1).join('');
  }
  
  // Format the integer part with commas
  const integerPart = parts[0] || '0';
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  
  // Return formatted number with decimal part if it exists
  return parts.length > 1 ? `${formattedInteger}.${parts[1]}` : formattedInteger;
};

/**
 * Remove commas from a formatted number string
 * @param value - The formatted string
 * @returns Numeric string without commas
 */
export const getNumericValue = (value: string): string => {
  return value.replace(/,/g, '');
};

/**
 * Format a number as currency
 * @param value - The number to format
 * @returns Formatted currency string
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

/**
 * Generate an array of years in descending order
 * @param start - Start year (inclusive)
 * @param end - End year (inclusive)
 * @returns Array of years from end to start
 */
export const generateYearOptions = (start: number, end: number): number[] => {
  const years = [];
  for (let year = end; year >= start; year--) {
    years.push(year);
  }
  return years;
};
