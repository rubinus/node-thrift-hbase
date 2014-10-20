/**
 * Created by rubinus on 14-10-20.
 */
'use strict';

var get = require('./get');
var thrift = require('thrift');
var HBase = require('../gen-nodejs/THBaseService');

var Client = function(options) {
    if (!options.host || !options.port) {
        callback(true,'host or port is none');
    }
    this.host = options.host || 'master';
    this.port = options.port || '9090';

    var connection = thrift.createConnection(this.host, this.port);
    this.connection = connection;

    this.suiji = new Date().getMilliseconds();

};

Client.create = function (options) {
    return new Client(options);
};

Client.prototype.getClient = function (callback) {
//    this._action('get', tableName, get, true, 0, callback);
    var that = this;
    this.connection.on('connect', function () {
        var client = thrift.createClient(HBase, that.connection);
        callback(null,client);
    });

    this.connection.on('error', function(err){
        console.log('getClient error', err);
        callback(true,err);
    });
};


Client.prototype.get = function (callback) {
//    this._action('get', tableName, get, true, 0, callback);
    this.getClient(function(err,client){
        if(!err){
            get(client,function(err,data){
                callback(err,data);
            });
        }else{
            callback(null);
        }

    });
};


module.exports = Client;