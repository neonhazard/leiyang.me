CREATE TABLE IF NOT EXISTS cpi_observations (
  series_id  text NOT NULL,
  year       int  NOT NULL,
  month      int  NOT NULL,
  value      numeric(10,3) NOT NULL,
  source     text NOT NULL,
  fetched_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (series_id, year, month),
  CHECK (month BETWEEN 1 AND 12)
);

CREATE INDEX IF NOT EXISTS idx_cpi_series_year ON cpi_observations(series_id, year);

CREATE TABLE IF NOT EXISTS cpi_sync_runs (
  id            serial PRIMARY KEY,
  ran_at        timestamptz NOT NULL DEFAULT now(),
  series_id     text NOT NULL,
  rows_upserted int NOT NULL,
  status        text NOT NULL,
  error         text
);
