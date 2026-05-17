export interface Location {
  id: string;
  name: string;
}

export interface Metadata {
  locations: Location[];
  dateRanges: Record<string, { min: number; max: number }>;
  dataSources?: Record<string, string>;
}

export type DataSource = 'FRED' | 'BLS';

export interface CpiSeries {
  id: string;
  label: string;
  seriesId: string;
  source: DataSource;
}

export const CITY_SERIES: Record<string, CpiSeries> = {
  US:           { id: 'US',           label: 'US National Average',                seriesId: 'CPIAUCSL',     source: 'FRED' },
  NYC:          { id: 'NYC',          label: 'New York-Newark-Jersey City',         seriesId: 'CUURS12ASA0',  source: 'BLS'  },
  LA:           { id: 'LA',           label: 'Los Angeles-Long Beach-Anaheim',      seriesId: 'CUURS49ASA0',  source: 'BLS'  },
  CHICAGO:      { id: 'CHICAGO',      label: 'Chicago-Naperville-Elgin',            seriesId: 'CUURS23ASA0',  source: 'BLS'  },
  HOUSTON:      { id: 'HOUSTON',      label: 'Houston-The Woodlands-Sugar Land',    seriesId: 'CUURS37BSA0',  source: 'BLS'  },
  PHOENIX:      { id: 'PHOENIX',      label: 'Phoenix-Mesa-Scottsdale',             seriesId: 'CUURS48ASA0',  source: 'BLS'  },
  PHILADELPHIA: { id: 'PHILADELPHIA', label: 'Philadelphia-Camden-Wilmington',      seriesId: 'CUURS12BSA0',  source: 'BLS'  },
  SAN_DIEGO:    { id: 'SAN_DIEGO',    label: 'San Diego-Carlsbad',                  seriesId: 'CUURS49ESA0',  source: 'BLS'  },
  DALLAS:       { id: 'DALLAS',       label: 'Dallas-Fort Worth-Arlington',         seriesId: 'CUURS37ASA0',  source: 'BLS'  },
};

export const CATEGORY_SERIES: Record<string, CpiSeries> = {
  FOOD:           { id: 'FOOD',           label: 'Food & Beverages',     seriesId: 'CPIFABSL', source: 'FRED' },
  HOUSING:        { id: 'HOUSING',        label: 'Housing',               seriesId: 'CPIHOSSL', source: 'FRED' },
  APPAREL:        { id: 'APPAREL',        label: 'Apparel',               seriesId: 'CPIAPPSL', source: 'FRED' },
  TRANSPORTATION: { id: 'TRANSPORTATION', label: 'Transportation',        seriesId: 'CPITRNSL', source: 'FRED' },
  MEDICAL:        { id: 'MEDICAL',        label: 'Medical Care',          seriesId: 'CPIMEDSL', source: 'FRED' },
  RECREATION:     { id: 'RECREATION',     label: 'Recreation',            seriesId: 'CPIRECSL', source: 'FRED' },
  EDUCATION:      { id: 'EDUCATION',      label: 'Education & Comms',     seriesId: 'CPIEDUSL', source: 'FRED' },
};

export const ALL_SERIES: CpiSeries[] = [
  ...Object.values(CITY_SERIES),
  ...Object.values(CATEGORY_SERIES),
];

export const HEADLINE_SERIES_ID = CITY_SERIES.US.seriesId;

export const PURCHASING_POWER_METADATA: Metadata = {
  locations: Object.values(CITY_SERIES).map(s => ({ id: s.id, name: s.label })),
  dateRanges: {
    US:           { min: 1947, max: new Date().getFullYear() },
    NYC:          { min: 1965, max: new Date().getFullYear() },
    LA:           { min: 1965, max: new Date().getFullYear() },
    CHICAGO:      { min: 1965, max: new Date().getFullYear() },
    HOUSTON:      { min: 1965, max: new Date().getFullYear() },
    PHOENIX:      { min: 1965, max: new Date().getFullYear() },
    PHILADELPHIA: { min: 1965, max: new Date().getFullYear() },
    SAN_DIEGO:    { min: 1965, max: new Date().getFullYear() },
    DALLAS:       { min: 1965, max: new Date().getFullYear() },
  },
  dataSources: Object.fromEntries(
    Object.values(CITY_SERIES).map(s => [
      s.id,
      s.source === 'FRED' ? 'FRED (Federal Reserve Economic Data)' : 'BLS (Bureau of Labor Statistics)',
    ])
  ),
};
