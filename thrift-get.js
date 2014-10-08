var thrift = require('thrift');
var HBase = require('./gen-nodejs/THBaseService');
var HBaseTypes = require('./gen-nodejs/hbase_types');

var connection = thrift.createConnection('localhost', 9090);

connection.on('connect', function () {
  console.log('connected');
  var client = thrift.createClient(HBase, connection);

  // row is rowid, columns is array of TColumn, please refer to hbase_types.js
  var tGet = new HBaseTypes.TGet({row: 'TheRealMT',
    columns: [new HBaseTypes.TColumn({family: 'info'})]});
  client.get('users', tGet, function (err, data) {
	  
    if (err) {
      console.log(err,'==============');
    } else {
      console.log(data);
    }
    connection.end();
  });

});

connection.on('error', function(err){
  console.log('error', err);
});