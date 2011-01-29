var connect = require('connect');
var webserver = connect.createServer();
webserver.use(connect.staticProvider(__dirname));
webserver.use(require('sesame')());

webserver.listen(8080);
console.log('Listening on 8080');

var dnode = require('dnode');
var dserver = dnode(function (client, conn) {
    console.log('pow!');
    
    conn.on('request', function (req) {
        if (req.session) {
            client.session(Session(req.session));
        }
    });
    
    this.auth = function (user, pass, cb) {
        if (user === 'x' && pass === 'o_O') {
            var session = conn.request.session;
            session.user = user;
            client.session(Session(session));
            if (cb) cb(null);
        }
        else if (cb) {
            cb('ACCESS DENIED');
        }
    };
}).listen(webserver);
dserver.use(require('dnode-stack')());

function Session (params) {
    if (!params.user) return;
    
    var self = {}
    self.user = params.user;
    self.says = function (animal, cb) {
        cb({
            cat : 'meow',
            dog : 'woof',
        }[animal]);
    };
    return self;
}
