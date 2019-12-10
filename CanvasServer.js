var WebSocketServer = require('websocket').server;
var http = require('http');
var clients = [];//放連進來的使用者
var server = http.createServer(function (request, response) {
    
});

server.listen(8080, function () { //預設是80 port
    console.log((new Date()) + ' Server is listening on port 8080');
});
// 先 npm i websocket
wsServer = new WebSocketServer({ //電腦間溝通過程在這段做掉了 有這三行少寫很多code
    httpServer: server,
});

//每個連進來的使用者都會觸發request事件
wsServer.on('request', function (request) { //使用者連進來SocketServer會觸發request事件
    var connection = request.accept(null, request.origin);//接收連線(accept) 連線資訊放在connection
    console.log((new Date()) + ' Connection accepted.');
    
//將連進來的使用者存到clients陣列中
    var index = clients.push(connection) - 1; //要在陣列中加入資料用push
   //瀏覽器傳過來得資料，會觸發message事件
    //可以在此事件中接收資料
    connection.on('message', function (message) {
            console.log(message);
            //將收到的資料，廣播給所有連進來的使用者, message.utf8Data會收到client端送出的資料
for(var i=0,max=clients.length;i<max;i++){
 clients[i].sendUTF(message.utf8Data);
}
           
    });
    // 瀏覽器關閉或離開會觸發close事件
    connection.on('close', function (reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });
});







