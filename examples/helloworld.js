/**
 * Created by rubinus on 14-10-20.
 */
var HBase = require('../');

var config = {
    host: 'master',
    port: 9090
};

var client = HBase.client(config);
//client.getClient(function(err,data){
//    console.log(err,data);
//});
//var client1 = HBase.create(config);

//console.log(client.suiji,client1.suiji);

client.get(function(err,data){
    console.log(err,data);
});

