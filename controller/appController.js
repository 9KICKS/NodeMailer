const nodemailer = require('nodemailer');
const Mailgen = require('mailgen');
const { EMAIL, PASSWORD } = require('../env');

const signup = async (req, res) => {

    let testAccount = await nodemailer.createTestAccount();

    let transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
            user: testAccount.user,
            pass: testAccount.pass,
        },
    });

    let message = {
        from: '"Fred Foo 👻" <foo@example.com>',
        to: "bar@example.com, baz@example.com",
        subject: "Hello ✔",
        text: "You have successfully registered with us.",
        html: "<b>You have successfully registered with us.</b>",
    }

    transporter.sendMail(message).then((info) => {
        return res.status(201).json({
            msg: "Email received.",
            info: info.messageId,
            preview: nodemailer.getTestMessageUrl(info)
        });
    }).catch(error => {
        return res.status(500).json({ error });
    })
}

const getbill = (req, res) => {

    const { userEmail } = req.body;

    let config = {
        service: 'gmail',
        auth: {
            user: EMAIL,
            pass: PASSWORD
        }
    }

    let transporter = nodemailer.createTransport(config);

    let MailGenerator = new Mailgen({
        theme: "default",
        product: {
            name: "Mailgen",
            link: 'https://mailgen.js/'
        }
    })

    let response = {
        body: {
            name: "Folahan",
            intro: "Your bill has arrived.",
            table: {
                data: [
                    {
                        item: "NodeMailer Stack Book",
                        description: "A backend application",
                        price: "#150,000",
                    }
                ]
            }
        },
        outro: "Looking forward to do more business."
    }

    let mail = MailGenerator.generate(response);

    let message = {
        from: EMAIL,
        to: userEmail,
        subject: "Place order",
        html: mail
    }

    transporter.sendMail(message).then(() => {
        return res.status(201).json({
            msg: "You should receive an email."
        })
    }).catch(error => {
        return res.status(500).json({ error })
    })
}

module.exports = {
    signup,
    getbill
}
