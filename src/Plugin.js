class Plugin {

  /**
   *
   * @param {GulpQuery} GulpQuery
   * @param configs
   */
  constructor(GulpQuery, configs)
  {
    /**
     * @type {GulpQuery}
     * @private
     */
    this._GulpQuery = GulpQuery;

    this._initialConfigs = configs;

    this._taskToConfig = {};
  }

  _initConfigs()
  {
    let i = 1;
    this._initialConfigs.forEach((config) => {

      if (config.length > 1) {
        config = {
          from: config[0],
          to: config[1],
          name: config[2] ? config[2] : null
        }
      }

      //let taskName =
      if (config.name) {

      }

      ++i;
    });
  }



  getAllTasks()
  {

  }

  runTask(task_name, callback)
  {

  }
}

Plugin.method = 'abstract';