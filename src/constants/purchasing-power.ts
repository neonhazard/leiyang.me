export interface Location {
  id: string;
  name: string;
}

export interface Metadata {
  locations: Location[];
  dateRanges: Record<string, {min: number, max: number}>;
  dataSources?: Record<string, string>;
}

export const PURCHASING_POWER_METADATA: Metadata = {
  locations: [
    { id: 'US', name: 'US National Average' },
    { id: 'NYC', name: 'New York-Newark-Jersey City' },
    { id: 'LA', name: 'Los Angeles-Long Beach-Anaheim' },
    { id: 'CHICAGO', name: 'Chicago-Naperville-Elgin' },
    { id: 'HOUSTON', name: 'Houston-The Woodlands-Sugar Land' },
    { id: 'PHOENIX', name: 'Phoenix-Mesa-Scottsdale' },
    { id: 'PHILADELPHIA', name: 'Philadelphia-Camden-Wilmington' },
    { id: 'SAN_DIEGO', name: 'San Diego-Carlsbad' },
    { id: 'DALLAS', name: 'Dallas-Fort Worth-Arlington' }
  ],
  dateRanges: {
    'US': { min: 1947, max: new Date().getFullYear() },
    'NYC': { min: 1965, max: new Date().getFullYear() },
    'LA': { min: 1965, max: new Date().getFullYear() },
    'CHICAGO': { min: 1965, max: new Date().getFullYear() },
    'HOUSTON': { min: 1965, max: new Date().getFullYear() },
    'PHOENIX': { min: 1965, max: new Date().getFullYear() },
    'PHILADELPHIA': { min: 1965, max: new Date().getFullYear() },
    'SAN_DIEGO': { min: 1965, max: new Date().getFullYear() },
    'DALLAS': { min: 1965, max: new Date().getFullYear() }
  },
  dataSources: {
    'US': 'FRED (Federal Reserve Economic Data)',
    'NYC': 'BLS (Bureau of Labor Statistics)',
    'LA': 'BLS (Bureau of Labor Statistics)',
    'CHICAGO': 'BLS (Bureau of Labor Statistics)',
    'HOUSTON': 'BLS (Bureau of Labor Statistics)',
    'PHOENIX': 'BLS (Bureau of Labor Statistics)',
    'PHILADELPHIA': 'BLS (Bureau of Labor Statistics)',
    'SAN_DIEGO': 'BLS (Bureau of Labor Statistics)',
    'DALLAS': 'BLS (Bureau of Labor Statistics)'
  }
};
