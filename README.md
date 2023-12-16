# TimeKeeper

The TimeKeeper API was created and published by Accidental DevOps LLC in 2022. It succeeds at attempting to resolve a single, simple problem: Getting payroll time information from employees to payroll controllers as simply and hands-off as possible.

## Front End Setup

TimeKeeper has a seperate front-end that can be found at [this repository](https://github.com/DaveLuhman/timekeeper-fe)
## Backend API Setup and Configuration

### API
1. Clone the repo [TimeKeeper-API](https://github.com/DaveLuhman/tk_api)
2. Rename ```.env_template``` to ```.env``` and enter your configuration details
3. Push your backend to your preferred hosting provider

### Environment Variable Reference

| Name                       | Default value      | Description                                                                 |
| -------------------------- | ------------------ | --------------------------------------------------------------------------- |
| NODE_ENVIRONMENT           | null               | Mostly determines what level of logging is output to stdout                 |
| PORT                       | 5555               | Sets the HTTP Listener Port for the express server                          |
| MONGO_URI                  | null               | Should you be using a MongoDB server to back up submissions, details go here|
| SG_API_KEY                 | null               | SendGrid API Key that's unique to this project                              |
| SG_SUBMISSION_TEMPLATE_ID  | null               | SendGrid dynamic template ID for sending timeEntry objects via email        |
| SG_TOKEN_TEMPLATE_ID       | null               | Sendgrid dynamic template ID for sending users their login token            |
| TO_EMAIL                   | dave@ado.software  | The primary target email address that your output should be sent to.        |
| FRONTEND_URL               | null               | The public facing URL for the front end form. Allows index route redirection|



### SendGrid
1. Create a SendGrid Account
2. Create an API Key (Settings>API Keys) and put it in your .env
3. Create a dynamic email template and put the template ID in your .env. See [my table example](./docs/sendgrid.example) with handlebars iterator.

## License

Closed Source, please reach out to sales@ado.software to discuss a license arrangement.