const wsModule = require('ws');

module.exports = function(_server) {
    const wss = new wsModule.Server({ server:_server });

    wss.on('connection', function( ws, request ) {
        let ip = request.headers['x-forwarded-for'] || request.connection.remoteAddress;
        console.log(ip + " is request connection.");

        ws.on('message', function(message) {
            console.log(ip + " from message is " + message);

            // echo message to message sending user.
            ws.send(message);

            // broadcast messages to connecting users. (exclusive message sending user)
            wss.clients.forEach(function each(client) {
                if(client !== ws && client.readyState === wsModule.OPEN) {
                    console.log("send message [ " + ip + " ] : " + message);
                    client.send(ip + " say : " + message);
                }
            });
        });

        ws.on('error', function(error) {
            console.log(ip + " connection error : " + error);
        });

        ws.on('close', function() {
            console.log(ip + " connection closed")
        });
    });
}
