const mongoose = require('mongoose')
const Schema = mongoose.Schema
const mongoDB = require('../config/mongoose.collections.json')

const logsSchema = new Schema({
  code: {type: String, default: null, index: 1},
  status: {type: String, index: 2},
  message: {type: String},
  stack: {type: String},
  createdOn: {type: Date, default: Date.now}
}, {
  collection: mongoDB.Collection.Log,
  capped: { size: 5242880, max: 5000, autoIndexId: true } // 5 Megas
})

logsSchema.virtual('getError').get(function () {
  return `${this.code} - ${this.status} - ${this.message}`
})

logsSchema.set('toJSON', {
  getters: true,
  virtuals: true
})

mongoose.model(mongoDB.Model.Log, logsSchema)