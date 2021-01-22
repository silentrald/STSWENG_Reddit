
/* users */ /* password is 'password' */
INSERT INTO users(username, password, email) VALUES
    ('username', '$2b$10$uIugTkePCOSCvKw.jccpAeBZ.b1IatDqh.Qt.dnzfpQY.ABeRGwIS', 'email@email.com'),
    ('captain1', '$2b$10$uIugTkePCOSCvKw.jccpAeBZ.b1IatDqh.Qt.dnzfpQY.ABeRGwIS', 'captain@station.org'),
    ('crewmate', '$2b$10$uIugTkePCOSCvKw.jccpAeBZ.b1IatDqh.Qt.dnzfpQY.ABeRGwIS', 'crewmate@station.org'),
    ('imposter', '$2b$10$uIugTkePCOSCvKw.jccpAeBZ.b1IatDqh.Qt.dnzfpQY.ABeRGwIS', 'impostor@station.org'),
    ('captain2', '$2b$10$uIugTkePCOSCvKw.jccpAeBZ.b1IatDqh.Qt.dnzfpQY.ABeRGwIS', 'captain2@station.org');

INSERT INTO users(username, password, email, fname, lname, gender, birthday, bio) VALUES
    ('userInfo', '$2b$10$uIugTkePCOSCvKw.jccpAeBZ.b1IatDqh.Qt.dnzfpQY.ABeRGwIS', 'userinfo@station.org', 'FNAME', 'LNAME', 'm', '10-06-1999', 'Test bio');

/* stations */
INSERT INTO stations(name, description, rules, members) VALUES
    ('SampleStation', 'This is a test station', '1. Do not delete this', 2); /* captain1, crewmate */

INSERT INTO stations(name, description, rules) VALUES
    ('SampleStation2', 'This is another test station', '1. Do not delete this'), /* captain2 */
    ('SampleStation3', 'This is another test station', '1. Do not delete this'), /* captain2 */
    ('SampleStation4', 'This is another test station', '1. Do not delete this'), /* captain2 */
    ('SampleStation5', 'This is another test station', '1. Do not delete this'); /* captain2 */

/* captains */
INSERT INTO captains(username, station_name) VALUES
    ('captain1', 'SampleStation'),
    ('captain2', 'SampleStation2'),
    ('captain2', 'SampleStation3'),
    ('captain2', 'SampleStation4'),
    ('captain2', 'SampleStation5');

/* crewmates */
INSERT INTO crewmates(username, station_name) VALUES
    ('crewmate', 'SampleStation');

/* posts */
INSERT INTO posts(post_id, title, text, score, author, station_name, timestamp_created, comment_count) VALUES
    ('paaaaaaaaaa1', 'Sample Title 1', 'Sample Post by captain', 1, 'captain1', 'SampleStation', now() - interval '2 day', 14),
    ('paaaaaaaaaa2', 'Sample Title 2', 'Sample Post by crewmate', -1, 'crewmate', 'SampleStation', now() - interval '1 days', 1);

INSERT INTO posts(post_id, title, text, author, station_name) VALUES
    ('paaaaaaaaaa3', 'Sample Markdown', '# Sample Post by crewmate', 'captain2', 'SampleStation2'),
    ('paaaaaaaaaa4', 'Sample Title 4', 'Sample Post by captain', 'captain1', 'SampleStation'),
    ('paaaaaaaaaa5', 'Sample Title 5', 'Sample Post by crewmate', 'crewmate', 'SampleStation'),
    ('paaaaaaaaaa6', 'Sample Title 6', 'Sample Post by captain', 'captain1', 'SampleStation'),
    ('paaaaaaaaaa7', 'Sample Title 7', 'Sample Post by crewmate', 'crewmate', 'SampleStation'),
    ('paaaaaaaaaa8', 'Sample Title 8', 'Sample Post by captain', 'captain1', 'SampleStation'),
    ('paaaaaaaaaa9', 'Sample Title 9', 'Sample Post by crewmate', 'crewmate', 'SampleStation'),
    ('paaaaaaaaa10', 'Sample Title 10', 'Sample Post by captain', 'captain1', 'SampleStation'),
    ('paaaaaaaaa11', 'Sample Title 11', 'Sample Post by crewmate', 'crewmate', 'SampleStation'),
    ('paaaaaaaaa12', 'Sample Title 12', 'Sample Post by captain', 'captain1', 'SampleStation'),
    ('paaaaaaaaa13', 'Sample Title 13', 'Sample Post by crewmate', 'crewmate', 'SampleStation'),
    ('paaaaaaaaa14', 'Sample Title 14', 'Sample Post by captain', 'captain1', 'SampleStation'),
    ('paaaaaaaaa15', 'Sample Title 15', 'Sample Post by crewmate', 'crewmate', 'SampleStation'),
    ('paaaaaaaaa16', 'Sample Title 16', 'Sample Post by crewmate', 'crewmate', 'SampleStation'),
    ('paaaaaaaaa17', 'Sample Title 17', 'Sample Post by crewmate', 'crewmate', 'SampleStation'),
    ('paaaaaaaaa18', 'Sample Title 18', 'Sample Post by crewmate', 'crewmate', 'SampleStation'),
    ('paaaaaaaaa19', 'Sample Title 19', 'Sample Post by crewmate', 'crewmate', 'SampleStation'),
    ('paaaaaaaaa20', 'Sample Title 20', 'Sample Post by crewmate', 'crewmate', 'SampleStation');

/* comments */
/* subposts */
INSERT INTO comments(comment_id, text, author, station_name) VALUES
    ('caaaaaaaaaa1', 'First comment by crewmate to captain', 'crewmate', 'SampleStation'),
    ('caaaaaaaaaa2', 'Commented to my post', 'crewmate', 'SampleStation'),
    ('caaaaaaaaaa3', '2nd comment by me as well', 'captain1', 'SampleStation'),
    ('caaaaaaaaaa4', 'Comment', 'captain2', 'SampleStation2');

INSERT INTO subposts(parent_post, comment_id) VALUES
    ('paaaaaaaaaa1', 'caaaaaaaaaa1'),
    ('paaaaaaaaaa1', 'caaaaaaaaaa2'),
    ('paaaaaaaaaa1', 'caaaaaaaaaa3'),
    ('paaaaaaaaaa2', 'caaaaaaaaaa4');

/* subcomments */
INSERT INTO comments(comment_id, text, author, station_name) VALUES
    ('caaaaaaaaaa5', 'More Comments', 'captain1', 'SampleStation'),
    ('caaaaaaaaaa6', 'More Comments1', 'captain1', 'SampleStation'),
    ('caaaaaaaaaa7', 'More Comments2', 'captain1', 'SampleStation'),
    ('caaaaaaaaaa8', 'More Comments3', 'captain1', 'SampleStation'),
    ('caaaaaaaaaa9', 'More Comments4', 'captain1', 'SampleStation'),
    ('caaaaaaaaa10', 'More Comments5', 'captain1', 'SampleStation'),
    ('caaaaaaaaa11', 'More Comments6', 'captain1', 'SampleStation'),
    ('caaaaaaaaa12', 'More Comments7', 'captain1', 'SampleStation'),
    ('caaaaaaaaa13', 'More Comments8', 'captain1', 'SampleStation');

INSERT INTO subcomments(parent_post, parent_comment, comment_id) VALUES
    ('paaaaaaaaaa1', 'caaaaaaaaaa1', 'caaaaaaaaaa5'),
    ('paaaaaaaaaa1', 'caaaaaaaaaa1', 'caaaaaaaaaa6'),
    ('paaaaaaaaaa1', 'caaaaaaaaaa2', 'caaaaaaaaaa7'),
    ('paaaaaaaaaa1', 'caaaaaaaaaa5', 'caaaaaaaaaa8'),
    ('paaaaaaaaaa1', 'caaaaaaaaaa5', 'caaaaaaaaaa9'),
    ('paaaaaaaaaa1', 'caaaaaaaaaa7', 'caaaaaaaaa10'),
    ('paaaaaaaaaa1', 'caaaaaaaaaa7', 'caaaaaaaaa11'),
    ('paaaaaaaaaa1', 'caaaaaaaaaa1', 'caaaaaaaaa12'),
    ('paaaaaaaaaa1', 'caaaaaaaaaa2', 'caaaaaaaaa13');

/* post_votes */
INSERT INTO post_votes(username, post_id, upvote) VALUES
    ('crewmate', 'paaaaaaaaaa1', true),
    ('captain1', 'paaaaaaaaaa1', true),
    ('username', 'paaaaaaaaaa1', false),
    ('crewmate', 'paaaaaaaaaa2', false);
