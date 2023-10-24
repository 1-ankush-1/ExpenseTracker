let Sib = require('sib-api-v3-sdk');

function sendMail(email) {

    //creating client 
    let client = Sib.ApiClient.instance;

    //get api from client
    let apiKey = client.authentications['api-key'];

    apiKey.apiKey = process.env.MAIL_KEY;

    console.log(process.env.MAIL_KEY, process.env.SENDER_MAIL); // log environment variables

    //to send to one person
    let TranEmailAPi = new Sib.TransactionalEmailsApi();

    const sender = {
        email: process.env.SENDER_MAIL
    }

    //list of receivers
    const receivers = [
        {
            email: email
        },
    ]

    //sending mail
    return TranEmailAPi.sendTransacEmail({
        sender,
        to: receivers,
        subject: "first mail",
        textContent: "some message"
    }).then(result => {
        return result.messageId;
    }).catch(err => console.error(err.reponse.message))
}

module.exports = sendMail;
