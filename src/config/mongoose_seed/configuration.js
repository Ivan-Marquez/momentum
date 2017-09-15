const seeder = require('mongoose-seed')
const _ = require('lodash')

const mongoDB = require('../../config/mongoose.collections.json')
const userData = require('../mongoose_seed/user.seed')
const logData = require('../mongoose_seed/log.seed')
const applicationTypeData = require('../mongoose_seed/application-type.seed')
const locationData = require('../mongoose_seed/location.seed')
const serviceData = require('../mongoose_seed/service.seed')
const scheduleData = require('../mongoose_seed/schedule.seed')
const workshiftData = require('../mongoose_seed/workshift.seed')

const mainData = _.concat(userData, logData, applicationTypeData, locationData, serviceData, scheduleData, workshiftData)
const config = require('../config')

// Connect to MongoDB via Mongoose
seeder.connect(config.DB_URL, () => {
    // Load Mongoose models
  seeder.loadModels([
    './src/models/user.model',
    './src/models/logs.model',
    './src/models/application-type.model',
    './src/models/location.model',
    './src/models/service.model',
    './src/models/schedule.model',
    './src/models/workshift.model'
  ])

    // Clear specified collections
  seeder.clearModels(
    [mongoDB.Model.User,
      // mongoDB.Model.Log,   ---- Commented because cannot remove from a capped collection: momentum.m_log
      mongoDB.Model.ApplicationType, mongoDB.Model.Location, mongoDB.Model.Service, mongoDB.Model.Schedule, mongoDB.Model.Workshift],
    () => {
      // Callback to populate DB once collections have been cleared
      seeder.populateModels(mainData)
    })
})
