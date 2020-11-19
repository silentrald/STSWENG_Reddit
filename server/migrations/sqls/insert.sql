
/* users */ /* password is 'password' */
INSERT INTO users(username, password, email) VALUES
    ('username', '$2b$10$uIugTkePCOSCvKw.jccpAeBZ.b1IatDqh.Qt.dnzfpQY.ABeRGwIS', 'email@email.com'),
    ('captain1', '$2b$10$uIugTkePCOSCvKw.jccpAeBZ.b1IatDqh.Qt.dnzfpQY.ABeRGwIS', 'captain@station.org'),
    ('crewmate', '$2b$10$uIugTkePCOSCvKw.jccpAeBZ.b1IatDqh.Qt.dnzfpQY.ABeRGwIS', 'crewmate@station.org'),
    ('imposter', '$2b$10$uIugTkePCOSCvKw.jccpAeBZ.b1IatDqh.Qt.dnzfpQY.ABeRGwIS', 'impostor@station.org'),
    ('captain2', '$2b$10$uIugTkePCOSCvKw.jccpAeBZ.b1IatDqh.Qt.dnzfpQY.ABeRGwIS', 'captain2@station.org');

/* stations */
INSERT INTO stations(name, description, rules) VALUES
    ('Sample Station', 'This is a test station', '1. Do not delete this'),
    ('Sample Station 2', 'This is another test station', '1. Do not delete this');

/* captains */
INSERT INTO captains(username, station_name) VALUES
    ('captain1', 'Sample Station'),
    ('captain2', 'Sample Station 2');

/* crewmates */
INSERT INTO crewmates(username, station_name) VALUES
    ('crewmate', 'Sample Station');

/* posts */
INSERT INTO posts(post_id, text, author, station_name) VALUES
    ('paaaaaaaaaa1', 'Sample Post by captain', 'captain1', 'Sample Station'),
    ('paaaaaaaaaa2', 'Sample Post by crewmate', 'crewmate', 'Sample Station'),
    ('paaaaaaaaaa3', 'Sample Post by crewmate', 'captain2', 'Sample Station 2');

/* comments */
/* subposts */
INSERT INTO comments(comment_id, text, author, station_name) VALUES
    ('caaaaaaaaaa1', 'First comment by crewmate to captain', 'crewmate', 'Sample Station'),
    ('caaaaaaaaaa2', 'Commented to my post', 'crewmate', 'Sample Station'),
    ('caaaaaaaaaa3', '2nd comment by me as well', 'captain1', 'Sample Station'),
    ('caaaaaaaaaa4', 'Comment', 'captain2', 'Sample Station 2');

INSERT INTO subposts(parent_post, comment_id) VALUES
    ('paaaaaaaaaa1', 'caaaaaaaaaa1'),
    ('paaaaaaaaaa2', 'caaaaaaaaaa2'),
    ('paaaaaaaaaa1', 'caaaaaaaaaa3'),
    ('paaaaaaaaaa3', 'caaaaaaaaaa4');
