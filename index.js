var Seq = require('seq');

module.exports = function (cb) {
    return function (builder) {
        return function (client, conn) {
            if (conn.stream.socketio) {
                conn.on('ready', function () {
                    if (client.session) {
                        var req = conn.stream.socketio.request;
                        Seq.ap(req.socket.server.stack)
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
                                if (cb) cb(req)
                            })
                        ;
                    }
                });
            }
            return builder.call(this, client, conn);
        };
    };
};
