-- run in terminal with `psql -f createSchema.sql`
CREATE DATABASE request_bin;

\c request_bin

CREATE TABLE bins (
  id serial PRIMARY KEY,
  url text NOT NULL,
  ip_address text NOT NULL,
  active boolean NOT NULL DEFAULT true,
  time_created timestamp NOT NULL DEFAULT NOW()
);

CREATE TABLE requests (
  mongo_id text PRIMARY KEY,
  bin_id int REFERENCES bins(id) ON DELETE CASCADE NOT NULL
);