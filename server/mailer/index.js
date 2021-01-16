const mailer = require('nodemailer');

const transporter = mailer.createTransport({ 
    service: process.env.EMAILER_SERVICE,
    post: process.env.EMAILER_PORT,
    auth: { 
        user: process.env.EMAILER_EMAIL, 
        pass: process.env.EMAILER_PASS
    }
});

module.exports = {
    // TODO: unit and int test
    sendMail: (text, to, subject) => {
        const msg = {
            from: 'ROCKET <rocket.sweng@gmail.com>',
            to, subject, text
        };

        return transporter.sendMail(msg);
    }
};