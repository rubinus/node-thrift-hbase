var thrift = require('thrift');
var HBase = require('./gen-nodejs/THBaseService');
var HBaseTypes = require('./gen-nodejs/hbase_types');

var connection = thrift.createConnection('localhost', 9090, {
  transport: thrift.TFramedTransport,
  protocol: thrift.TBinaryProtocol
});

connection.on('connect', function() {
  var client = thrift.createClient(HBase,connection);
   console.log(client)
});

connection.on('error', function(err){
  console.log('error', err);
});