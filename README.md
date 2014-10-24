
![](http://dailyjs.com/images/posts/nodehbase.png)


#使用thrift2来操作hbase的CRUD#
<br>

##Get ready for start hadoop hbase thrift2

* start-dfs.sh

* start-hbase.sh

* hbase-daemon.sh start thrift2

####if you run command example display by : jps####

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

##get(table,get,callback)
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

put.add('info','click','100'); // 100 must be string

put.add('info','name','beijing',new Date().getTime());

put.add('ecf','name','zhudaxian');

hbaseClient.put('users',put,function(err){ //put users table

    if(err){

        console.log('error:',err);

        return;

    }

    console.log(err,'put is successfully');

});

```
* //info and ecf are family

* //click and name is qualifier

* //beijing is value

* timestamp is now Date() and this value also by coustom

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
#5 . Use del or delRow function to delete data
<br>

##del( table, del, callback)##

```javascript

var del = hbaseClient.Del('row1');    //row1 is rowKey

//del.addFamily('ips');   //delete family ips
//del.addColumn('info','click2'); //delete family and qualifier info:click2
//del.addTimestamp('info','click3',1414136046864); //delete info:click3 and timestamp

//or Recommend this function add

del.add('info');    //delete all family info
del.add('info','click2');   //delete family and qualifier info:click2
del.add('info','click3',1414136046864); //delete info:click3 and timestamp

del.add('ecf'); //delete other family ecf
del.add('ecf','net1');  //delete family and qualifier ecf:net1
del.add('ecf','net2',1414136119207); //delete info:click3 and timestamp

//del.add('ips'); //is error ,because this family ips is not exist

hbaseClient.del('users',del,function(err){ //put users table
    if(err){
        console.log('error:',err);
        return;
    }
    console.log(err,'del is successfully');
});

```

##delRow( table, rowKey, family:qualifier, timestamp, callback)##
<br>

```javascript

hbaseClient.delRow('users','row1','info:name',1414137991649,function(err){ 
    //put users table
    
    if(err){
        console.log('error:',err);
        return;
    }
    
    console.log(err,'del is successfully');
});

```

<br>
<br>