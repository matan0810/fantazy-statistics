-- Table: public.seasons

-- DROP TABLE IF EXISTS public.seasons;

CREATE TABLE IF NOT EXISTS public.seasons
(
    id integer NOT NULL DEFAULT nextval('seasons_id_seq'::regclass),
    year integer,
    type integer,
    CONSTRAINT seasons_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.seasons
    OWNER to postgres;