const config = require('../../src/config/config')
const mongoose = require('mongoose')
mongoose.Promise = require('bluebird')

describe('User authentication service test', () => {

  let User = require('../../src/models/user.server.model.js')
  let authService = require('../../src/services/auth.service.js')()

  describe('Given a user requesting to reset password with a valid email', () => {
    let mock = sinon.mock(new User({
      email: 'test@dev.com',
      password: 'Qwerty123'
    }))

    let user = mock.object
    mock.expects('save').resolves(user)

    it('will create a new reset-password token', sinon.test(done => {
      authService.resetToken(user).then(user => {
        assert.notEqual(user.resetPasswordToken, null)
        done()
      }).catch(err => console.error(err))
    }))
  })

  describe('Given a user resetting his/her password by providing a valid reset password token', () => {
    let token = 'A1244'
    let mock = sinon.mock(User)
    let user = new User({
      resetPasswordToken: token,
      resetPasswordExpires: new Date().getDate() + 1
    })

    it('will return a user by specified token', sinon.test(done => {
      mock.expects('findOne').withArgs({
        resetPasswordToken: token,
        resetPasswordExpires: {
          $gt: new Date()
        }
      }).chain('exec').resolves(user)

      authService.resetUserPassword(token).then(user => {
        assert.notEqual(user, null)
        assert.equal(user.resetPasswordToken, token)
        done()
      }).catch(err => console.error(err))
    }))
  })
})
