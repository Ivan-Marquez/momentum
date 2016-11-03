const HttpStatus = require('http-status-codes')
let setHypermedia = require('../helpers/user-hypermedia')

let userController = userService => {
  let getAllUsers = (req, res, next) => {
    userService.getAll().then(result => {
      setHypermedia(req, res, result)
    }).catch(next)
  }

  let getByUserEmail = (req, res, next) => {
    userService.getByEmail(req.params.userName)
      .then(user => {
        if (!user) {
          let err = new Error('User not found.')
          err.status = HttpStatus.NOT_FOUND
          throw err
        }
        res.status(HttpStatus.OK).json(user)
      }).catch(next)
  }

  return {
    getAllUsers: getAllUsers,
    getByUserEmail: getByUserEmail
  }
}

module.exports = userController
