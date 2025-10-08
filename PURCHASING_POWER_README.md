# Purchasing Power Calculator

A tool that calculates how the value of money changes over time using official Consumer Price Index (CPI) data from the Federal Reserve.

## Features

- **Real-time CPI Data**: Uses FRED API to fetch the latest official CPI data
- **Multiple Locations**: Supports US National Average and major metropolitan areas
- **Historical Range**: Data available from 1913 to present
- **Accurate Calculations**: Uses the standard CPI formula for purchasing power calculations
- **Beautiful UI**: Modern, responsive design that matches your site's aesthetic

## How It Works

The calculator uses the formula:
```
Value in Year B = Value in Year A × (CPI Year B / CPI Year A)
```

This adjusts monetary values based on changes in purchasing power over time.

## Setup

1. **Get a FRED API Key** (free):
   - Visit: https://fred.stlouisfed.org/docs/api/api_key.html
   - Sign up for a free account
   - Generate an API key

2. **Add Environment Variable**:
   ```bash
   # Add to your .env.local file
   FRED_API_KEY=your_fred_api_key_here
   ```

3. **Run the Application**:
   ```bash
   npm run dev
   ```

## API Endpoints

### POST `/api/purchasing-power`
Calculates purchasing power between two years.

**Request Body:**
```json
{
  "amount": 100,
  "fromYear": 1990,
  "toYear": 2024,
  "location": "US"
}
```

**Response:**
```json
{
  "originalAmount": 100,
  "originalYear": 1990,
  "targetYear": 2024,
  "location": "US",
  "equivalentAmount": 234.56,
  "inflationRate": 134.56,
  "cpiData": {
    "fromCPI": 130.7,
    "toCPI": 306.746
  }
}
```

### GET `/api/purchasing-power`
Returns available locations and date ranges.

## Supported Locations

- US National Average
- New York-Newark-Jersey City
- Los Angeles-Long Beach-Anaheim
- Chicago-Naperville-Elgin
- Houston-The Woodlands-Sugar Land
- Phoenix-Mesa-Scottsdale
- Philadelphia-Camden-Wilmington
- San Antonio-New Braunfels
- San Diego-Carlsbad
- Dallas-Fort Worth-Arlington

## Data Source

- **FRED API**: Federal Reserve Economic Data
- **CPI Series**: Consumer Price Index for All Urban Consumers
- **Update Frequency**: Monthly
- **Historical Coverage**: 1913 - Present

## Future Enhancements

- [ ] Add more metropolitan areas
- [ ] Support for other countries
- [ ] Historical charts and visualizations
- [ ] Export results functionality
- [ ] Mobile app version
