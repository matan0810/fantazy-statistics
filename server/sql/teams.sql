-- Table: public.teams

-- DROP TABLE IF EXISTS public.teams;

CREATE TABLE IF NOT EXISTS public.teams
(
    season_id integer NOT NULL,
    player integer NOT NULL,
    location integer NOT NULL,
    points integer NOT NULL DEFAULT 0,
    team_name character varying[] COLLATE pg_catalog."default",
    CONSTRAINT stats_pkey PRIMARY KEY (season_id, player)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.teams
    OWNER to postgres;