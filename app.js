'use strict'

let reekoh = require('reekoh')
let domain = require('domain')
let _plugin = new reekoh.plugins.Logger()
let loggentriesLogger = null
let level = null

_plugin.on('log', (logData) => {
  let d = domain.create()

  d.once('error', (error) => {
    console.log(error)
    loggentriesLogger.log(level, logData)
    d.exit()
  })

  d.run(() => {
    let logLevel = level

    if (logData.level) {
      logLevel = logData.level
      delete logData.level
    }

    loggentriesLogger.log(logLevel, logData)
    console.log('--d.run--', logLevel, logData)
    d.exit()
  })
})

_plugin.once('ready', () => {
  let Logger = require('le_node')

  level = _plugin.config.logLevel || 'info'

  loggentriesLogger = new Logger({
    token: _plugin.config.token
  })


  loggentriesLogger.on('error', (error) => {
    console.error('Error on Logentries.', error)
    _plugin.logException(error)
  })

  _plugin.log('Logentries has been initialized.')
  process.send({ type: 'ready' })
})
