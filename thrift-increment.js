var thrift = require('thrift');
var HBase = require('./gen-nodejs/THBaseService');
var HBaseTypes = require('./gen-nodejs/hbase_types');

var connection = thrift.createConnection('localhost', 9090, {
  transport: thrift.TFramedTransport,
  protocol: thrift.TBinaryProtocol
});

connection.on('connect', function () {
  console.log('connected');
  var client = thrift.createClient(HBase, connection);

  // put 'users', 'wwzyhao', 'info:count', 1
  var tIncrement = new HBaseTypes.TIncrement({
    row:'wwzyhao',
    columns: [new HBaseTypes.TColumn({family: 'info', qualifier: 'count'})]
  });
  client.increment('users', tIncrement, function (err) {
    if (err) {
      console.log(err);
      return;
    }
    console.log('increment success.');
    connection.end();
  });

});

connection.on('error', function(err){
  console.log('error', err);
});