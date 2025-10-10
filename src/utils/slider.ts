/**
 * Calculate the percentage position for a year on the slider
 * @param year - The year to calculate position for
 * @param minYear - Minimum year in the range
 * @param maxYear - Maximum year in the range
 * @returns Percentage position (0-100)
 */
export const calculateSliderPosition = (year: number, minYear: number, maxYear: number): number => {
  return ((year - minYear) / (maxYear - minYear)) * 100;
};

/**
 * Calculate the width percentage for the active range on the slider
 * @param fromYear - Start year of the range
 * @param toYear - End year of the range
 * @param minYear - Minimum year in the range
 * @param maxYear - Maximum year in the range
 * @returns Width percentage (0-100)
 */
export const calculateRangeWidth = (fromYear: number, toYear: number, minYear: number, maxYear: number): number => {
  return ((toYear - fromYear) / (maxYear - minYear)) * 100;
};

/**
 * Get the default date range for a location
 * @param minYear - Minimum year
 * @param maxYear - Maximum year
 * @returns Default range object
 */
export const getDefaultDateRange = (minYear: number, maxYear: number): {min: number, max: number} => {
  return { min: minYear, max: maxYear };
};
