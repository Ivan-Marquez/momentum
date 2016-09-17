const HttpStatus = require('http-status-codes')

let userController = userService => {
  let getAllUsers = (req, res, next) => {
    userService.getAll().then(users => {
      return res.status(HttpStatus.OK).json(users)
    }).catch(err => {
      req.log.error(err)
      next(err)
    })
  }

  let getByUserEmail = (req, res, next) => {
    userService.getByEmail(req.params.userName)
        .then(user => res.status(HttpStatus.OK).json(user))
        .catch(err => {
          req.log.info(err)
          next(err)
        })
  }

  return {
    getAllUsers: getAllUsers,
    getByUserEmail: getByUserEmail
  }
}

module.exports = userController
