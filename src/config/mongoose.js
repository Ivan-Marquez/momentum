const config = require('./config')
const mongoose = require('mongoose')
const logger = require('./logger')

module.exports = () => {
  // TODO: Fix hardcode
  mongoose.set('debug', (coll, method, query, doc, options) => {
    let set = {
      coll: coll,
      method: method,
      query: query,
      doc: doc,
      options: options
    }

    logger.info({
      dbQuery: set
    })
  })

  // TODO: Add new events like 'online' 'offline', 'shutdown' logs
  mongoose.connection.on('error', err => logger.error(err))

  require('../models/user.server.model')
  require('../models/schedule.server.model')
  require('../models/workshift.server.model')
  require('../models/location.server.model')
  require('../models/service.server.model')
  require('../models/logs.server.model')

  return mongoose.connect(config.DB_URL)
}
