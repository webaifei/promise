/**
  promise 三个状态
  then 和 catch 添加回调 返回新的promise 支持链式调用
 */

(function(window) {
  const PENDING = 0;
  const FULFILLED = 1;
  const REJECTED = 2;

  const isFunction = fn => {
    return typeof fn == "function";
  };

  const isThenable = obj = > {
    return obj && isFunction(obj.then);
  }
  function Promise(resolver) {
    this.status = PENDING;
    this.reason = undefined;
    this.val = undefined;
    this._resolves = [];
    this._rejects = [];
    // 执行传入的resolver 依赖两个入参
    // resolve reject
    const me = this;
    const transition = function(status, val) {
      setTimeout(() => {
        // 修改状态
        if (me.status != PENDING) {
          return;
        }
        me.status = status;
        me.val = val;
        // 执行回调队列 this._resolves
        // 最开始添加的 最开始执行
        let fn;
        const queue = status == FULFILLED ? me._resolves : me._rejects;
        while ((fn = queue.shift())) {
          me[status == FULFILLED ? "val" : "reason"] = fn(val) || val;
        }
        me._resolves = me._rejects = undefined;
      });
    };
    const resolve = function (val) {
      transition(FULFILLED, val);
    }
    const reject = function (reason) {
      transition(REJECTED, reason);
    }
    resolver(resolve, reject);
  }

  // 添加回调队列
  // 并且返回一个新的promise 对象
  // 1. 可以链式执行添加回调
  // 2. onFulfilled, onRejected 是函数的话
  // onFulfilled, onRejected 不是函数的话
  Promise.prototype.then = function(onFulfilled, onRejected) {
    const promise = this;
    onFulfilled = isFunction(onFulfilled) ? onFulfilled : (res)=> {};
    onRejected = isFunction(onRejected) ? onRejected : (err)=> {};
    return new Promise(function(resolve, reject) {
      // 重新包装onFulfilled, onRejected  添加回调
      const callback = function (val) {
        const ret = onFulfilled(val);
        if (isThenable(ret)) {
          ret.then((value)=> {
            resolve(value);
          }, (reason)=> {
            reject(reason);
          })
        } else {
          resolve(ret);  
        }
      }
      const errback = function (reason) {
        const ret = onRejected(reason);
        if (isThenable(ret)) {
          ret.then((value)=> {
            resolve(value);
          }, (reason)=> {
            reject(reason);
          })
        } else {
          reject(ret);  
        }
      }
      if (promise.status == PENDING) {
        promise._resolves.push(callback);
        promise._rejects.push(errback);
      } else if(promise.status == FULFILLED) {
        // 直接执行 成功回调
        callback(promise.val);
      } else if(promise.status == REJECTED) {
        // 直接执行 失败回调
        errorback(promise.reason);
      }
    });
  };

  Promise.prototype.catch = function() {};

  Promise.prototype.finally = function() {};

  window.Promise = Promise;
})(window);
