
![](http://dailyjs.com/images/posts/nodehbase.png)


#使用thrift2来操作hbase的CRUD
<br>

##Get ready for start hadoop hbase thrift2

* start-dfs.sh

* start-hbase.sh

* hbase-daemon.sh start thrift2

####if you run command example display by : jps

2423 DataNode

2746 ThriftServer

4854 Jps

2349 NameNode

2668 HMaster

2513 SecondaryNameNode


##1 . create Hbase instance client##

```javascript
var HBase = require('node-thrift-hbase');

var config = {

    host: 'master',

    port: 9090

};

var hbaseClient = HBase.client(config);

```
#2 . Use get or getRow function to query data

##get(table,get,callback)## 
<br>

```javascript
var get = hbaseClient.Get('row1');    //row1 is rowKey

//get.addFamily('cf');  //add not found column is error

get.addColumn('info','name');

//get.addColumn('info','tel');

get.setMaxVersions(1);  //default is 1

hbaseClient.get('users',get,function(err,data){ 
    //get users table

    if(err){
        console.log('error:',err);
        return;
    }
    
    console.log(err,data);

});

```

##getRow(table,rowKey,columns,versions,callback)##
<br>

###introduce getRow function###
* hbaseClient.getRow = function (table,rowKey,columns,versions,callback) { 

    * //table is must
    * //rowKey is must
    * //columns is not must,the default is get all row value
    * //versions is not must, the default is 1 ,if have this params,string is auto cost number
* }

------
###getRow( table, rowKey, callback)###

```javascript
hbaseClient.getRow('users','row1',function(err,data){ 
    //get users table

    if(err){
        console.log('error:',err);
        return;
    }

    console.log(err,data);

});

```

----

###getRow( table, rowKey, columns, callback)###

```javascript

hbaseClient.getRow('users','row1',['info:name','ecf'],function(err,data){ 
    //get users table

    if(err){
        console.log('error:',err);
        return;
    }

    console.log(err,data);

});

```

----

###getRow( table, rowKey, columns, versions, callback)###


```javascript

hbaseClient.getRow('users','row1',['info:name','ecf'], 2 ,function(err,data){ 
    //get users table

    if(err){
        console.log('error:',err);
        return;
    }

    console.log(err,data);

});

```

* //'users' is table name

* //row1 is rowKey

* //[] is family or family qualifier

* //['info:name','info:tel'] is right. info is family, name and tel is qualifier

* //['info:name','ecf'] is rigth too, info is family , ecf is family

* //function is callback function

* //2 is Maxversion ,default is 1

<br>
#3 . Use put or putRow function to insert or update data
<br>

##put( table, put, callback)##
<br>

```javascript
var put = hbaseClient.Put('row1');    //row1 is rowKey

put.add('info','address','beijing');

hbaseClient.put('users',put,function(err){ //put users table

    if(err){

        console.log('error:',err);

        return;

    }

    console.log(err,'put is successfully');

});

```
* //info is family

* //address is qualifier

* //beijing is value

##putRow is comming ......

<br>
#4 . Use inc or incRow function to update data
<br>

##inc( table, inc, callback)##
<br>

```javascript

var inc = hbaseClient.Inc('row1');    //row1 is rowKey

inc.add('info','counter');

hbaseClient.inc('users',inc,function(err,data){ 
    //inc users table

    if(err){
        console.log('error:',err);
        return;
    }

    console.log(err,data);

});

```

##incRow( table, rowKey, family:qualifier, callback)##
<br>

```javascript

hbaseClient.incRow('users','row1','info:counter',function(err,data){ //inc users table

    if(err){
        console.log('error:',err);
        return;
    }

    console.log(err,data);
    //data is return new counter object
});

```

<br>
<br>