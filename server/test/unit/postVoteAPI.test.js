process.env.JWT_SECRET = 'test-value'; // set the jwt token

// const {
//     getScore
// } = require('../../api/postVoteAPI');

// jest.mock('../../db', () => {
//     /**
//      * Converts a multiline queryText to a single line query
//      * 
//      * @param {string} queryText
//      */
//     // const oneLineQuery = (queryText) => queryText.trim().replace(/\n/g, ' ').replace(/ {2,}/g, ' ');

//     return {
//         connect: jest.fn(),
//         query: jest.fn().mockImplementation((_query) => {
//             // TODO: change this if added some functionality
//             const result = {
//                 rows: [
//                     {
//                         upvote: true,
//                         count: 100
//                     }, {
//                         upvote: false,
//                         count: 10
//                     }
//                 ],
//                 rowCount: 2
//             };

//             // query.text = oneLineQuery(query.text);

//             return result;
//         }),
//         end: jest.fn(),
//     };
// });

// const mockRequest = (data) => {
//     return data;
// };

// const mockResponse = () => {
//     const res = {};
//     res.status = jest.fn().mockReturnValue(res);
//     res.send = jest.fn().mockReturnValue(res);
//     return res;
// };

// const posts = [
//     'paaaaaaaaaa1',
//     'paaaaaaaaaa2',
//     'paaaaaaaaaa3'
// ];

describe('Unit test: postVoteAPI.js', () => {
    describe('API: getScore', () => {
        test('GOOD', async () => {
            // const req = mockRequest({
            //     params: {
            //         post: posts[0]
            //     }
            // });
            // const res = mockResponse();

            // await getScore(req, res);

            // expect(res.status).toHaveBeenCalledWith(200);
            // expect(res.send).toHaveBeenCalledWith(
            //     expect.objectContaining({
            //         score: expect.any(Number)
            //     })
            // );
        });
    });
});
