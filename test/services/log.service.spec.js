describe('Log service tests', () => {
  let Log = require('../../src/models/logs.server.model')
  let logService = require('../../src/services/log.service')()

  const ERROR_CODE = '404'
  const STATUS = 'Status Desc'
  const MESSAGE = 'Error Message'

  describe('Given a request to Log resource', () => {
    context('when requesting a log by code', () => {
      it('will return log(s) by specified code', sinon.test(function (done) {
        let log = new Log({
          code: ERROR_CODE,
          status: STATUS,
          Messages: MESSAGE
        })

        let find = {
          where () {
            return this
          },
          exec () {
            return Promise.resolve(log)
          }
        }

        this.stub(Log, 'find').returns(find)

        logService.getByCode(ERROR_CODE).then(result => {
          assert.notEqual(result, null)
          expect(result.code).to.be.equal(ERROR_CODE)
          done()
        }).catch(err => done(err))
      }))
    })

    context('when requesting a log by status', () => {
      it('will return log(s) by specified status', sinon.test(function (done) {
        let log = new Log({
          code: ERROR_CODE,
          status: STATUS,
          Messages: MESSAGE
        })

        let find = {
          where () {
            return this
          },
          exec () {
            return Promise.resolve(log)
          }
        }

        this.stub(Log, 'find').returns(find)

        logService.getByStatus(STATUS).then(result => {
          assert.notEqual(result, null)
          expect(result.status).to.be.equal(STATUS)
          done()
        }).catch(err => done(err))
      }))
    })

    context('when requesting all logs', () => {
      it('will return a list of all logs', sinon.test(function (done) {
        let logs = [new Log(), new Log({code: '500'})]

        let find = {
          sort () {
            return this
          },
          exec () {
            return Promise.resolve(logs)
          }
        }

        this.stub(Log, 'find').returns(find)

        logService.getAll().then(result => {
          assert.notEqual(result, null)
          expect(result).to.be.an('Array')
          assert.equal(result.length, 2)
          expect(result[1].code).to.be.equal('500')
          done()
        }).catch(err => done(err))
      }))
    })

    context('when requesting to insert / update a log', () => {
      it('will save and return the log object', sinon.test(function (done) {
        let log = new Log({code: '500'})
        this.stub(log, 'save').resolves(log)

        logService.saveLog(log).then(result => {
          expect(result).to.have.property('code', '500')
          expect(log.save.calledOnce).to.equal(true)
          done()
        }).catch(err => done(err))
      }))
    })
  })
})
