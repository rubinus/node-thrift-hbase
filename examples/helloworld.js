/**
 * Created by rubinus on 14-10-20.
 */
var HBase = require('../');

var config = {
    host: 'master',
    port: 9090
};

var hbaseClient = HBase.client(config);

var get = hbaseClient.Get('domain.100');    //domain.100 is rowKey
//get.addFamily('cf');
get.addColumn('ip','ip');
get.addColumn('ip','site');
//get.addColumn('info','hobbies');
get.setMaxVersions(1);

hbaseClient.get('logs',get,function(err,data){
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
