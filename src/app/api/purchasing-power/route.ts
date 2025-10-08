import { NextRequest, NextResponse } from 'next/server';

// API configuration
const FRED_API_KEY = process.env.FRED_API_KEY || 'demo'; // You'll need to get a free API key from FRED
const BLS_API_KEY = process.env.BLS_API_KEY || ''; // BLS API key for regional data
const FRED_BASE_URL = 'https://api.stlouisfed.org/fred';
const BLS_BASE_URL = 'https://api.bls.gov/publicAPI/v2/timeseries/data/';

// Sample CPI data for demo mode (approximate values)
const SAMPLE_CPI_DATA: Record<number, number> = {
  1990: 130.7,
  1995: 152.4,
  2000: 172.2,
  2005: 195.3,
  2010: 218.1,
  2015: 237.0,
  2020: 258.8,
  2021: 270.9,
  2022: 292.7,
  2023: 304.7,
  2024: 306.7
};

// CPI Series IDs for different locations - Using correct BLS series IDs
const CPI_SERIES = {
  'US': 'CPIAUCSL', // US National Average (FRED - always works)
  'NYC': 'CUURS12ASA0', // New York-Newark-Jersey City (BLS)
  'LA': 'CUURS49ASA0', // Los Angeles-Long Beach-Anaheim (BLS)
  'CHICAGO': 'CUURS23ASA0', // Chicago-Naperville-Elgin (BLS)
  'HOUSTON': 'CUURS37BSA0', // Houston-The Woodlands-Sugar Land (BLS)
  'PHOENIX': 'CUURS48ASA0', // Phoenix-Mesa-Scottsdale (BLS)
  'PHILADELPHIA': 'CUURS12BSA0', // Philadelphia-Camden-Wilmington (BLS)
  'SAN_DIEGO': 'CUURS49ESA0', // San Diego-Carlsbad (BLS)
  'DALLAS': 'CUURS37ASA0', // Dallas-Fort Worth-Arlington (BLS)
};

// Fallback to US National data for metropolitan areas that don't have data
const METRO_FALLBACK = {
  'NYC': 'US',
  'LA': 'US', 
  'CHICAGO': 'US',
  'HOUSTON': 'US',
  'PHOENIX': 'US',
  'PHILADELPHIA': 'US',
  'SAN_DIEGO': 'US',
  'DALLAS': 'US',
};

interface CPIResponse {
  realtime_start: string;
  realtime_end: string;
  observation_start: string;
  observation_end: string;
  units: string;
  output_type: number;
  file_type: string;
  order_by: string;
  sort_order: string;
  count: number;
  offset: number;
  limit: number;
  observations: Array<{
    realtime_start: string;
    realtime_end: string;
    date: string;
    value: string;
  }>;
}

interface CalculationRequest {
  amount: number;
  fromYear: number;
  toYear: number;
  location: keyof typeof CPI_SERIES;
}

interface CalculationResponse {
  originalAmount: number;
  originalYear: number;
  targetYear: number;
  location: string;
  equivalentAmount: number;
  inflationRate: number;
  cpiData: {
    fromCPI: number;
    toCPI: number;
  };
}

async function fetchCPIData(seriesId: string, startDate: string, endDate: string): Promise<CPIResponse> {
  const url = `${FRED_BASE_URL}/series/observations?series_id=${seriesId}&api_key=${FRED_API_KEY}&file_type=json&observation_start=${startDate}&observation_end=${endDate}&sort_order=desc`;
  
  const response = await fetch(url);
  if (!response.ok) {
    const errorText = await response.text();
    console.error('FRED API Error:', response.status, errorText);
    throw new Error(`Failed to fetch CPI data: ${response.statusText}. Please check your API key.`);
  }
  
  return response.json();
}

interface BLSResponse {
  Status: string;
  responseTime: number;
  Results: {
    series: Array<{
      seriesID: string;
      data: Array<{
        year: string;
        period: string;
        periodName: string;
        value: string;
        footnotes: Array<{code: string; text: string}>;
      }>;
    }>;
  };
}

async function fetchBLSData(seriesId: string, startYear: number, endYear: number): Promise<BLSResponse> {
  const requestBody = {
    seriesid: [seriesId],
    startyear: startYear.toString(),
    endyear: endYear.toString(),
    registrationkey: BLS_API_KEY
  };

  const response = await fetch(BLS_BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch BLS data: ${response.statusText}`);
  }

  const data = await response.json();
  
  console.log('BLS API Response:', JSON.stringify(data, null, 2));
  
  if (data.Status && data.Status !== 'REQUEST_SUCCEEDED') {
    throw new Error(`BLS API error: ${data.Status}`);
  }

  if (!data.Results || !data.Results.series || data.Results.series.length === 0) {
    throw new Error('BLS API returned no data');
  }

  return data;
}


function getCPIForYear(observations: CPIResponse['observations'], year: number): number {
  // Find the most recent observation for the given year
  const yearObservations = observations.filter(obs => obs.date.startsWith(year.toString()));
  
  if (yearObservations.length === 0) {
    throw new Error(`No CPI data available for year ${year}`);
  }
  
  // Get the latest observation for that year
  const latestObservation = yearObservations[0];
  const cpiValue = parseFloat(latestObservation.value);
  
  if (isNaN(cpiValue)) {
    throw new Error(`Invalid CPI data for year ${year}`);
  }
  
  return cpiValue;
}


function getBLSDataForYear(blsData: BLSResponse, year: number): number {
  const seriesData = blsData.Results.series[0];
  if (!seriesData || !seriesData.data) {
    throw new Error(`No BLS data available for year ${year}`);
  }

  // Find data for the specific year
  const yearData = seriesData.data.filter(item => item.year === year.toString());
  
  if (yearData.length === 0) {
    throw new Error(`No BLS data available for year ${year}`);
  }

  // Get the most recent data point for that year (usually December)
  const latestData = yearData[0]; // BLS data is typically sorted by most recent first
  const cpiValue = parseFloat(latestData.value);
  
  if (isNaN(cpiValue)) {
    throw new Error(`Invalid BLS data for year ${year}`);
  }
  
  return cpiValue;
}

function getSampleCPIForYear(year: number): number {
  // Find the closest available year in sample data
  const availableYears = Object.keys(SAMPLE_CPI_DATA).map(Number).sort((a, b) => a - b);
  
  // If exact year exists, use it
  if (SAMPLE_CPI_DATA[year]) {
    return SAMPLE_CPI_DATA[year];
  }
  
  // Find closest year
  let closestYear = availableYears[0];
  let minDiff = Math.abs(year - closestYear);
  
  for (const availableYear of availableYears) {
    const diff = Math.abs(year - availableYear);
    if (diff < minDiff) {
      minDiff = diff;
      closestYear = availableYear;
    }
  }
  
  return SAMPLE_CPI_DATA[closestYear];
}

export async function POST(request: NextRequest) {
  try {
    const body: CalculationRequest = await request.json();
    const { amount, fromYear, toYear, location } = body;

    // Validate input
    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Amount must be a positive number' }, { status: 400 });
    }

    if (fromYear < 1913 || toYear < 1913) {
      return NextResponse.json({ error: 'Years must be 1913 or later' }, { status: 400 });
    }

    if (fromYear > new Date().getFullYear() || toYear > new Date().getFullYear()) {
      return NextResponse.json({ error: 'Years cannot be in the future' }, { status: 400 });
    }

    if (!CPI_SERIES[location]) {
      return NextResponse.json({ error: 'Invalid location' }, { status: 400 });
    }

    const seriesId = CPI_SERIES[location];
    const startDate = `${Math.min(fromYear, toYear)}-01-01`;
    const endDate = `${Math.max(fromYear, toYear)}-12-31`;

    let fromCPI: number;
    let toCPI: number;
    let usingSampleData = false;
    let usingFallbackData = false;
    let actualLocation: string = location;

    // Check if this is a BLS series (starts with CUURS)
    const isBLSSeries = seriesId.startsWith('CUURS');
    
    try {
      if (isBLSSeries && BLS_API_KEY) {
        // Use BLS API for regional data
        console.log(`Fetching BLS data for ${location} (${seriesId})`);
        const blsData = await fetchBLSData(seriesId, Math.min(fromYear, toYear), Math.max(fromYear, toYear));
        fromCPI = getBLSDataForYear(blsData, fromYear);
        toCPI = getBLSDataForYear(blsData, toYear);
      } else {
        // Use FRED API for national data
        const cpiData = await fetchCPIData(seriesId, startDate, endDate);
        fromCPI = getCPIForYear(cpiData.observations, fromYear);
        toCPI = getCPIForYear(cpiData.observations, toYear);
      }
    } catch (error) {
      console.warn(`Failed to fetch data for ${location}, trying fallback:`, error);
      
      // Try fallback to US National data for metropolitan areas
      if (METRO_FALLBACK[location as keyof typeof METRO_FALLBACK]) {
        try {
          const fallbackLocation = METRO_FALLBACK[location as keyof typeof METRO_FALLBACK];
          const fallbackSeriesId = CPI_SERIES[fallbackLocation as keyof typeof CPI_SERIES];
          const fallbackData = await fetchCPIData(fallbackSeriesId, startDate, endDate);
          fromCPI = getCPIForYear(fallbackData.observations, fromYear);
          toCPI = getCPIForYear(fallbackData.observations, toYear);
          usingFallbackData = true;
          actualLocation = fallbackLocation;
        } catch (fallbackError) {
          // Final fallback to sample data
          console.warn('Using sample CPI data due to API error:', fallbackError);
          fromCPI = getSampleCPIForYear(fromYear);
          toCPI = getSampleCPIForYear(toYear);
          usingSampleData = true;
        }
      } else {
        // For US National, fallback to sample data
        console.warn('Using sample CPI data due to API error:', error);
        fromCPI = getSampleCPIForYear(fromYear);
        toCPI = getSampleCPIForYear(toYear);
        usingSampleData = true;
      }
    }

    // Calculate equivalent amount using the formula:
    // Value in Year B = Value in Year A × (CPI Year B / CPI Year A)
    const equivalentAmount = amount * (toCPI / fromCPI);
    
    // Calculate inflation rate
    const inflationRate = ((toCPI - fromCPI) / fromCPI) * 100;

    const response: CalculationResponse & { usingSampleData?: boolean; usingFallbackData?: boolean; actualLocation?: string } = {
      originalAmount: amount,
      originalYear: fromYear,
      targetYear: toYear,
      location: location,
      equivalentAmount: Math.round(equivalentAmount * 100) / 100,
      inflationRate: Math.round(inflationRate * 100) / 100,
      cpiData: {
        fromCPI: Math.round(fromCPI * 100) / 100,
        toCPI: Math.round(toCPI * 100) / 100,
      },
      usingSampleData,
      usingFallbackData,
      actualLocation
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Error calculating purchasing power:', error);
    return NextResponse.json(
      { error: 'Failed to calculate purchasing power. Please try again.' },
      { status: 500 }
    );
  }
}

// GET endpoint to fetch available locations and date ranges
export async function GET() {
  try {
    const locations = Object.keys(CPI_SERIES).map(key => ({
      id: key,
      name: key === 'US' ? 'US National Average' : 
            key === 'NYC' ? 'New York-Newark-Jersey City' :
            key === 'LA' ? 'Los Angeles-Long Beach-Anaheim' :
            key === 'CHICAGO' ? 'Chicago-Naperville-Elgin' :
            key === 'HOUSTON' ? 'Houston-The Woodlands-Sugar Land' :
            key === 'PHOENIX' ? 'Phoenix-Mesa-Scottsdale' :
            key === 'PHILADELPHIA' ? 'Philadelphia-Camden-Wilmington' :
            key === 'SAN_DIEGO' ? 'San Diego-Carlsbad' :
            key === 'DALLAS' ? 'Dallas-Fort Worth-Arlington' :
            key.replace(/_/g, ' ')
    }));

    return NextResponse.json({
      locations,
      dateRange: {
        min: 1913,
        max: new Date().getFullYear()
      }
    });

  } catch (error) {
    console.error('Error fetching metadata:', error);
    return NextResponse.json(
      { error: 'Failed to fetch metadata' },
      { status: 500 }
    );
  }
}
