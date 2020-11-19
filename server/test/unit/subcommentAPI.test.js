process.env.JWT_SECRET = 'test-value'; // set the jwt token

const {
    postSubcomment
} = require('../../api/subcommentAPI');

jest.mock('../../db', () => {
    /**
     * Converts a multiline queryText to a single line query
     * 
     * @param {string} queryText
     */
    const oneLineQuery = (queryText) => queryText.trim().replace(/\n/g, ' ').replace(/ {2,}/g, ' ');

    return {
        connect: jest.fn().mockImplementation(() => ({
            query: jest.fn().mockImplementation(query => {
                if (query === 'BEGIN' || query === 'COMMIT' || query === 'ROLLBACK') {
                    return;
                }

                const result = {
                    rows: [],
                    rowCount: 0
                };
    
                query.text = oneLineQuery(query.text);

                if (query.text === 'INSERT INTO comments(comment_id, text, author, station_name) VALUES(comment_id(), $1, $2, $3) RETURNING comment_id;'
                    && query.values[0] && query.values[1]
                    && query.values[2] && query.values[2] === 'Station Name') {
                    result.rows = [{
                        comment_id: 'cdummydummy'
                    }];
                    result.rowCount = 1;
                } else if (query.text === 'INSERT INTO subcomments(parent_comment, comment_id) VALUES($1, $2);'
                    && query.values[0] && query.values[0] === 'cdummydummy' && query.values[1]) {
                    result.rows = 'INSERT 1 0';
                    result.rowCount = 1;
                }
    
                return result;
            }),
            release: jest.fn()
        })),
        query: jest.fn().mockImplementation(query => {
            const result = {
                rows: [],
                rowCount: 0
            };

            query.text = oneLineQuery(query.text);

            if (query.text === 'SELECT * FROM passengers WHERE username=$1 AND station_name=$2 LIMIT 1;'
                && query.values[0] === 'crewmate' && query.values[1] === 'Station Name') {
                result.rows = [{
                    username: query.values[0],
                    station_name: query.values[1]
                }];
                result.rowCount = 1;
            } else if (query.text === 'SELECT * FROM comments WHERE comment_id=$1 LIMIT 1;'
                && query.values[0] === 'caaaaaaaaaa1') {
                result.rows = [{
                    comment_id: query.values[0],
                    station_name: 'Station Name'
                }];
                result.rowCount = 1;
            }

            return result;
        }),
        end: jest.fn(),
    };
});

const mockRequest = (data) => {
    return data;
};

const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    return res;
};

// DATA
const station = 'Station Name';
const comments = {
    0: 'caaaaaaaaaa1',
    1: 'caaaaaaaaaa2',
    2: 'caaaaaaaaaa3'
};
const crewmateUser = {
    username: 'crewmate',
    password: 'password'
};

// const oneLineQuery = (queryText) => queryText.trim().replace(/\n/g, ' ').replace(/ {2,}/g, ' ');

describe('Unit Test: subcommentAPI', () => {
    describe('API: postSubcomment', () => {
        let subcomment, db;
        let queries;

        beforeAll(() => {
            queries = {
                passenger: 'SELECT * FROM passengers WHERE username=$1 AND station_name=$2 LIMIT 1;',
                comment: 'SELECT * FROM comments WHERE comment_id=$1 LIMIT 1;',
                insComment: 'INSERT INTO comments(comment_id, text, author, station_name) VALUES(comment_id(), $1, $2, $3) RETURNING comment_id;',
                insSubcomment: 'INSERT INTO subcomments(parent_comment, comment_id) VALUES($1, $2);'
            };
        });

        beforeEach(() => {
            db = require('../../db');
            subcomment = {
                parentComment: comments[0],
                text: 'Default Subcomment 1',
                station
            };
        });

        test('GOOD', async () => {
            const req = mockRequest({
                body: subcomment,
                user: crewmateUser
            });
            const res = mockResponse();

            await postSubcomment(req, res);

            expect(res.status).toHaveBeenCalledWith(201);

            expect(db.query).toHaveBeenCalledWith({
                text: queries.passenger,
                values: [
                    crewmateUser.username,
                    station
                ]
            });
            expect(db.query).toHaveBeenCalledWith({
                text: queries.comment,
                values: [ subcomment.parentComment ]
            });

            expect(db.connect).toHaveBeenCalledTimes(1);
            
            const { query, release } = db.connect.mock.results[0].value;
            
            expect(query).toHaveBeenCalledWith('BEGIN');
            expect(query).toHaveBeenCalledWith({
                text: queries.insComment,
                values: [
                    subcomment.text,
                    crewmateUser.username,
                    subcomment.station
                ]
            });
            expect(query).toHaveBeenCalledWith({
                text: queries.insSubcomment,
                values: [
                    subcomment.parentComment,
                    'cdummydummy'
                ]
            });
            expect(query).toHaveBeenCalledWith('COMMIT');

            expect(release).toHaveBeenCalledTimes(1);
        });
    });
});
