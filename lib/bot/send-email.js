const Mailgun = require('mailgun-js');

const { MAILGUN_API_KEY, MAILGUN_EMAIL, SMS_GATEWAYS } = require('../constants.js');

const enabled = Boolean(MAILGUN_API_KEY && MAILGUN_EMAIL);

async function sendEmail (to, subject, message, from = MAILGUN_EMAIL) {
  if (!enabled) return false;
  // console.log("to", to, "from", from, "sub", subject, "msg", message);

  const mg = getMailgun();
  const to_domain = to.split('@')[1];
  const params = {
    from: 'SW Price Drop Bot <' + from + '>',
    to: to,
    text: message
  };

  if (SMS_GATEWAYS.indexOf(to_domain) === -1) {
    params.subject = subject;
  }

  return new Promise(resolve => {
    mg.messages().send(params, function (error, body) {
      if (error) {
        console.log('Error: ' + error);
      } else {
        console.log(body);
      }
      resolve({
        error,
        body
      });
    });
  });
}

function getMailgun () {
  return new Mailgun({
    apiKey: MAILGUN_API_KEY,
    domain: MAILGUN_EMAIL.split('@')[1]
  });
}

module.exports = {
  enabled,
  sendEmail
};
