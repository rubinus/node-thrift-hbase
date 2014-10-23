
![](http://dailyjs.com/images/posts/nodehbase.png)

init node-thrift-hbase

thrift --gen js:node /install/hbase-0.98.5/hbase-thrift/src/main/resources/org/apache/hadoop/hbase/thrift2/hbase.thrift

初始化node-thrift-hbase

使用thrift2来操作hbase的CRUD


var HBase = require('node-thrift-hbase');

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