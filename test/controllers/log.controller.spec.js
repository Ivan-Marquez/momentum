const HttpStatus = require('http-status-codes')
const httpMocks = require('node-mocks-http')

describe('Log entity requests', () => {
  let Log = require('../../src/models/logs.server.model')
  let logController = require('../../src/controllers/log.controller')
  let logService, req, res

  beforeEach(() => {
    req = httpMocks.createRequest()
    res = httpMocks.createResponse({
      eventEmitter: require('events').EventEmitter
    })
    logService = require('../../src/services/log.service')
  })

  describe('Given a request to Log resource', () => {
    context('when requesting to retrieve all logs with valid arguments', () => {
      it('returns Ok (200) with json array containing all logs in database', sinon.test(function (done) {
        let result = [2, [new Log({code: '200'}), new Log({code: '201'})]]
        let next = err => done(err)
        req.params.page = 1

        logService = this.stub(logService())
        logService.getAll.resolves(result)

        logController(logService).getAllLogs(req, res, next)

        res.on('end', function () {
          let response = JSON.parse(res._getData())
          assert.isTrue(res._isJSON())
          assert.isTrue(logService.getAll.calledOnce)
          expect(response.data.length).to.equal(2)
          expect(response.data[0].code).to.equal(result[1][0].code)
          expect(response.data[1].code).to.equal(result[1][1].code)
          done()
        })
      }))
    })

    context('when requesting to retrieve all logs sending a non-numeric page', () => {
      it('returns Internal Server Error', sinon.test(function (done) {
        req.params.page = 'Invalid'
        let errMessage = 'Wrong pagination sent as argument'
        let err = new Error(errMessage)
        err.status = HttpStatus.INTERNAL_SERVER_ERROR

        logService = this.stub(logService())
        logService.getAll.rejects(err)

        logController(logService).getAllLogs(req, res, next)

        function next (args) {
          expect(args).to.be.a('Error')
          assert.isTrue(logService.getAll.calledOnce)
          expect(args.status).to.equal(HttpStatus.INTERNAL_SERVER_ERROR)
          expect(args.message).to.contains('pagination')
          done()
        }
      }))
    })

    context('when requesting to get a log by code', () => {
      it('returns Ok (200) with json array containing all logs for that particular code', sinon.test(function (done) {
        let codeStr = '200'
        req.params.code = codeStr
        let log = new Log({code: codeStr})
        let next = (err) => done(err)

        logService = this.stub(logService())
        logService.getByCode.resolves(log)

        logController(logService).getByCode(req, res, next)

        res.on('end', function () {
          let data = JSON.parse(res._getData())
          assert.isTrue(res._isJSON())
          assert.isTrue(logService.getByCode.calledOnce)
          expect(data.code).to.equal(codeStr)
          done()
        })
      }))

      it('returns Internal Server Error (500) with error object', sinon.test(function (done) {
        let errMessage = 'Internal Error Message'
        let err = new Error(errMessage)
        err.status = HttpStatus.INTERNAL_SERVER_ERROR

        logService = this.stub(logService())
        logService.getByCode.rejects(err)

        logController(logService).getByCode(req, res, next)

        function next (args) {
          try {
            expect(args).to.be.a('Error')
            expect(args.status).to.equal(HttpStatus.INTERNAL_SERVER_ERROR)
            expect(args.message).to.equal(errMessage)
            done()
          } catch (err) {
            done(err)
          }
        }
      }))
    })

    context('when requesting to get a log by status', () => {
      it('returns Ok (200) with json array containing all logs for that particular status', sinon.test(function (done) {
        let codeStr = 'success'
        req.params.status = codeStr
        let log = new Log({status: codeStr})
        let next = (err) => done(err)

        logService = this.stub(logService())
        logService.getByStatus.resolves(log)

        logController(logService).getByStatus(req, res, next)

        res.on('end', function () {
          let data = JSON.parse(res._getData())
          assert.isTrue(res._isJSON())
          assert.isTrue(logService.getByStatus.calledOnce)
          expect(data.status).to.equal(codeStr)
          done()
        })
      }))

      it('returns Internal Server Error (500) with error object', sinon.test(function (done) {
        let errMessage = 'Internal Error Message'
        let err = new Error(errMessage)
        err.status = HttpStatus.INTERNAL_SERVER_ERROR

        logService = this.stub(logService())
        logService.getByStatus.rejects(err)

        logController(logService).getByStatus(req, res, next)

        function next (args) {
          try {
            expect(args).to.be.a('Error')
            expect(args.status).to.equal(HttpStatus.INTERNAL_SERVER_ERROR)
            assert.isTrue(logService.getByStatus.calledOnce)
            expect(args.message).to.equal(errMessage)
            done()
          } catch (err) {
            done(err)
          }
        }
      }))
    })
  })
})
