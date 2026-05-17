export interface Location {
  id: string;
  name: string;
  tier: CityTier;
}

export interface Metadata {
  locations: Location[];
  dateRanges: Record<string, { min: number; max: number }>;
  dataSources?: Record<string, string>;
}

export type DataSource = 'FRED' | 'BLS';
export type CityTier = 'national' | 'region' | 'metro';

export interface CpiSeries {
  id: string;
  label: string;
  seriesId: string;
  source: DataSource;
  tier: CityTier;
  /** id of the next-tier-up series to fall back to when this one lacks data for a year. */
  parent?: string;
}

// Universal earliest year — backed by US National (which has data from 1947).
// Fallback chain (metro -> region -> national) guarantees a value for every year >= 1947.
const MIN_YEAR = 1947;

export const CITY_SERIES: Record<string, CpiSeries> = {
  US: { id: 'US', label: 'US National Average', seriesId: 'CPIAUCSL', source: 'FRED', tier: 'national' },

  // Census Regions (BLS monthly, 1966+ for all four)
  NORTHEAST: { id: 'NORTHEAST', label: 'Northeast Region', seriesId: 'CUUR0100SA0', source: 'BLS', tier: 'region', parent: 'US' },
  MIDWEST:   { id: 'MIDWEST',   label: 'Midwest Region',   seriesId: 'CUUR0200SA0', source: 'BLS', tier: 'region', parent: 'US' },
  SOUTH:     { id: 'SOUTH',     label: 'South Region',     seriesId: 'CUUR0300SA0', source: 'BLS', tier: 'region', parent: 'US' },
  WEST:      { id: 'WEST',      label: 'West Region',      seriesId: 'CUUR0400SA0', source: 'BLS', tier: 'region', parent: 'US' },

  // Northeast metros
  NYC:          { id: 'NYC',          label: 'New York-Newark-Jersey City',        seriesId: 'CUURS12ASA0', source: 'BLS', tier: 'metro', parent: 'NORTHEAST' },
  PHILADELPHIA: { id: 'PHILADELPHIA', label: 'Philadelphia-Camden-Wilmington',     seriesId: 'CUURS12BSA0', source: 'BLS', tier: 'metro', parent: 'NORTHEAST' },
  BOSTON:       { id: 'BOSTON',       label: 'Boston-Cambridge-Newton',            seriesId: 'CUURS11ASA0', source: 'BLS', tier: 'metro', parent: 'NORTHEAST' },

  // Midwest metros
  CHICAGO:     { id: 'CHICAGO',     label: 'Chicago-Naperville-Elgin',             seriesId: 'CUURS23ASA0', source: 'BLS', tier: 'metro', parent: 'MIDWEST' },
  DETROIT:     { id: 'DETROIT',     label: 'Detroit-Warren-Dearborn',              seriesId: 'CUURS23BSA0', source: 'BLS', tier: 'metro', parent: 'MIDWEST' },
  MINNEAPOLIS: { id: 'MINNEAPOLIS', label: 'Minneapolis-St. Paul-Bloomington',     seriesId: 'CUURS24ASA0', source: 'BLS', tier: 'metro', parent: 'MIDWEST' },

  // South metros
  HOUSTON: { id: 'HOUSTON', label: 'Houston-The Woodlands-Sugar Land',     seriesId: 'CUURS37BSA0', source: 'BLS', tier: 'metro', parent: 'SOUTH' },
  DALLAS:  { id: 'DALLAS',  label: 'Dallas-Fort Worth-Arlington',          seriesId: 'CUURS37ASA0', source: 'BLS', tier: 'metro', parent: 'SOUTH' },
  ATLANTA: { id: 'ATLANTA', label: 'Atlanta-Sandy Springs-Roswell',        seriesId: 'CUURS35ASA0', source: 'BLS', tier: 'metro', parent: 'SOUTH' },
  MIAMI:   { id: 'MIAMI',   label: 'Miami-Fort Lauderdale-West Palm Beach', seriesId: 'CUURS35ESA0', source: 'BLS', tier: 'metro', parent: 'SOUTH' },
  DC:      { id: 'DC',      label: 'Washington-Arlington-Alexandria',      seriesId: 'CUURS35DSA0', source: 'BLS', tier: 'metro', parent: 'SOUTH' },

  // West metros
  LA:        { id: 'LA',        label: 'Los Angeles-Long Beach-Anaheim',  seriesId: 'CUURS49ASA0', source: 'BLS', tier: 'metro', parent: 'WEST' },
  SF:        { id: 'SF',        label: 'San Francisco-Oakland-Hayward',   seriesId: 'CUURS49DSA0', source: 'BLS', tier: 'metro', parent: 'WEST' },
  SEATTLE:   { id: 'SEATTLE',   label: 'Seattle-Tacoma-Bellevue',          seriesId: 'CUURS49FSA0', source: 'BLS', tier: 'metro', parent: 'WEST' },
  PHOENIX:   { id: 'PHOENIX',   label: 'Phoenix-Mesa-Scottsdale',          seriesId: 'CUURS48ASA0', source: 'BLS', tier: 'metro', parent: 'WEST' },
  SAN_DIEGO: { id: 'SAN_DIEGO', label: 'San Diego-Carlsbad',               seriesId: 'CUURS49ESA0', source: 'BLS', tier: 'metro', parent: 'WEST' },
  DENVER:    { id: 'DENVER',    label: 'Denver-Aurora-Lakewood',           seriesId: 'CUURS48BSA0', source: 'BLS', tier: 'metro', parent: 'WEST' },
};

export const CATEGORY_SERIES: Record<string, CpiSeries> = {
  FOOD:           { id: 'FOOD',           label: 'Food & Beverages',     seriesId: 'CPIFABSL', source: 'FRED', tier: 'national' },
  HOUSING:        { id: 'HOUSING',        label: 'Housing',               seriesId: 'CPIHOSSL', source: 'FRED', tier: 'national' },
  APPAREL:        { id: 'APPAREL',        label: 'Apparel',               seriesId: 'CPIAPPSL', source: 'FRED', tier: 'national' },
  TRANSPORTATION: { id: 'TRANSPORTATION', label: 'Transportation',        seriesId: 'CPITRNSL', source: 'FRED', tier: 'national' },
  MEDICAL:        { id: 'MEDICAL',        label: 'Medical Care',          seriesId: 'CPIMEDSL', source: 'FRED', tier: 'national' },
  RECREATION:     { id: 'RECREATION',     label: 'Recreation',            seriesId: 'CPIRECSL', source: 'FRED', tier: 'national' },
  EDUCATION:      { id: 'EDUCATION',      label: 'Education & Comms',     seriesId: 'CPIEDUSL', source: 'FRED', tier: 'national' },
};

export const ALL_SERIES: CpiSeries[] = [
  ...Object.values(CITY_SERIES),
  ...Object.values(CATEGORY_SERIES),
];

export const HEADLINE_SERIES_ID = CITY_SERIES.US.seriesId;

const currentYear = new Date().getFullYear();

export const PURCHASING_POWER_METADATA: Metadata = {
  locations: Object.values(CITY_SERIES).map(s => ({ id: s.id, name: s.label, tier: s.tier })),
  // With fallback (metro -> region -> national), every location has data
  // for every year >= 1947.
  dateRanges: Object.fromEntries(
    Object.values(CITY_SERIES).map(s => [s.id, { min: MIN_YEAR, max: currentYear }])
  ),
  dataSources: Object.fromEntries(
    Object.values(CITY_SERIES).map(s => [
      s.id,
      s.source === 'FRED' ? 'FRED (Federal Reserve Economic Data)' : 'BLS (Bureau of Labor Statistics)',
    ])
  ),
};
