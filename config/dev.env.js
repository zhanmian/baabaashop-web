'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

let params = process.argv[4];
let baseUrl = '';
switch (params) {
  case '--env=test':
    baseUrl = '"http://localhost:8088/"';
    break;
  case '--env=prod':
    baseUrl = '"http://157.230.242.250:8088/"';
    break
}
module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BASE_API: baseUrl
});
