'use strict'

const amqp = require('amqplib')

let should = require('should')
let cp = require('child_process')
let _channel = null
let _conn = null

let loggentriesLogger = null

describe('Logentries Logger', function () {
  before('init', () => {
    process.env.PORT = 8081
    process.env.INPUT_PIPE = 'demo.pipe.logger'
    process.env.BROKER = 'amqp://guest:guest@127.0.0.1/'
    process.env.CONFIG = '{"token": "fcda9739-b6c6-44b4-8114-8685e672500e", "logLevel":"debug"}'


    amqp.connect(process.env.BROKER)
      .then((conn) => {
        _conn = conn
        return conn.createChannel()
      }).then((channel) => {
        _channel = channel
      }).catch((err) => {
        console.log(err)
      })
  })

  after('terminate child process', function (done) {
    this.timeout(8000)

    setTimeout(function () {
      loggentriesLogger.kill('SIGKILL')
      done()
    }, 5000)
  })

  describe('#spawn', function () {
    it('should spawn a child process', function () {
      should.ok(loggentriesLogger = cp.fork(process.cwd()), 'Child process not spawned.')
    })
  })

  describe('#logJSON', function () {
    it('should process JSON log data', function (done) {
      let dummyData = {foo: 'bar20'}
      // console.log(_channel)
      _channel.sendToQueue('demo.pipe.logger', new Buffer(JSON.stringify(dummyData)))
      done()
    })
  })
})
