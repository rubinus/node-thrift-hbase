/**
 * Created by rubinus on 14-10-20.
 */
var HBase = require('../');

var config = {
    host: 'master',
    port: 9090
};

var client = HBase.create(config);
//client.getClient(function(err,data){
//    console.log(err,data);
//});

client.get(function(err,data){
    console.log(err,data);
});

