var express = require('express');
var router = express.Router();
var multer  = require('multer') // npm home multer 會開啟套件官網 檔案上傳套件
var fs = require("fs");
const request = require('request');
const zlib = require('zlib');

//====跟檔案上傳有關====
var uploadFolder = 'public/uploads/';
var storage = multer.diskStorage({
    destination: function (req, file, cb) {//決定路徑
        cb(null, uploadFolder);    
    },
    filename: function (req, file, cb) {  //決定檔案名稱
        cb(null, file.originalname);  
    }
});
var upload = multer({ storage: storage })
//====================

//http://localhost:3000/api/ > 路由(Route) > 執行的程式 ,網址對應到執行的程式裡面的技術叫路由
router.get('/',function(req,res,next){  
  //setTimeout(function() {
    res.setHeader('Content-type', 'text/plain');
    res.charset = 'UTF-8';
    res.write("Hello, world");
    res.end();
  //}, 8000);
})

//http://localhost:3000/api/jsonhandler
router.get('/jsonhandler',function(req,res,next){
  var jsonData = [
    {name: "Jack",age: "29",email: "Jack@gmail.com"},
    {name: "Mary",age: "21",email: "Mary@hotmail.com"},
    {name: "Tom",age: "35",email: "Tom@yahoo.com"}];
    res.json(jsonData);
})

http://localhost:3000/api/upload
//upload.any()
//<input type="file" name="myFile"
router.post('/upload',upload.single('myFile'),function(req,res,next){
  //res.send(req.file);
  res.send({})
})


http://localhost:3000/api/base64
router.post('/base64', upload.fields([]), (req, res) => {
  let formData = req.body;
  fs.writeFile('public/uploads/'+formData.id+'.png', formData.imageData, {encoding: 'base64'}, function(err) {
       res.send('檔案上傳成功!!');
   });
 
});


// http://localhost:3000/api/events   Server-Sent-Events:瀏覽器連到伺服器端 網路和網頁不關 伺服器端每隔一段時間主動的把資料丟給瀏覽器端 SSE只能接資料
router.get('/events', function(req, res, next) {
  res.writeHead(200,{
    "Content-Type":"text/event-stream", // 伺服器端要資料推播必須設成這樣
    "Connection":"keep-alive", // http協定特性是不會保持連線 這樣server端資源不會被吃掉 但此例測試需要保持連線
    "Cache-Control":"no-cache"//Network裡的size有個disk cache(為了提升效能的機制),載入的圖片影片等等下載過的會存一份在瀏覽器端,下一次進到同樣路徑的圖片就不會再下載一次了 disable cache打勾可關掉
  })
  setInterval(function(){
    res.write('data:' + (new Date()).toLocaleTimeString() + '\n\n'); // 2個\n才收得到資料 丟資料的結構有定義
  },1000)
  res.write('data:' + (new Date()).toLocaleTimeString() + '\n\n');
});

//http://localhost:3000/api/youbike
router.get('/youbike',function(req,res,next){
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
});
setInterval(function(){
  // 要求http://data.taipei/youbike的資料
  // http://data.taipei/youbike回傳的資料，透過body參數來接收
  // https://tcgbusfs.blob.core.windows.net/blobyoubike/YouBikeTP.json
  request('https://tcgbusfs.blob.core.windows.net/blobyoubike/YouBikeTP.json',{'encoding':null},function(err,response,body){
      res.write("data: " + body + '\n\n');  

  })
  
  // request('http://data.taipei/youbike',{'encoding':null},function(err,response,body){
  // // 透過zlib解壓縮gz  
  // zlib.gunzip(body,function(err, dezipped){
  //     //console.log(dezipped.toString())
  //     if(dezipped){
  //        res.write("data: " + dezipped.toString() + '\n\n'); 
  //     }      
  //   });
  // })
},60000)
request('https://tcgbusfs.blob.core.windows.net/blobyoubike/YouBikeTP.json',{'encoding':null},function(err,response,body){
  res.write("data: " + body + '\n\n')
})

// request('http://data.taipei/youbike',{'encoding':null},function(err,response,body){
//   // 透過zlib解壓縮gz, zlib is node的模組 
//   zlib.gunzip(body,function(err, dezipped){
//       //console.log(dezipped.toString())
//       res.write("data: " + dezipped.toString() + '\n\n');   
//     });
//   })
  
})




module.exports = router;
