var ClientPool = require('./client');

var Service = function(options)
{
    this.clientPool = ClientPool(options);
}

Service.create = function (options) {
    return new Service(options);
};

Service.prototype.getRow = function (table, row, columns, versions, callback) {
    var hbasePool = this.clientPool;
    var args = arguments;
    var _callback = args[args.length-1];
    this.clientPool.acquire(function (err, hbaseClient) {
        if(err)
            _callback(err);
        function releaseAndCallback(err,data){ //get users table
            if(err){
                //destroy client on error
                hbasePool.destroy(hbaseClient);
                return _callback(err);
            }
            //release client in the end of use.
            hbasePool.release(hbaseClient);
            return _callback(null,data);
        };
        args[args.length-1]=releaseAndCallback;
        hbaseClient.getRow.apply(hbaseClient,args);

    });
}

module.exports = Service.create;