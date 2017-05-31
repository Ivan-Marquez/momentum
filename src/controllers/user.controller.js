const Hypermedia = require('../util/hypermedia/hypermedia.config')
const HttpStatus = require('http-status-codes')
const pagedResult = require('../util/pagination/paged-result')
const getPageValidations = require('../util/pagination/page-validations')
const config = require('../config/config')()

module.exports = userService => {
  let getAllUsers = (req, res, next) => {
    let page = parseInt(req.query.page || 0)
    let pageSize = parseInt(req.query.pageSize || config.PAGE_SIZE)

    getPageValidations(page, pageSize)

    userService.getAll(page, pageSize).then(users => {
      users = pagedResult(req, page, pageSize, users)
      res.status(HttpStatus.OK).json(new Hypermedia(req).setResponse(users, next))
    }).catch(next)
  }

  let getByUserEmail = (req, res, next) => {
    userService.getByEmail(req.params.userName).then(user => {
      if (!user) {
        let err = new Error('User not found.')
        err.status = HttpStatus.NOT_FOUND
        throw err
      }
      res.status(HttpStatus.OK).json(new Hypermedia(req).setResponse(user, next))
    }).catch(next)
  }

  return {
    getAllUsers,
    getByUserEmail
  }
}
