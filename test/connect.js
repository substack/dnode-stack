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
    
    stack(function (req_) {
        assert.eql(req_, req);
        assert.ok(req.headers);
        assert.ok(req.cookies);
        order.push(3);
        
        assert.eql(order, [1,2,3]);
        clearTimeout(to);
    })
    (function (r, c) {
        assert.eql(r, obj);
        assert.eql(c, conn);
        order.push(1)
    })(obj, conn);
    
    conn.emit('ready');
    order.push(2);
};
