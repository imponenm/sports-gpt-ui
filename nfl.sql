--
-- PostgreSQL database dump
--

-- Dumped from database version 16.4 (Homebrew)
-- Dumped by pg_dump version 16.4 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: game_stats; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.game_stats (
    stat_id integer NOT NULL,
    player_id integer NOT NULL,
    team_id integer NOT NULL,
    game_id integer NOT NULL,
    passing_completions integer,
    passing_attempts integer,
    passing_yards integer,
    yards_per_pass_attempt numeric(4,1),
    passing_touchdowns integer,
    passing_interceptions integer,
    sacks integer,
    sacks_loss integer,
    qbr numeric(4,1),
    qb_rating numeric(5,1),
    rushing_attempts integer,
    rushing_yards integer,
    yards_per_rush_attempt numeric(4,1),
    rushing_touchdowns integer,
    long_rushing integer,
    receptions integer,
    receiving_yards integer,
    yards_per_reception numeric(4,1),
    receiving_touchdowns integer,
    long_reception integer,
    receiving_targets integer,
    fumbles integer,
    fumbles_lost integer,
    fumbles_recovered integer,
    total_tackles integer,
    defensive_sacks integer,
    solo_tackles integer,
    tackles_for_loss integer,
    passes_defended integer,
    qb_hits integer,
    fumbles_touchdowns integer,
    defensive_interceptions integer,
    interception_yards integer,
    interception_touchdowns integer,
    kick_returns integer,
    kick_return_yards integer,
    yards_per_kick_return numeric(4,1),
    long_kick_return integer,
    kick_return_touchdowns integer,
    punt_returns integer,
    punt_return_yards integer,
    yards_per_punt_return numeric(4,1),
    long_punt_return integer,
    punt_return_touchdowns integer,
    field_goal_attempts integer,
    field_goals_made integer,
    field_goal_pct numeric(5,2),
    long_field_goal_made integer,
    extra_points_made integer,
    total_points integer,
    punts integer,
    punt_yards integer,
    gross_avg_punt_yards numeric(4,1),
    touchbacks integer,
    punts_inside_20 integer,
    long_punt integer
);


--
-- Name: games; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.games (
    game_id integer NOT NULL,
    visitor_team_id integer NOT NULL,
    home_team_id integer NOT NULL,
    summary text,
    venue character varying(100),
    week integer,
    game_date timestamp without time zone NOT NULL,
    season integer NOT NULL,
    postseason boolean DEFAULT false NOT NULL,
    status character varying(20) NOT NULL,
    home_team_score integer,
    home_team_q1 integer,
    home_team_q2 integer,
    home_team_q3 integer,
    home_team_q4 integer,
    home_team_ot integer,
    visitor_team_score integer,
    visitor_team_q1 integer,
    visitor_team_q2 integer,
    visitor_team_q3 integer,
    visitor_team_q4 integer,
    visitor_team_ot integer
);


--
-- Name: players; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.players (
    player_id integer NOT NULL,
    first_name character varying(50) NOT NULL,
    last_name character varying(50) NOT NULL,
    "position" character varying(50),
    position_abbreviation character varying(5),
    height character varying(10),
    weight character varying(10),
    jersey_number character varying(5),
    college character varying(100),
    experience character varying(20),
    age integer,
    team_id integer
);


--
-- Name: teams; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.teams (
    team_id integer NOT NULL,
    conference character varying(3) NOT NULL,
    division character varying(10) NOT NULL,
    location character varying(50) NOT NULL,
    name character varying(50) NOT NULL,
    full_name character varying(100) NOT NULL,
    abbreviation character varying(5) NOT NULL
);


--
-- Name: derived_season_stats; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.derived_season_stats AS
 SELECT p.player_id,
    p.first_name,
    p.last_name,
    t.team_id,
    g.season,
    count(DISTINCT gs.game_id) AS games_played,
    sum(gs.passing_completions) AS passing_completions,
    sum(gs.passing_attempts) AS passing_attempts,
    sum(gs.passing_yards) AS passing_yards,
        CASE
            WHEN (sum(gs.passing_attempts) > 0) THEN round(((sum(gs.passing_yards))::numeric / (sum(gs.passing_attempts))::numeric), 1)
            ELSE NULL::numeric
        END AS yards_per_pass_attempt,
    sum(gs.passing_touchdowns) AS passing_touchdowns,
    sum(gs.passing_interceptions) AS passing_interceptions,
    ROUND(AVG(gs.qb_rating), 1) AS avg_qb_rating,
    ROUND(AVG(gs.qbr), 1) AS avg_qbr,
    sum(gs.rushing_attempts) AS rushing_attempts,
    sum(gs.rushing_yards) AS rushing_yards,
        CASE
            WHEN (sum(gs.rushing_attempts) > 0) THEN round(((sum(gs.rushing_yards))::numeric / (sum(gs.rushing_attempts))::numeric), 3)
            ELSE NULL::numeric
        END AS yards_per_rush_attempt,
    sum(gs.rushing_touchdowns) AS rushing_touchdowns,
    max(gs.long_rushing) AS long_rushing,
    sum(gs.receptions) AS receptions,
    sum(gs.receiving_yards) AS receiving_yards,
        CASE
            WHEN (sum(gs.receptions) > 0) THEN round(((sum(gs.receiving_yards))::numeric / (sum(gs.receptions))::numeric), 3)
            ELSE NULL::numeric
        END AS yards_per_reception,
    sum(gs.receiving_touchdowns) AS receiving_touchdowns,
    max(gs.long_reception) AS long_reception,
    sum(gs.receiving_targets) AS receiving_targets,
    sum(gs.fumbles) AS fumbles,
    sum(gs.fumbles_lost) AS fumbles_lost,
    sum(gs.fumbles_recovered) AS fumbles_recovered,
    sum(gs.total_tackles) AS total_tackles,
    sum(gs.defensive_sacks) AS defensive_sacks,
    sum(gs.solo_tackles) AS solo_tackles,
    sum(gs.tackles_for_loss) AS tackles_for_loss,
    sum(gs.passes_defended) AS passes_defended,
    sum(gs.qb_hits) AS qb_hits,
    sum(gs.fumbles_touchdowns) AS fumbles_touchdowns,
    sum(gs.defensive_interceptions) AS defensive_interceptions,
    sum(gs.interception_yards) AS interception_yards,
    sum(gs.interception_touchdowns) AS interception_touchdowns,
        CASE
            WHEN (count(DISTINCT gs.game_id) > 0) THEN round(((sum(gs.passing_yards))::numeric / (count(DISTINCT gs.game_id))::numeric), 1)
            ELSE NULL::numeric
        END AS passing_yards_per_game,
        CASE
            WHEN (count(DISTINCT gs.game_id) > 0) THEN round(((sum(gs.rushing_yards))::numeric / (count(DISTINCT gs.game_id))::numeric), 1)
            ELSE NULL::numeric
        END AS rushing_yards_per_game,
        CASE
            WHEN (count(DISTINCT gs.game_id) > 0) THEN round(((sum(gs.receiving_yards))::numeric / (count(DISTINCT gs.game_id))::numeric), 1)
            ELSE NULL::numeric
        END AS receiving_yards_per_game
   FROM (((public.game_stats gs
     JOIN public.players p ON ((gs.player_id = p.player_id)))
     JOIN public.teams t ON ((gs.team_id = t.team_id)))
     JOIN public.games g ON ((gs.game_id = g.game_id)))
  GROUP BY p.player_id, p.first_name, p.last_name, t.team_id, g.season;


--
-- Name: game_stats_stat_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.game_stats_stat_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: game_stats_stat_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.game_stats_stat_id_seq OWNED BY public.game_stats.stat_id;


--
-- Name: season_stats; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.season_stats (
    season_stat_id integer NOT NULL,
    player_id integer NOT NULL,
    games_played integer,
    season integer NOT NULL,
    postseason boolean DEFAULT false NOT NULL,
    passing_completions integer,
    passing_attempts integer,
    passing_yards integer,
    yards_per_pass_attempt numeric(4,1),
    passing_touchdowns integer,
    passing_interceptions integer,
    passing_yards_per_game numeric(5,1),
    passing_completion_pct numeric(5,1),
    qbr numeric(4,1),
    rushing_attempts integer,
    rushing_yards integer,
    rushing_yards_per_game numeric(5,4),
    yards_per_rush_attempt numeric(4,3),
    rushing_touchdowns integer,
    rushing_fumbles integer,
    rushing_fumbles_lost integer,
    rushing_first_downs integer,
    receptions integer,
    receiving_yards integer,
    yards_per_reception numeric(5,3),
    receiving_touchdowns integer,
    receiving_fumbles integer,
    receiving_fumbles_lost integer,
    receiving_first_downs integer,
    receiving_targets integer,
    receiving_yards_per_game numeric(8,6),
    fumbles_forced integer,
    fumbles_recovered integer,
    total_tackles integer,
    defensive_sacks integer,
    defensive_sack_yards integer,
    solo_tackles integer,
    assist_tackles integer,
    fumbles_touchdowns integer,
    defensive_interceptions integer,
    interception_touchdowns integer,
    kick_returns integer,
    kick_return_yards integer,
    yards_per_kick_return numeric(4,1),
    kick_return_touchdowns integer,
    punt_returner_returns integer,
    punt_returner_return_yards integer,
    yards_per_punt_return numeric(4,1),
    punt_return_touchdowns integer,
    field_goal_attempts integer,
    field_goals_made integer,
    field_goal_pct numeric(5,2),
    field_goals_made_1_19 integer,
    field_goals_made_20_29 integer,
    field_goals_made_30_39 integer,
    field_goals_made_40_49 integer,
    field_goals_made_50 integer,
    field_goals_attempts_1_19 integer,
    field_goals_attempts_20_29 integer,
    field_goals_attempts_30_39 integer,
    field_goals_attempts_40_49 integer,
    field_goals_attempts_50 integer,
    punts integer,
    punt_yards integer
);


--
-- Name: season_stats_season_stat_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.season_stats_season_stat_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: season_stats_season_stat_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.season_stats_season_stat_id_seq OWNED BY public.season_stats.season_stat_id;


--
-- Name: team_standings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.team_standings (
    standing_id integer NOT NULL,
    team_id integer NOT NULL,
    season integer NOT NULL,
    win_streak integer,
    points_for integer,
    points_against integer,
    playoff_seed integer,
    point_differential integer,
    overall_record character varying(10),
    conference_record character varying(10),
    division_record character varying(10),
    wins integer NOT NULL,
    losses integer NOT NULL,
    ties integer NOT NULL,
    home_record character varying(10),
    road_record character varying(10)
);


--
-- Name: team_standings_standing_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.team_standings_standing_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: team_standings_standing_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.team_standings_standing_id_seq OWNED BY public.team_standings.standing_id;


--
-- Name: game_stats stat_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.game_stats ALTER COLUMN stat_id SET DEFAULT nextval('public.game_stats_stat_id_seq'::regclass);


--
-- Name: season_stats season_stat_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.season_stats ALTER COLUMN season_stat_id SET DEFAULT nextval('public.season_stats_season_stat_id_seq'::regclass);


--
-- Name: team_standings standing_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.team_standings ALTER COLUMN standing_id SET DEFAULT nextval('public.team_standings_standing_id_seq'::regclass);


--
-- Name: game_stats game_stats_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.game_stats
    ADD CONSTRAINT game_stats_pkey PRIMARY KEY (stat_id);


--
-- Name: game_stats game_stats_player_id_game_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.game_stats
    ADD CONSTRAINT game_stats_player_id_game_id_key UNIQUE (player_id, game_id);


--
-- Name: games games_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.games
    ADD CONSTRAINT games_pkey PRIMARY KEY (game_id);


--
-- Name: players players_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.players
    ADD CONSTRAINT players_pkey PRIMARY KEY (player_id);


--
-- Name: season_stats season_stats_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.season_stats
    ADD CONSTRAINT season_stats_pkey PRIMARY KEY (season_stat_id);


--
-- Name: season_stats season_stats_player_id_season_postseason_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.season_stats
    ADD CONSTRAINT season_stats_player_id_season_postseason_key UNIQUE (player_id, season, postseason);


--
-- Name: team_standings team_standings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.team_standings
    ADD CONSTRAINT team_standings_pkey PRIMARY KEY (standing_id);


--
-- Name: team_standings team_standings_team_id_season_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.team_standings
    ADD CONSTRAINT team_standings_team_id_season_key UNIQUE (team_id, season);


--
-- Name: teams teams_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.teams
    ADD CONSTRAINT teams_pkey PRIMARY KEY (team_id);


--
-- Name: game_stats game_stats_game_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.game_stats
    ADD CONSTRAINT game_stats_game_id_fkey FOREIGN KEY (game_id) REFERENCES public.games(game_id);


--
-- Name: game_stats game_stats_player_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.game_stats
    ADD CONSTRAINT game_stats_player_id_fkey FOREIGN KEY (player_id) REFERENCES public.players(player_id);


--
-- Name: game_stats game_stats_team_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.game_stats
    ADD CONSTRAINT game_stats_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.teams(team_id);


--
-- Name: games games_home_team_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.games
    ADD CONSTRAINT games_home_team_id_fkey FOREIGN KEY (home_team_id) REFERENCES public.teams(team_id);


--
-- Name: games games_visitor_team_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.games
    ADD CONSTRAINT games_visitor_team_id_fkey FOREIGN KEY (visitor_team_id) REFERENCES public.teams(team_id);


--
-- Name: players players_team_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.players
    ADD CONSTRAINT players_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.teams(team_id);


--
-- Name: season_stats season_stats_player_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.season_stats
    ADD CONSTRAINT season_stats_player_id_fkey FOREIGN KEY (player_id) REFERENCES public.players(player_id);


--
-- Name: team_standings team_standings_team_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.team_standings
    ADD CONSTRAINT team_standings_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.teams(team_id);


--
-- Name: TABLE game_stats; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.game_stats TO basketball_user;


--
-- Name: TABLE games; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.games TO basketball_user;


--
-- Name: TABLE players; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.players TO basketball_user;


--
-- Name: TABLE teams; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.teams TO basketball_user;


--
-- Name: TABLE derived_season_stats; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.derived_season_stats TO basketball_user;


--
-- Name: SEQUENCE game_stats_stat_id_seq; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON SEQUENCE public.game_stats_stat_id_seq TO basketball_user;


--
-- Name: TABLE season_stats; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.season_stats TO basketball_user;


--
-- Name: SEQUENCE season_stats_season_stat_id_seq; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON SEQUENCE public.season_stats_season_stat_id_seq TO basketball_user;


--
-- Name: TABLE team_standings; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.team_standings TO basketball_user;


--
-- Name: SEQUENCE team_standings_standing_id_seq; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON SEQUENCE public.team_standings_standing_id_seq TO basketball_user;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: -
--

ALTER DEFAULT PRIVILEGES FOR ROLE marcusimponenti IN SCHEMA public GRANT ALL ON SEQUENCES TO basketball_user;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: -
--

ALTER DEFAULT PRIVILEGES FOR ROLE marcusimponenti IN SCHEMA public GRANT ALL ON FUNCTIONS TO basketball_user;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: -
--

ALTER DEFAULT PRIVILEGES FOR ROLE marcusimponenti IN SCHEMA public GRANT ALL ON TABLES TO basketball_user;


--
-- PostgreSQL database dump complete
--

