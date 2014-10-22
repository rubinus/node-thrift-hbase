/**
 * Created by rubinus on 14-10-20.
 */
var HBase = require('../');

var config = {
    host: 'master',
    port: 9090
};

var hbaseClient = HBase.client(config);


var param = new hbaseClient.Get('TheRealMT');
//param.addFamily('cf');
//param.addColumn('info','name');
//param.addColumn('info','tel');
param.setMaxVersions(1);

//console.log(param);

hbaseClient.get('users',param,function(err,data){
    if(err){
        console.log(err);
        return;
    }

    console.log(err,data);
});

