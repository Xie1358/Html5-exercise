var cacheName = "drawing_v2"
//install事件是用來將操作的介面(html、css、js、png...)存到Cache Storage中
self.addEventListener("install",function(event){
    event.waitUntil(
        caches.open(cacheName).then(function(cache){
            var url_files = [
                '/MyApp/',
                '/MyApp/Drawing.html',
                '/MyApp/Drawing.css',
                '/MyApp/Drawing.js',
                '/MyApp/drawing_sw.js',
            ]
            return cache.addAll(url_files);
        })
    )
})
//使用者要求 http://localhost:3000/a.html就會觸發ServiceWorker的fetch事件
//此事件中會比對Cache Storage有無使用者要求的網頁(a.html)
//如果有直接回傳，如果沒有就透過fetch('a.html')去伺服器端要求此網頁
self.addEventListener("fetch",function(event){
    event.respondWith(
        caches.match(event.request).then(function(response){
            // if(response){
            //     return response;
            // }
            // return fetch(event.request);
            return response || fetch(event.request)
        })
    )
})
//管理Cache Storage
//將舊的Cache刪除，保留新的Cache
self.addEventListener("activate",function(event){
    event.waitUntil(
        caches.keys().then(function(names){
            Promise.all(names.map(function(name){
                if(name != cacheName){
                    return caches.delete(name);
                }
            }))
        })
    )
})