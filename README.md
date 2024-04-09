## Project Structure

...

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Setup environment

### - Prerequisite:

- Install Docker v20.x
- Git config username, email. Config ssh to remote repository
- Pull source code to local computer: branch `dev/user`

### - Create database, cache, message queue with docker compose

```bash
# Run this command under project's directory
docker compose -f support/infra/docker-compose.yml up -d
```

## Installation

```bash
$ npm install
```

## Prepare env

- Create file .env at root folder
- Copy content of file .env.example to file .env

## Running the app

```bash
# development
$ npm start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Migration

```bash
# Auto generate migration script from entity schema
npm run migration:generate --name=<file_name>

# Create empty migration file
npm run migration:create --name=<file_name>

# Manually run migration scripts
npm run migration:run

# Revert latest changes
npm run migration:revert
```

## Run app with pm2

- Ref: https://pm2.keymetrics.io/docs/usage/application-declaration/
- Startup script for auto run application: https://pm2.keymetrics.io/docs/usage/startup/

```bash
pm2 startup
_...

pm2 save

```

- pm2 service running with name: pm2-ubuntu.service (pm2-<USER>)

- Precondition:
  - Install NodeJS
  - Install pm2 globally
    - npm i -g pm2
- Steps

```bash
npm install
pm2 start ecosystem.config.js
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
