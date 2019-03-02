'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

let params = process.argv[2];
let baseUrl = '';
switch (params) {
  case 'test':
    baseUrl = '"http://localhost:8088"';
    break;
  case 'prod':
    baseUrl = '"http://157.230.242.250:8088"';
    break
}
module.exports = merge(prodEnv, {
  NODE_ENV: '"production"',
  BASE_API: baseUrl
});
