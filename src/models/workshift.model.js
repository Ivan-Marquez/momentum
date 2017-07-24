const mongoDB = require('../config/mongoose.collections.json')

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const workshiftSchema = new Schema({
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
  userId: {
    type: Schema.ObjectId,
    ref: mongoDB.Model.User,
    required: true,
    index: true
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
  collection: mongoDB.Collection.Workshift
})

workshiftSchema.virtual('show').get(function () {
  return `${this.startDate} - ${this.endDate}`
})

workshiftSchema.set('toJSON', {
  getters: true,
  virtuals: true,
  transform: (doc, ret) => {
    delete ret.id
    return ret
  }
})

module.exports = mongoose.model(mongoDB.Model.Workshift, workshiftSchema)
