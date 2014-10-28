/**
 * Created by rubinus on 14-10-20.
 */
'use strict';

var _ = require('underscore');
var Int64 = require('node-int64');

var Get = require('./get');
var Put = require('./put');
var Del = require('./del');
var Inc = require('./inc');
var Scan = require('./scan');
var thrift = require('thrift');
var HBase = require('../gen-nodejs/THBaseService');
var HBaseTypes = require('../gen-nodejs/hbase_types');


var Client = function(options) {
    if (!options.host || !options.port) {
        callback(true,'host or port is none');
    }
    this.host = options.host || 'master';
    this.port = options.port || '9090';

    var connection = thrift.createConnection(this.host, this.port);
    this.connection = connection;
};

Client.create = function (options) {
    return new Client(options);
};

Client.prototype.getClient = function (callback) {
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

Client.prototype.Get = function(row){
    return new Get(row);
};

Client.prototype.Put = function(row){
    return new Put(row);
};

Client.prototype.Del = function(row){
    return new Del(row);
};

Client.prototype.Inc = function(row){
    return new Inc(row);
};

Client.prototype.Scan = function(){
    return new Scan();
};

Client.prototype.scan = function (table,param,callback) {
    var startRow = param.startRow;
    var stopRow = param.stopRow;
    var numRows = param.numRows;
    if(!startRow){
        callback(null,'rowKey is null');
    }
    var query = {};
    var maxVersions = param.maxVersions;
    query.startRow = startRow;
    query.stopRow = stopRow;
    var columns = [];
    if(param.familyList && param.familyList.length > 0){
        _.each(param.familyList,function(ele,idx){
            columns.push(new HBaseTypes.TColumn(ele));
        });
        query.columns = columns;
    }

//    console.log(query);

    var that = this;
    that.getClient(function(err,client){
        if(!err){

            var tScan = new HBaseTypes.TScan(query);
            tScan.maxVersions = maxVersions;

            client.openScanner(table, tScan, function (err, scannerId) {

                if (err) {
                    callback(err.message.slice(0,120));
                    return;
                } else {
                    client.getScannerRows(scannerId, numRows, function (serr, data) {
                        if (serr) {
                            callback(err.message.slice(0,120));
                            return;
                        }else{
                            callback(null,data);
                        }
                    });
                    client.closeScanner(scannerId, function (err) {
                        if (err) {
                            console.log(err);
                        }
                    });
                }

                //close connection for hbase client
                that.connection.end();
            });

        }else{
            callback(null);
        }

    });
};

Client.prototype.scanRow = function (table,startRow,stopRow,columns,numRows,callback) {
    var args = arguments;
    var query = {};
    var numRows = 10;
    if(args.length <=0){
        console.log('arguments arg short of 4');
        return;
    }
    var callback = args[args.length-1];
    if(callback && typeof callback != 'function'){
        console.log('callback is not a function');
        return;
    }
    if(args.length < 4){
        callback(null,'arguments arg short of 4');
        return;
    }
    if(args.length === 4){
        columns = [];
    }
    if(args.length > 5){
        if(Object.prototype.toString.call(args[3]) != '[object Array]'){
            callback(null,'family and qualifier must be an Array,example ["info:name"]');
            return;
        }
    }
    if(args.length >= 5){
        numRows = numRows;
        if(typeof args[args.length-2] !== 'number'){
            numRows = Number(args[args.length-2]);
        }
    }



    query.startRow = startRow;
    query.stopRow = stopRow;

    var qcolumns = [];
    if(columns && columns.length > 0){
        var cols = [],temp = {};
        _.each(columns,function(ele,idx){
            if(ele.indexOf(':') != -1){
                cols = ele.split(':');
                temp = {
                    family: cols[0],
                    qualifier: cols[1]
                }
            }else{
                temp = {
                    family: ele
                }
            }
            qcolumns.push(new HBaseTypes.TColumn(temp));
        });
        query.columns = qcolumns;
    }

//    console.log(query);

    var that = this;
    that.getClient(function(err,client){
        if(!err){

            var tScan = new HBaseTypes.TScan(query);

            client.openScanner(table, tScan, function (err, scannerId) {

                if (err) {
                    callback(err.message.slice(0,120));
                    return;
                } else {
                    client.getScannerRows(scannerId, numRows, function (serr, data) {
                        if (serr) {
                            callback(err.message.slice(0,120));
                            return;
                        }else{
                            callback(null,data);
                        }
                    });
                    client.closeScanner(scannerId, function (err) {
                        if (err) {
                            console.log(err);
                        }
                    });
                }

                //close connection for hbase client
                that.connection.end();
            });

        }else{
            callback(null);
        }

    });

};

Client.prototype.get = function (table,param,callback) {
    var row = param.row;
    if(!row){
        callback(null,'rowKey is null');
    }
    var query = {};
    var maxVersions = param.maxVersions;
    query.row = row;
    var columns = [];
    if(param.familyList && param.familyList.length > 0){
        _.each(param.familyList,function(ele,idx){
            columns.push(new HBaseTypes.TColumn(ele));
        });
        query.columns = columns;
    }

//    console.log(query);

    var that = this;
    that.getClient(function(err,client){
        if(!err){

            var tGet = new HBaseTypes.TGet(query);
            tGet.maxVersions = maxVersions;

            client.get(table, tGet, function (err, data) {

                if (err) {
                    callback(err.message.slice(0,120));
                } else {
                    callback(null,data);
                }
                //close connection for hbase client
                that.connection.end();
            });

        }else{
            callback(null);
        }

    });
};

Client.prototype.getRow = function (table,row,columns,versions,callback) {
    var args = arguments;
    var query = {};
    var maxVersions = 1;

    if(args.length <=0){
        console.log('arguments arg short of 3');
        return;
    }
    var callback = args[args.length-1];
    if(callback && typeof callback != 'function'){
        console.log('callback is not a function');
        return;
    }
    if(args.length < 3){
        callback(null,'arguments arg short of 3');
        return;
    }
    if(args.length === 3){
        columns = [];
        maxVersions = 1;
    }
    if(args.length > 3){
        if(Object.prototype.toString.call(args[2]) != '[object Array]'){
            callback(null,'family and qualifier must be an Array,example ["info:name"]');
            return;
        }
        maxVersions = versions;
        if(typeof args[args.length-2] !== 'number'){
            maxVersions = Number(args[args.length-2]);
        }
    }



    query.row = row;
    var qcolumns = [];
    if(columns && columns.length > 0){
        var cols = [],temp = {};
        _.each(columns,function(ele,idx){
            if(ele.indexOf(':') != -1){
                cols = ele.split(':');
                temp = {
                    family: cols[0],
                    qualifier: cols[1]
                }
            }else{
                temp = {
                    family: ele
                }
            }
            qcolumns.push(new HBaseTypes.TColumn(temp));
        });
        query.columns = qcolumns;
    }

//    console.log(maxVersions,query);

    var that = this;
    that.getClient(function(err,client){
        if(!err){

            var tGet = new HBaseTypes.TGet(query);
            tGet.maxVersions = maxVersions;

            client.get(table, tGet, function (err, data) {

                if (err) {
                    callback(err.message.slice(0,120));
                } else {
                    callback(null,data);
                }
                //close connection for hbase client
                that.connection.end();
            });

        }else{
            callback(null);
        }

    });

};

Client.prototype.put = function (table,param,callback) {
    var row = param.row;
    if(!row){
        callback(null,'rowKey is null');
    }
    var query = {};

    query.row = row;
    var qcolumns = [];
    if(param.familyList && param.familyList.length > 0){
        _.each(param.familyList,function(ele,idx){
            qcolumns.push(new HBaseTypes.TColumnValue(ele));
        });
        query.columnValues = qcolumns;
    }

//    console.log(query,'--------');

    var that = this;
    that.getClient(function(err,client){
        if(!err){

            var tPut = new HBaseTypes.TPut(query);

            client.put(table, tPut, function (err) {

                if (err) {
                    callback(err.message.slice(0,120));
                } else {
                    callback(null);
                }
                //close connection for hbase client
                that.connection.end();
            });

        }else{
            callback(null);
        }

    });

};

Client.prototype.putRow = function (table,row,columns,value,timestamp,callback) {
    var args = arguments;
    var query = {};

    if(args.length <=0){
        console.log('arguments arg short of 5');
        return;
    }
    var callback = args[args.length-1];
    if(callback && typeof callback != 'function'){
        console.log('callback is not a function');
        return;
    }
    if(args.length < 5){
        callback('arguments arg short of 5');
        return;
    }

    if(args.length >= 5){
        if(args[2].indexOf(':') == -1){
            callback('family and qualifier must have it,example ["info:name"]');
            return;
        }
    }


    query.row = row;
    var qcolumns = [];
    if(columns){
        var cols = [],temp = {};
        cols = columns.split(':');
        temp = {
            family: cols[0],
            qualifier: cols[1],
            value: value
        };
        if(timestamp){
            temp.timestamp = new Int64(timestamp);
        }
        qcolumns.push(new HBaseTypes.TColumnValue(temp));
        query.columnValues = qcolumns;
    }

    console.log(query);

    var that = this;
    that.getClient(function(err,client){
        if(!err){

            var tPut = new HBaseTypes.TPut(query);

            client.put(table, tPut, function (err) {

                if (err) {
                    callback(err.message.slice(0,120));
                } else {
                    callback(null);
                }
                //close connection for hbase client
                that.connection.end();
            });

        }else{
            callback(null);
        }

    });

};

Client.prototype.del = function (table,param,callback) {
    var row = param.row;
    if(!row){
        callback(null,'rowKey is null');
    }
    var query = {};

    query.row = row;
    var qcolumns = [];
    if(param.familyList && param.familyList.length > 0){
        _.each(param.familyList,function(ele,idx){
            qcolumns.push(new HBaseTypes.TColumn(ele));
        });
        query.columns = qcolumns;
    }

//    console.log(query,'--------');

    var that = this;
    that.getClient(function(err,client){
        if(!err){

            var tDelete = new HBaseTypes.TDelete(query);

            client.deleteSingle(table, tDelete, function (err) {

                if (err) {
                    callback(err.message.slice(0,120));
                } else {
                    callback(null);
                }
                //close connection for hbase client
                that.connection.end();
            });

        }else{
            callback(null);
        }

    });

};

Client.prototype.delRow = function (table,row,columns,timestamp,callback) {
    var args = arguments;
    var query = {};

    if(args.length <=0){
        console.log('arguments arg short of 3');
        return;
    }
    var callback = args[args.length-1];
    if(callback && typeof callback != 'function'){
        console.log('callback is not a function');
        return;
    }
    if(args.length < 3){
        callback('arguments arg short of 3');
        return;
    }

    if(args.length === 5){
        if(args[2].indexOf(':') == -1){
            callback('family and qualifier must have it,example ["info:name"]');
            return;
        }
    }


    query.row = row;
    var qcolumns = [];
    if(args.length >= 4 && columns){
        var cols = [],temp = {};
        if(columns.indexOf(':') != -1){
            cols = columns.split(':');
            temp = {
                family: cols[0],
                qualifier: cols[1]
            };
            if(args.length === 5){
                temp.timestamp = timestamp;
            }
        }else{
            temp = {
                family: columns
            }
        }

        qcolumns.push(new HBaseTypes.TColumn(temp));
        query.columns = qcolumns;
    }

//    console.log(query);

    var that = this;
    that.getClient(function(err,client){
        if(!err){

            var tDelete = new HBaseTypes.TDelete(query);

            client.deleteSingle(table, tDelete, function (err,data) {

                if (err) {
                    callback(err.message.slice(0,120));
                } else {
                    callback(null,data);
                }
                //close connection for hbase client
                that.connection.end();
            });

        }else{
            callback(null);
        }

    });

};

Client.prototype.inc = function (table,param,callback) {
    var row = param.row;
    if(!row){
        callback(null,'rowKey is null');
    }
    var query = {};

    query.row = row;
    var qcolumns = [];
    if(param.familyList && param.familyList.length > 0){
        _.each(param.familyList,function(ele,idx){
            qcolumns.push(new HBaseTypes.TColumn(ele));
        });
        query.columns = qcolumns;
    }

//    console.log(query,'--------');

    var that = this;
    that.getClient(function(err,client){
        if(!err){

            var tIncrement = new HBaseTypes.TIncrement(query);

            client.increment(table, tIncrement, function (err,data) {

                if (err) {
                    callback(err.message.slice(0,120));
                } else {
                    callback(null,data);
                }
                //close connection for hbase client
                that.connection.end();
            });

        }else{
            callback(null);
        }

    });

};

Client.prototype.incRow = function (table,row,columns,callback) {
    var args = arguments;
    var query = {};

    if(args.length <=0){
        console.log('arguments arg short of 3');
        return;
    }
    var callback = args[args.length-1];
    if(callback && typeof callback != 'function'){
        console.log('callback is not a function');
        return;
    }
    if(args.length < 3){
        callback('arguments arg short of 3');
        return;
    }

    if(args.length >= 3){
        if(args[2].indexOf(':') == -1){
            callback('family and qualifier must have it,example ["info:counter"]');
            return;
        }
    }


    query.row = row;
    var qcolumns = [];
    if(columns){
        var cols = [],temp = {};
        cols = columns.split(':');
        temp = {
            family: cols[0],
            qualifier: cols[1]
        };
        qcolumns.push(new HBaseTypes.TColumn(temp));
        query.columns = qcolumns;
    }

//    console.log(query);

    var that = this;
    that.getClient(function(err,client){
        if(!err){

            var tIncrement = new HBaseTypes.TIncrement(query);

            client.increment(table, tIncrement, function (err,data) {

                if (err) {
                    callback(err.message.slice(0,120));
                } else {
                    callback(null,data);
                }
                //close connection for hbase client
                that.connection.end();
            });

        }else{
            callback(null);
        }

    });

};

module.exports = Client;