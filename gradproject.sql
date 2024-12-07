--
-- PostgreSQL database dump
--

-- Dumped from database version 17.0
-- Dumped by pg_dump version 17.0

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
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
-- Name: admin_user; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.admin_user (
    admin_id integer NOT NULL,
    username character varying(255) NOT NULL,
    password text NOT NULL,
    name text NOT NULL,
    email character varying(255) NOT NULL
);


ALTER TABLE public.admin_user OWNER TO postgres;

--
-- Name: admin_user_admin_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.admin_user_admin_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.admin_user_admin_id_seq OWNER TO postgres;

--
-- Name: admin_user_admin_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.admin_user_admin_id_seq OWNED BY public.admin_user.admin_id;


--
-- Name: image_store; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.image_store (
    media_id integer NOT NULL,
    media_name text,
    media_type text,
    media_url text NOT NULL,
    tribe_id integer,
    story_id integer
);


ALTER TABLE public.image_store OWNER TO postgres;

--
-- Name: image_store_media_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.image_store_media_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.image_store_media_id_seq OWNER TO postgres;

--
-- Name: image_store_media_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.image_store_media_id_seq OWNED BY public.image_store.media_id;


--
-- Name: map_location; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.map_location (
    location_id integer NOT NULL,
    latitude double precision NOT NULL,
    longitude double precision NOT NULL,
    tribe_id integer,
    story_id integer
);


ALTER TABLE public.map_location OWNER TO postgres;

--
-- Name: map_location_location_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.map_location_location_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.map_location_location_id_seq OWNER TO postgres;

--
-- Name: map_location_location_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.map_location_location_id_seq OWNED BY public.map_location.location_id;


--
-- Name: stories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.stories (
    story_id integer NOT NULL,
    tribe_id integer,
    story_name text NOT NULL,
    story_year integer,
    story_text text,
    story_images text,
    story_references text,
    published boolean DEFAULT false
);


ALTER TABLE public.stories OWNER TO postgres;

--
-- Name: stories_story_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.stories_story_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.stories_story_id_seq OWNER TO postgres;

--
-- Name: stories_story_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.stories_story_id_seq OWNED BY public.stories.story_id;


--
-- Name: tribes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tribes (
    tribe_id integer NOT NULL,
    tribe_name text NOT NULL,
    tribe_text text,
    tribe_images text,
    tribe_references text,
    start_year integer,
    end_year integer,
    published boolean DEFAULT true
);


ALTER TABLE public.tribes OWNER TO postgres;

--
-- Name: tribes_tribe_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tribes_tribe_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tribes_tribe_id_seq OWNER TO postgres;

--
-- Name: tribes_tribe_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tribes_tribe_id_seq OWNED BY public.tribes.tribe_id;


--
-- Name: admin_user admin_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admin_user ALTER COLUMN admin_id SET DEFAULT nextval('public.admin_user_admin_id_seq'::regclass);


--
-- Name: image_store media_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.image_store ALTER COLUMN media_id SET DEFAULT nextval('public.image_store_media_id_seq'::regclass);


--
-- Name: map_location location_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.map_location ALTER COLUMN location_id SET DEFAULT nextval('public.map_location_location_id_seq'::regclass);


--
-- Name: stories story_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stories ALTER COLUMN story_id SET DEFAULT nextval('public.stories_story_id_seq'::regclass);


--
-- Name: tribes tribe_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tribes ALTER COLUMN tribe_id SET DEFAULT nextval('public.tribes_tribe_id_seq'::regclass);


--
-- Data for Name: admin_user; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.admin_user (admin_id, username, password, name, email) FROM stdin;
\.


--
-- Data for Name: image_store; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.image_store (media_id, media_name, media_type, media_url, tribe_id, story_id) FROM stdin;
\.


--
-- Data for Name: map_location; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.map_location (location_id, latitude, longitude, tribe_id, story_id) FROM stdin;
\.


--
-- Data for Name: stories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.stories (story_id, tribe_id, story_name, story_year, story_text, story_images, story_references, published) FROM stdin;
\.


--
-- Data for Name: tribes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tribes (tribe_id, tribe_name, tribe_text, tribe_images, tribe_references, start_year, end_year, published) FROM stdin;
\.


--
-- Name: admin_user_admin_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.admin_user_admin_id_seq', 1, false);


--
-- Name: image_store_media_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.image_store_media_id_seq', 1, false);


--
-- Name: map_location_location_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.map_location_location_id_seq', 1, false);


--
-- Name: stories_story_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.stories_story_id_seq', 1, false);


--
-- Name: tribes_tribe_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tribes_tribe_id_seq', 1, false);


--
-- Name: admin_user admin_user_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admin_user
    ADD CONSTRAINT admin_user_email_key UNIQUE (email);


--
-- Name: admin_user admin_user_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admin_user
    ADD CONSTRAINT admin_user_pkey PRIMARY KEY (admin_id);


--
-- Name: admin_user admin_user_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admin_user
    ADD CONSTRAINT admin_user_username_key UNIQUE (username);


--
-- Name: image_store image_store_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.image_store
    ADD CONSTRAINT image_store_pkey PRIMARY KEY (media_id);


--
-- Name: map_location map_location_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.map_location
    ADD CONSTRAINT map_location_pkey PRIMARY KEY (location_id);


--
-- Name: stories stories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stories
    ADD CONSTRAINT stories_pkey PRIMARY KEY (story_id);


--
-- Name: tribes tribes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tribes
    ADD CONSTRAINT tribes_pkey PRIMARY KEY (tribe_id);


--
-- Name: idx_map_location_story_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_map_location_story_id ON public.map_location USING btree (story_id);


--
-- Name: idx_map_location_tribe_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_map_location_tribe_id ON public.map_location USING btree (tribe_id);


--
-- Name: image_store image_store_story_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.image_store
    ADD CONSTRAINT image_store_story_id_fkey FOREIGN KEY (story_id) REFERENCES public.stories(story_id) ON DELETE CASCADE;


--
-- Name: image_store image_store_tribe_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.image_store
    ADD CONSTRAINT image_store_tribe_id_fkey FOREIGN KEY (tribe_id) REFERENCES public.tribes(tribe_id) ON DELETE CASCADE;


--
-- Name: map_location map_location_story_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.map_location
    ADD CONSTRAINT map_location_story_id_fkey FOREIGN KEY (story_id) REFERENCES public.stories(story_id) ON DELETE CASCADE;


--
-- Name: map_location map_location_tribe_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.map_location
    ADD CONSTRAINT map_location_tribe_id_fkey FOREIGN KEY (tribe_id) REFERENCES public.tribes(tribe_id) ON DELETE CASCADE;


--
-- Name: stories stories_tribe_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stories
    ADD CONSTRAINT stories_tribe_id_fkey FOREIGN KEY (tribe_id) REFERENCES public.tribes(tribe_id) ON DELETE SET NULL;


--
-- PostgreSQL database dump complete
--

