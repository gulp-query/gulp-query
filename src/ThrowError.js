const chalk = require('chalk');

class ThrowError {

  static make(message)
  {
    return new ThrowError(message);
  }

  constructor(message)
  {
    console.log(chalk.red(message));
    process.exit()
  }

}

module.exports = ThrowError;