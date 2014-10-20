var thrift = require('thrift');
var HBase = require('./gen-nodejs/THBaseService');
var HBaseTypes = require('./gen-nodejs/hbase_types');

var connection = thrift.createConnection('master', 9090);

connection.on('connect', function () {
  console.log('connected');
  var client = thrift.createClient(HBase, connection);
  
  var tPut = new HBaseTypes.TPut({row: 'TheRealMT',
    columnValues: [
    new HBaseTypes.TColumnValue({family: 'ip', qualifier: 'log1', value: '111111111111111'}),
    new HBaseTypes.TColumnValue({family: 'ip', qualifier: 'log2', value: '111111111111111'})
    ]});
	
  client.put('logs', tPut, function (err) {
	  
    if (err) {
      console.log(err);
      return;
    }
    console.log('success');
    connection.end();
  });
});

connection.on('error', function(err){
  console.log('error', err);
});

