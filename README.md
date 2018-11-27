# AWS Lambda: Contact

Sends an email to env configurable recepients via SES.

## Enviroment variables
* `NAME_MIN_LENGTH` is a number.
* `NAME_MAX_LENGTH` is a number.
* `EMAIL_MAX_LENGTH` is a number.
* `EMAIL_MIN_LENGTH` is a number.
* `MESSAGE_MAX_LENGTH` is a number.
* `MESSAGE_MIN_LENGTH` is a number.
* `CC_RECIPIENTS` is a comma separated list of email addresses.
* `TO_RECIPIENTS` is a comma separated list of email addresses.
* `SOURCE_EMAIL` is the email under which the message is resent.

## Request

[_POST_] Event body has to be a valid JSON object with following properties:

* `name`
* `email`
* `message`

## Responses

### 200

###  422
One or more parameters were missing.

### 503
The SES service failed.

## Deployment
Deploy with `npm run deploy:{env}`.
