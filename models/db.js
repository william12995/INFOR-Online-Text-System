var settings = require('../setting.js');
var Db = require('mongodb').Db ;
var Connection = require('mongodb').Connection ;
var server = require('mongodb').Server ;

module.exports = new Db(settings.db , new server(settings.host , settings.port) , {safe :true});
