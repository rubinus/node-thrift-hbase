/**
 * Created by rubinus on 14-10-20.
 */
var thrift = require('thrift');
var HBase = require('../gen-nodejs/THBaseService');
var HBaseTypes = require('../gen-nodejs/hbase_types');

var connection = thrift.createConnection('master', 9090);

connection.on('connect', function () {
    var client = thrift.createClient(HBase, connection);

    // row is rowid, columns is array of TColumn, please refer to hbase_types.js
    var tGet = new HBaseTypes.TGet({row: 'TheRealMT',
        columns: [new HBaseTypes.TColumn({family: 'info',qualifier: 'name'})]
    });
    tGet.maxVersions = 5;
    client.get('users', tGet, function (err, data) {

        if (err) {
            console.log(err,'==============');
        } else {
//      console.log(data);
            var list = data.columnValues;
            if(list.length > 0){
                for(var i= 0;i < list.length;i += 1){
                    if(parseInt(list[i].timestamp.toString()) === 1412847878372){
                        list[i].timestamp = parseInt(list[i].timestamp.toString());
                        console.log(list[i],'================');
//                    console.log(typeof list[i].timestamp,'----------',typeof new Int64(1412847878372));
                    }
                }
            }
        }
        connection.end();
    });

});

connection.on('error', function(err){
    console.log('error', err);
});