/**
 * Created by rubinus on 14-10-20.
 */
var HBase = require('../');

var config = {
    host: 'master',
    port: 9090
};

var hbaseClient = HBase.client(config);

var get = hbaseClient.Get('row1');    //row1 is rowKey
//get.addFamily('cf');  //add not found column is error
get.addColumn('info','name');
//get.addColumn('info','counter');
get.setMaxVersions(1);

hbaseClient.get('users',get,function(err,data){ //get users table
    if(err){
        console.log('error:',err);
        return;
    }
    console.log(err,data);

//    console.log(err,data.columnValues[0].value);
});

