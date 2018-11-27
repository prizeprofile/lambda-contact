var AWS = require('aws-sdk')
AWS.config.update({ region: 'eu-west-1' })

/**
 * Validates the input.
 */
const validate = {
  all: fields => validate.name(fields.name) && validate.email(fields.email) && validate.message(fields.message),
  name: value => typeof value === 'string'
    && value.length < process.env.NAME_MAX_LENGTH && value.length > process.env.NAME_MIN_LENGTH,
  email: value => typeof value === 'string'
    && value.length < process.env.EMAIL_MAX_LENGTH && value.length > process.env.EMAIL_MIN_LENGTH,
  message: value => typeof value === 'string'
    && value.length < process.env.MESSAGE_MAX_LENGTH && value.length > process.env.MESSAGE_MIN_LENGTH
}

exports.handler = (event, _, callback) => {
  return Promise.resolve(event.body)
    .then(JSON.parse)
    .then((fields) => {
      // Validates the input.
      if (!validate.all(fields)) {
        throw { status: 422, error: 'UnprocessableEntity' }
      }

      return fields
    })
    .then(({ email, name, message }) => {
      // Prepares the email.
      const params = {
        Destination: {
          CcAddresses: process.env.CC_RECIPIENTS.split(','),
          ToAddresses: process.env.TO_RECIPIENTS.split(',')
        },
        Source: email,
        Template: 'CONTACT',
        TemplateData: `{
          \"email\":\"${email}\",
          \"name\":\"${name}\",
          \"message\":\"${message}\"
        }`,
        ReplyToAddresses: [ email ]
      }

      // Sends email and awaits the response.
      return new AWS.SES({ apiVersion: '2010-12-01' })
        .sendTemplatedEmail(params)
        .promise()
        .catch(() => ({
          status: 503,
          error: 'ServiceUnavailable'
        }))
    })
    .then(() => callback(null, {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin' : '*'
      }
    }))
    .catch(({ status, error }) => callback(null, {
      statusCode: status || 500,
      headers: {
        'Access-Control-Allow-Origin' : '*'
      },
      body: JSON.stringify({ status, error })
    }))
}
