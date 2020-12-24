
CREATE OR REPLACE FUNCTION pseudo_encrypt(VALUE bigint) returns bigint AS $$
DECLARE
    l1 bigint;
    l2 bigint;
    r1 bigint;
    r2 bigint;
    i  int:=0;
BEGIN
    l1:= (VALUE >> 32) & 4294967295::bigint;
    r1:= VALUE & 4294967295;
    WHILE i < 3 LOOP
        l2 := r1;
        r2 := l1 # ((((1366.0 * r1 + 150889) % 714025) / 714025.0) * 32767*32767)::int;
        l1 := l2;
        r1 := r2;
        i := i + 1;
    END LOOP;
RETURN ((l1::bigint << 32) + r1);
END;
$$ LANGUAGE plpgsql strict immutable;

/* Feistel Network RETURNS a string with max of 11 characters */
CREATE OR REPLACE FUNCTION stringify_bigint(n bigint) RETURNS text LANGUAGE plpgsql IMMUTABLE STRICT AS $$
DECLARE
    alphabet    text    := 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    base        int     := length(alphabet);
    _n          bigint  := abs(n);
    output      text    := '';
BEGIN
    LOOP
        output := output || substr(alphabet, 1 + (_n % base)::int, 1);
        _n := _n / base;
        EXIT WHEN _n = 0;
    END LOOP;
    RETURN output;
END $$;

/* TABLES */
CREATE TABLE admins (
    username    VARCHAR(64)     PRIMARY KEY,
    password    VARCHAR(60)     NOT NULL
);

CREATE TYPE gender_enum AS ENUM ('f', 'm', 'o', 'p');
CREATE TABLE users (
    username    VARCHAR(64)     PRIMARY KEY,
    password    VARCHAR(60)     NOT NULL,
    email       VARCHAR(256)    NOT NULL UNIQUE,
    fname       VARCHAR(50)     DEFAULT '' NOT NULL,
    lname       VARCHAR(50)     DEFAULT '' NOT NULL,
    gender      gender_enum,
    birthday    DATE,
    bio         VARCHAR(200)    DEFAULT '' NOT NULL,
    fame        INT             DEFAULT 0 NOT NULL,
    banned      BOOLEAN         DEFAULT false NOT NULL
);

CREATE TABLE stations (
    name            VARCHAR(64)     PRIMARY KEY,
    description     VARCHAR(250),
    rules           VARCHAR(1000),
    date_created    DATE            DEFAULT now() NOT NULL,
    members         BIGINT          DEFAULT 1 NOT NULL,
    archived        BOOLEAN         DEFAULT false NOT NULL
);

CREATE TABLE passengers (
    username                    VARCHAR(64)     NOT NULL,
    FOREIGN KEY(username)       REFERENCES      users(username),
    station_name                VARCHAR(64)     NOT NULL,
    FOREIGN KEY(station_name)   REFERENCES      stations(name),
    date_join                   DATE            DEFAULT now() NOT NULL,

    CONSTRAINT pk_passengers PRIMARY KEY (username, station_name)
);

CREATE TABLE captains() INHERITS (passengers);
CREATE TABLE crewmates() INHERITS (passengers);

CREATE SEQUENCE post_id_seq MINVALUE -9223372036854775808 START WITH 0;
CREATE OR REPLACE FUNCTION post_id() RETURNS text LANGUAGE plpgsql IMMUTABLE STRICT AS $$
BEGIN
    RETURN 'p' || stringify_bigint(pseudo_encrypt(nextval('post_id_seq')));
END $$;
CREATE TABLE posts (
    post_id                     VARCHAR(12)     PRIMARY KEY,
    title                       VARCHAR(64),
    text                        VARCHAR(1000),
    score                       INT             DEFAULT 0 NOT NULL,
    author                      VARCHAR(64),
    FOREIGN KEY(author)         REFERENCES      users(username),
    timestamp_created           TIMESTAMP       DEFAULT now() NOT NULL,
    deleted                     BOOLEAN         DEFAULT false NOT NULL,
    station_name                VARCHAR(64)     NOT NULL,
    FOREIGN KEY(station_name)   REFERENCES      stations(name)
);

CREATE SEQUENCE comment_id_seq MINVALUE -9223372036854775808;
CREATE OR REPLACE FUNCTION comment_id() RETURNS text LANGUAGE plpgsql IMMUTABLE STRICT AS $$
BEGIN
    RETURN 'c' || stringify_bigint(pseudo_encrypt(nextval('comment_id_seq')));
END $$;
CREATE TABLE comments (
    comment_id                  VARCHAR(12)     PRIMARY KEY,
    text                        VARCHAR(1000),
    score                       INT             DEFAULT 0 NOT NULL,
    author                      VARCHAR(64),
    FOREIGN KEY(author)         REFERENCES      users(username),
    station_name                VARCHAR(64)     NOT NULL,
    FOREIGN KEY(station_name)   REFERENCES      stations(name),
    timestamp_created           TIMESTAMP       DEFAULT now() NOT NULL,
    deleted                     BOOLEAN         DEFAULT false NOT NULL
);

CREATE TABLE subposts (
    comment_id                  VARCHAR(12) NOT NULL,
    parent_post                 VARCHAR(12) NOT NULL,
    FOREIGN KEY(parent_post)    REFERENCES  posts(post_id),

    CONSTRAINT pk_subposts PRIMARY KEY (comment_id, parent_post)
);

CREATE TABLE subcomments (
    comment_id                  VARCHAR(12) NOT NULL,
    parent_comment              VARCHAR(12) NOT NULL,
    FOREIGN KEY(parent_comment) REFERENCES  comments(comment_id),

    CONSTRAINT pk_subcomments PRIMARY KEY (comment_id, parent_comment)
);

CREATE TABLE votes (
    username                    VARCHAR(64) NOT NULL,
    FOREIGN KEY(username)       REFERENCES  users(username),
    upvote                      BOOLEAN     NOT NULL
);

CREATE TABLE post_votes (
    post_id                VARCHAR(12)  NOT NULL,
    FOREIGN KEY(post_id)   REFERENCES   posts(post_id),

    CONSTRAINT pk_post_votes PRIMARY KEY(post_id, username)
) INHERITS (votes);

CREATE TABLE comment_votes (
    comment_id              VARCHAR(12) NOT NULL,
    FOREIGN KEY(comment_id) REFERENCES  comments(comment_id),

    CONSTRAINT pk_comment_votes PRIMARY KEY(comment_id, username)
) INHERITS (votes);

/* p: Pend; r: Resolved */
CREATE TYPE report_status_enum AS ENUM ('p', 'r');

CREATE TABLE reports (
    report_id               SERIAL              PRIMARY KEY,
    reporter                VARCHAR(64)         NOT NULL,
    FOREIGN KEY(reporter)   REFERENCES          users(username),
    header                  VARCHAR(50)         NOT NULL,
    reason                  VARCHAR(250)        NOT NULL,
    status                  report_status_enum  DEFAULT 'p' NOT NULL
);

CREATE TABLE post_reports (
    post_id                 VARCHAR(12)     NOT NULL,
    FOREIGN KEY(post_id)    REFERENCES      posts(post_id)
) INHERITS (reports);

CREATE TABLE comment_reports (
    comment_id              VARCHAR(12)     NOT NULL,
    FOREIGN KEY(comment_id) REFERENCES      comments(comment_id)
) INHERITS (reports);

CREATE TABLE station_reports (
    station_name                VARCHAR(64)     NOT NULL,
    FOREIGN KEY(station_name)   REFERENCES      stations(name)
) INHERITS (reports);

CREATE TABLE user_reports (
    username                VARCHAR(64) NOT NULL,
    FOREIGN KEY(username)   REFERENCES  users(username)
) INHERITS (reports);
