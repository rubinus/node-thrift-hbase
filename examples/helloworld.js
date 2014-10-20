/**
 * Created by rubinus on 14-10-20.
 */
var HBase = require('../');

var config = {};
var client = HBase.create(config);

client.get('3333',function(reply){
    console.log(reply);
});