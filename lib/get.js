/**
 * Created by rubinus on 14-10-20.
 */
var HBaseTypes = require('../gen-nodejs/hbase_types');

var get = function(client,callback){
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
                        callback(null,list[i]);
//                    console.log(typeof list[i].timestamp,'----------',typeof new Int64(1412847878372));
                    }
                }
            }
        }
//        connection.end();
    });
};

module.exports = get;

