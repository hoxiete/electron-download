import * as path from 'path'
import * as fs from 'fs'
import fetch  from 'node-fetch'
import progress  from 'progress-stream'
import { mapMutations, mapActions } from 'vuex'
const https = require('https')
const http = require('http')

// const $ = mapMutations(['ADD_TOTAL','ADD_CURRENT'])
// ---- 下载类 ---- //
function StreamDownload () {
  // 声明下载过程回调函数
  this.downloadCallback = null
}

// 下载进度
StreamDownload.prototype.showProgress = function (received, total, callback) {
  const body = {
    // "percentage": (received * 100) / total,
    'total': total,
    'received': received
  }
  // 用回调显示到界面上
  callback!= undefined && callback('progress', body)
}

// 下载过程
StreamDownload.prototype.downloadFile = function (patchUrl, baseDir, callback) {
  // this.downloadCallback = callback // 注册回调函数

  let httpType = patchUrl.substring(0, patchUrl.indexOf('://'))
  let fileType = patchUrl.substring(patchUrl.lastIndexOf('.'))
  const downloadFile = new Date().getTime().toString() + fileType

  let receivedBytes = 0
  let totalBytes = 0
  let percentage = 0

  let option = {
    // hostname: 'hoxiete.cn',
    // port:8888,
    // path: '/group1/M00/00/00/rBMABF8mU5OAIAtuAAjqCyD3k04484.jpg',
    method: 'GET',
    headers: { // 请求头
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36',
      'Cache-Control': 'no-cache',
      // 'Range': 'bytes=0-1',
      // 'Connection': 'keep-alive',
      // 'PHPSESSID':'fskrf68v5qaftnl8c014tssb85'
    }
  }
  // 判断url选择http模块
  const httpMethod = eval(httpType == 'http' ? http : https)
  fetch(patchUrl,option).then(req => {
    debugger
    const out = fs.createWriteStream(path.join(baseDir, downloadFile))
    // const size = Number(res.headers['content-length']);
    // const length = parseInt(size / SINGLE); 
    // for (let i=0; i<length; i++) {
    //     let start = i * SINGLE;
    //     let end = i == length ? (i + 1) * SINGLE - 1 : size - 1;
    //     request({
    //         method: 'GET',
    //         uri: SOURCE,
    //         headers: {
    //             'range': `bytes=${start}-${end}`
    //         },
    //     }).on('response', (resp) => {
    //         const range = resp.headers['content-range'];
    //         const match = /bytes ([0-9]*)-([0-9]*)/.exec(range);
    //         start = match[1];
    //         end = match[2];
    //     }).pipe(fs.createWriteStream(file, {start, end}));
    debugger
    let skipProcess = req.headers['content-length'] === undefined
    const body = {
      'percentage': 0,
      'total': !skipProcess ? parseInt(req.headers['content-length'], 10) : 1,
      'received': 0
    }
    callback!= undefined && callback('start', body)
    req.pipe(out)

    req.on('response', (data) => {
      // 更新总文件字节大小

    })

    req.on('data', (chunk) => {
      // 更新下载的文件块字节大小
      // receivedBytes += chunk.length;
      skipProcess || this.showProgress(chunk.length, totalBytes, callback)
    })
    req.on('error', (err) => {
      callback!= undefined && callback('error', err)
    })

    req.on('end', () => {
      // TODO: 检查文件，部署文件，删除文件
      callback!= undefined && callback('finished', skipProcess)
    })
  })
}
// var StreamDownload = new StreamDownload();
StreamDownload.prototype.asyncPool = function (poolLimit, array, iteratorFn) {
  let i = 0;
  const ret = [];
  const executing = [];
  const enqueue = function () {
    if (i === array.length) {
      return Promise.resolve();
    }
    const item = array[i++];
    const p = Promise.resolve().then(() => iteratorFn(item, array));
    ret.push(p);

    let r = Promise.resolve();

    if (poolLimit <= array.length) {
      const e = p.then(() => executing.splice(executing.indexOf(e), 1));
      executing.push(e);
      if (executing.length >= poolLimit) {
        r = Promise.race(executing);
      }
    }

    return r.then(() => enqueue());
  };
  return enqueue().then(() => Promise.all(ret));
}

export default new StreamDownload()
