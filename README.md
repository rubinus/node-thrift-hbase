
![](http://dailyjs.com/images/posts/nodehbase.png)

already run this command

thrift --gen js:node /install/hbase-0.98.5/hbase-thrift/src/main/resources/org/apache/hadoop/hbase/thrift2/hbase.thrift


使用thrift2来操作hbase的CRUD


var HBase = require('node-thrift-hbase');

var config = {

    host: 'master',

    port: 9090

};

var hbaseClient = HBase.client(config);

1.=============

**get(table,get,callback)**

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

2.========

**getRow = (table,row,columns,versions,callback)**

hbaseClient.getRow = function (table,row,columns,versions,callback) {

    //table is must
    //row is must
    //columns is not must,the default is get all row value
    //versions is not must, the default is 1 ,if have this params,string is auto cost number

}

------

hbaseClient.getRow('users','row1',function(err,data){ //get users table

    if(err){

        console.log('error:',err);

        return;

    }

    console.log(err,data);

});

----

hbaseClient.getRow('users','row1',['info:name','ecf'],function(err,data){ //get users table

    if(err){

        console.log('error:',err);

        return;

    }

    console.log(err,data);

});

----

hbaseClient.getRow('users','row1',['info:name','ecf'], 2 ,function(err,data){ //get users table

    if(err){

        console.log('error:',err);

        return;

    }

    console.log(err,data);

});


//'users' is table name

//row1 is rowKey

//[] is family or family qualifier

//['info:name','info:tel'] is right. info is family, name and tel is qualifier

//['info:name','ecf'] is rigth too, info is family , ecf is family

//function is callback function


**put(table, put, callback)**

var put = hbaseClient.Put('row1');    //row1 is rowKey

put.add('info','address','beijing');

hbaseClient.put('users',put,function(err){ //put users table

    if(err){

        console.log('error:',err);

        return;

    }

    console.log(err,'put is successfully');

});