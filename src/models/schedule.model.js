const mongoose = require('mongoose')
const Schema = mongoose.Schema
const mongoDB = require('../config/mongoose.collections.json')
const types = require('./schedule-types.enum')

const scheduleSchema = new Schema({
  startDate: {
    type: Date,
    required: true,
    index: true
  },
  endDate: {
    type: Date,
    required: true,
    index: true
  },
  other: {
    type: String
  },
  userId: {
    type: Schema.ObjectId,
    ref: mongoDB.Model.User,
    required: true,
    index: true
  },
  scheduleType: {
    type: String,
    enum: types,
    index: true
  },
  serviceId: {
    type: Schema.ObjectId,
    ref: mongoDB.Model.Service,
    required: true,
    index: true
  },
  workshiftId: {
    type: Schema.ObjectId,
    ref: mongoDB.Model.Workshift,
    required: true,
    index: true
  },
  locationId: {
    type: Schema.ObjectId,
    ref: mongoDB.Model.Location,
    required: true
  },
  createdBy: {
    type: Schema.ObjectId,
    ref: mongoDB.Model.User,
    required: true
  },
  createdOn: {
    type: Date,
    default: Date.now
  }
}, {
  collection: mongoDB.Collection.Schedule
})

scheduleSchema.virtual('show').get(function () {
  return `${this.service}: ${this.startDate} - ${this.endDate}`
})

scheduleSchema.set('toJSON', {
  getters: true,
  virtuals: true,
  transform: (doc, ret) => {
    delete ret.id
    return ret
  }
})

module.exports = mongoose.model(mongoDB.Model.Schedule, scheduleSchema)
