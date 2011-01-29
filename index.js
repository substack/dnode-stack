var Seq = require('seq');

module.exports = function (cb) {
    return function (client, conn) {
        var req = conn.stream.socketio.request;
        
        if (conn.stream.socketio && req.socket && req.socket.server) {
            conn.on('ready', function () {
                Seq.ap(req.socket.server.stack || [])
                    .seqEach(function (mid) {
                        if (mid.route === ''
                        && typeof mid.handle === 'function') {
                            mid.handle(req, {}, this.bind({}, null));
                        }
                        else {
                            this(null);
                        }
                    })
                    .seq(function () {
                        conn.request = req;
                        if (cb) cb(client, conn, req)
                        conn.emit('request', req);
                    })
                ;
            });
        };
    };
};
