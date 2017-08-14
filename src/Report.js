const CliTable = require('cli-table')
  , chalk = require('chalk');

class Report {

  constructor(dirRoot) {
    this._reports = [];
    this._dirRoot = dirRoot;
  }

  add(task, src, dest, success, list) {
    this._reports.push({
      task: {
        task: task,
        success: success
      },
      src: src,
      dest: dest,
      list: list && Array.isArray(list) ? list : [],
    });
  };

  draw() {

    if (this._reports.length < 1) {
      return;
    }

    let table = new CliTable({
      head: [
        "Task",
        "Source Files",
        "Destination",
        "Options",
      ]
    });

    this._reports.forEach((item) => {
      table.push([
        (item.task.success ? chalk.green(item.task.task) : chalk.red(item.task.task)),

        (Array.isArray(item.src) ? item.src.map((i) => {
          return i.replace(this._dirRoot, '');
        }).join("\n") : item.src.replace(this._dirRoot, '')),

        (Array.isArray(item.dest) ? item.dest.map((i) => {
          return i.replace(this._dirRoot, '');
        }).join("\n") : item.dest.replace(this._dirRoot, '')),

        item.list.join("\n")
      ])
    });

    console.log(table.toString());

    this._reports = [];
  };

}

module.exports = function(dirRoot) {
    return new Report(dirRoot);
};