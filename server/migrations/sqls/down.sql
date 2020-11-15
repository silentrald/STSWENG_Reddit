/* PURGE */
DROP TABLE user_reports;
DROP TABLE station_reports;
DROP TABLE comment_reports;
DROP TABLE post_reports;
DROP TABLE reports;
DROP TABLE comment_votes;
DROP TABLE post_votes;
DROP TABLE votes;
DROP TABLE subposts;
DROP TABLE subcomments;
DROP TABLE comments;
DROP TABLE posts;
DROP TABLE crewmates;
DROP TABLE captains;
DROP TABLE passengers;
DROP TABLE stations;
DROP TABLE users;
DROP TABLE admins;

DROP FUNCTION comment_id;
DROP SEQUENCE comment_id_seq;
DROP FUNCTION post_id;
DROP SEQUENCE post_id_seq;

DROP TYPE report_status_enum;
DROP TYPE gender_enum;

DROP FUNCTION stringify_bigint;
DROP FUNCTION pseudo_encrypt;