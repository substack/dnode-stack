var connect = require('connect');
var stack = require('dnode-stack');
var EventEmitter = require('events').EventEmitter;
var assert = require('assert');

exports.req = function () {
    var to = setTimeout(function () {
        assert.fail('never finished')
    }, 1000);
    
    var server = connect.createServer();
    server.use(connect.cookieDecoder());
    
    var req = { headers : [], socket : { server : server } };
    
    var conn = new EventEmitter;
    conn.stream = { socketio : { request : req } };
    
    var obj = { z : 1337 };
    var order = [];
    
    stack(function (client, conn, req_) {
        conn.on('request', function (req__) {
            assert.ok(req__ === req);
            order.push(4);
            assert.eql(order, [1,2,3,4]);
            clearTimeout(to);
        });
        
        assert.ok(req_ === req);
        assert.ok(req.headers);
        assert.ok(req.cookies);
        order.push(3);
    })(obj, conn);
    
    order.push(1);
    conn.emit('ready');
    order.push(2);
};
