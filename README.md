# Rotavator

Simple MEAN application exposing a REST API for messages and determining whether they are palindromes.

The [MEAN stack](http://mean.io/) was chosen because of:
* Ability to do fast prototyping
* Being a good platform for I/O-bound applications
* Vast user community

It isn't a good platform for computationally intensive ones though.

[Elixir](http://elixir-lang.org/) is another great option for message based systems, but has a steeper learning curve.

This app was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.0.0-rc.2.

Messages are stored in a Mongo database. Node.JS and Express acts as the server. Angular 2 serves the UI.

The REST API enables the user to get all messages, get a specific message, post a message, and delete a message.

## Configuration

Config files...

### Database

This app requires a Mongo database, or actually two: one for development, one for testing. The same database can theoretically be used for both development and testing,
but that is discouraged.

Specify the development database via the environment variable `MONGODB_URI`.

Specify the testing database via the environment variable `MONGODB_TEST_URI`.

There are several free options for running a Mongo database:
* Host it [locally](https://docs.mongodb.com/manual/installation/)
* Use a free plan at [mLab](https://mlab.com/)
* Use a free plan at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/pricing)

## Build

Run `npm install` to build the project. The build artifacts will be stored in the `dist/` directory. Navigate to `http://localhost:8080/`.

### API documentation

Generate API documentation by running the command `npm run apidoc`. Help will be generated in the `dist/apidoc` directory, and will be available on `http://localhost:8080/apidoc`.

## Running functional tests

Run `npm test` to execute functional tests via [Mocha](https://mochajs.org/).

## License

MIT