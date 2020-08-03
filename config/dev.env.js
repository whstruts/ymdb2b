'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  // API_ROOT: '"https://app.ymdb2b.com/api/api-b2b-platform"',
  API_ROOT: '"http://192.168.3.103:8002/api-b2b-platform"',
  // API_ROOT: '" http://192.168.3.152/api/api-b2b-platform"',
  // API_ROOT: '"http://192.168.3.152/b2b"',
})
