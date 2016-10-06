const mongoose = require('mongoose')
mongoose.Promise = require('bluebird')

const userSchema = require('../models/user.server.model').userSchema
const User = mongoose.model('User', userSchema)
const _ = require('underscore')

let userService = () => {
  let getAll = () => {
    return User.find().exec()
  }

  let getByEmail = email => {
    return User.findOne().where('email', email).exec()
  }

  let getById = id => {
    return User.findOne({_id: id}).exec()
  }

  let registerUser = user => {
    return User.create(_.extend(user, User))
  }

  return {
    getAll: getAll,
    getById: getById,
    getByEmail: getByEmail,
    registerUser: registerUser
  }
}

module.exports = userService
