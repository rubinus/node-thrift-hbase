/**
 * Created by rubinus on 14-10-20.
 */
var HBase = require('../');

var config = {
    host: 'master',
    port: 9090
};

var hbaseClient = HBase.client(config);

var get = hbaseClient.Get('TheRealMT');    //TheRealMT is rowKey
//get.addFamily('cf');  //add not found column is error
get.addColumn('info','name');
//get.addColumn('info','hobbies');
get.setMaxVersions(1);

hbaseClient.get('users',get,function(err,data){ //get users table
    if(err){
        console.log('error:',err);
        return;
    }
    console.log(err,data);
});


//setTimeout(function(){
//    var hbaseClient = HBase.client(config);
//    var get1 = hbaseClient.Get('TheRealMT');
//    get1.addColumn('info','hobbies');
//
//    hbaseClient.get('users',get1,function(err,data){
//        if(err){
//            console.log('error:',err);
//            return;
//        }
//        console.log(err,data);
//    });
//},3000);
