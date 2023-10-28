-- Table: public.stats

-- DROP TABLE IF EXISTS public.stats;

CREATE TABLE IF NOT EXISTS public.stats
(
    season integer NOT NULL,
    season_type integer NOT NULL,
    player integer NOT NULL,
    location integer NOT NULL,
    points integer NOT NULL DEFAULT 0,
    CONSTRAINT stats_pkey PRIMARY KEY (season_type, player)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.stats
    OWNER to postgres;