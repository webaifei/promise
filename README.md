promise
=======

es6 promise

一个小的 promise 库，仿照 es6 promise api 做了简单实现

- 实例化

    ```
        new Promise(function(resolve,reject){
            setTimeout(function(){
                resolve('ok')
            },500)
        }).then(function(msg){
            console.log(msg)
        }).catch(function(err){
            console.log(err)
        })
    ```
- api

    - Promise.all
    - Promise.race
    - Promise.resolve
    - Promise.reject
    - Promise.delay


简单提供了一个 delay 方法，可以循环处理，如

```
var pro = Promise.resolve()
for (var i = 0; i < 5; i++) {
    pro = pro.delay(500).then(function(){
        console.log(Date.now())
    })
}
```

另外补上当时写的实现说明链接 https://gmiam.com/post/shi-xian-ge-promise.html









### Promise
1. 核心resolve reject 修改Promise 状态 和 触发回调队列
2. promise1 then方法 返回一个新的promise2对象，并且初始化此对象的时候 就添加当前回调到promise1 的回调队列中。
3. 回调执行的时候：判断是不是thenbale对象promise3，
4. 不是的话 直接执行 并且执行resolve 或者reject promise2 的状态触发回调队列
5. 如果是的话 就调用promise3 then方法 生成promise4（添加回调 触发promise2的状态触发回调队列）

所以， then中可以根据当前的结果 进行不同状态转换（成功回调 可以 改变then后面的执行路径）
```
const p1 = new Promise(function (resolve, reject) {
  setTimeout(()=> {
    resolve({
      value: "ok"
    })
  }, 1000);
})
// 当前
p1 
  value
  callback
  status

const p2 = p1.then((res)=> {
  console.log(res);
})
// then
// 1 返回一个新的promise p2
// 2 给p1 添加回调队列
// 3 
p1
  value
  status
  callback: 


  // 回调做两件事情
  // 1. 执行我们传入的callback 
  // 2. 执行then返回的promise对象的resolve或者reject方法
  function(value) {
    try {
      var x = onResolved(self.data)
      if (x instanceof Promise) {
        x.then(resolve, reject)
      }
    } catch (e) {
      reject(e)
    }
  }

p2 
  value
  status
  callback

  

```

