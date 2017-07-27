const Hypermedia = require('../util/hypermedia/hypermedia.config')
const HttpStatus = require('http-status-codes')
const emailFactory = require('../util/email.factory')

const emails = {
  resetPassword: require('../services/emails/reset-password'),
  confirmResetPassword: require('../services/emails/confirm-reset-password'),
  newAccount: require('../services/emails/new-account')
}

module.exports = (authService, userService, emailService) => {
  const auth = (req, res, next) =>
    userService.getByEmail(req.body.email)
      .then(user => {
        if (!user) {
          const err = new Error('Authentication failed. User not found.')
          err.status = HttpStatus.NOT_FOUND
          throw err
        }

        return user.isValidPassword(req.body.password)
          .then(isMatch => {
            if (isMatch) {
              user._doc.token = authService.getToken(user)
              user._doc.expiresIn = authService.setExpirationDate()
              return res.status(HttpStatus.OK).json(new Hypermedia(req).setResponse(user, next))
            } else {
              const err = new Error('Authentication failed. Wrong password.')
              err.status = HttpStatus.BAD_REQUEST
              throw err
            }
          })
      })
      .catch(next)

  const register = (req, res, next) =>
    userService.getByEmail(req.body.email)
      .then(existingUser => {
        if (existingUser) {
          const err = new Error('That email address is already registered.')
          err.status = HttpStatus.UNPROCESSABLE_ENTITY
          throw err
        }

        return userService.registerUser(req.body)
      })
      .then(user => {
        user._doc.token = authService.getToken(user)
        user._doc.expiresIn = authService.setExpirationDate()
        res.status(HttpStatus.CREATED).json(new Hypermedia(req).setResponse(user, next))

        const email = emails.newAccount(user, req.headers.host).getTemplate()
        const emailInfo = emailFactory(user.email, email.subject, email.html).getInfo()

        return emailService(emailInfo).send()
      })
      .catch(next)

  const resetPassword = (req, res, next) =>
    userService.getByEmail(req.body.email)
      .then(user => {
        if (!user) {
          const err = new Error('Your request could not be processed as entered. User does not exist.')
          err.status = HttpStatus.NOT_FOUND
          throw err
        }
        return authService.resetPasswordToken(user)
      })
      .then(user => {
        const host = req.headers.referer || `${req.protocol}://${req.headers.host}/`
        const email = emails.confirmResetPassword(host, user.resetPasswordToken).getTemplate()
        const emailInfo = emailFactory(user.email, email.subject, email.html).getInfo()

        return emailService(emailInfo).send()
      })
      .then(data => res.status(HttpStatus.OK).json({ data }))
      .catch(next)

  const newPassword = (req, res, next) =>
    authService.findByPasswordToken(req.body.token)
      .then(user => {
        if (!user) {
          const err = new Error('Invalid token. Please confirm this action through your email.')
          err.status = HttpStatus.UNPROCESSABLE_ENTITY
          throw err
        }
        return user.isValidPassword(req.body.currentPassword)
          .then(isMatch => {
            if (isMatch) {
              return user.confirmPasswordValid(req.body.password, req.body.confirmPassword)
            } else {
              const err = new Error('Invalid password. Please validate your current password.')
              err.status = HttpStatus.BAD_REQUEST
              throw err
            }
          })
          .then(isConfirmed => {
            if (isConfirmed) {
              user.password = req.body.confirmPassword
              user.resetPasswordToken = undefined
              user.resetPasswordExpires = undefined
              return userService.upsertUser(user)
            } else {
              const err = new Error('Invalid confirmation password. Please validate your new password.')
              err.status = HttpStatus.BAD_REQUEST
              throw err
            }
          })
      })
      .then(user => {
        const email = emails.resetPassword().getTemplate()
        const emailInfo = emailFactory(user.email, email.subject, email.html).getInfo()

        return emailService(emailInfo).send()
      })
      .then(data => res.status(HttpStatus.OK).json({ data }))
      .catch(next)

  return {
    auth,
    register,
    newPassword,
    resetPassword
  }
}
