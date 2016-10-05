const HttpStatus = require('http-status-codes')

let userController = userService => {
  let getAllUsers = (req, res, next) => {
    userService.getAll().then(users => {
      return res.status(HttpStatus.OK).json(users)
    }).catch(next)
  }

  //TODO: Validate if user is not found!
  let getByUserEmail = (req, res, next) => {
    userService.getByEmail(req.params.userName)
        .then(user => res.status(HttpStatus.OK).json(user))
        .catch(next)
  }

  return {
    getAllUsers: getAllUsers,
    getByUserEmail: getByUserEmail
  }
}

module.exports = userController
