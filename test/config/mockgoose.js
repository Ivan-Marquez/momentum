process.env.NODE_ENV = 'development'

const mongoose = require('mongoose')
const mockgoose = require('mockgoose')
const config = require('../../src/config/config')

module.exports = () => {
  require('../../src/models/user.server.model.js')
  require('../../src/models/schedule.server.model')
  require('../../src/models/workshift.server.model')
  require('../../src/models/location.server.model')
  require('../../src/models/service.server.model')
  require('../../src/models/logs.server.model')

  let connect = () => {
    return mockgoose(mongoose).then(() => {
      mongoose.connect(config.DB_URL)
    })
  }

  let reset = () => {
    return mockgoose.reset()
  }

  return {
    connect: connect,
    reset: reset
  }
}