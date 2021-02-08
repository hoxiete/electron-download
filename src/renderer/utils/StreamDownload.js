import * as path from 'path'
import * as fs from 'fs'
import fetch from 'node-fetch'
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
StreamDownload.prototype.showProgress = function (received, callback) {
  // 用回调显示到界面上
  callback != undefined && callback('progress', received)
}

// 下载过程
StreamDownload.prototype.downloadFile = function (patchUrl, baseDir, callback) {
  // this.downloadCallback = callback // 注册回调函数

  let httpType = patchUrl.substring(0, patchUrl.indexOf('://'))
  let fileType = patchUrl.substring(patchUrl.lastIndexOf('.'))
  const downloadFile = new Date().getTime().toString() + fileType

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
  fetch(patchUrl, option).then(req => {
    debugger
    const body = req.body
    const out = fs.createWriteStream(path.join(baseDir, downloadFile))
    let skipProcess = req.headers['content-length'] === undefined
    let total = !skipProcess ? parseInt(req.headers['content-length'], 10) : 1
    callback != undefined && callback('start', total)
    body.pipe(out)

    body.on('data', (chunk) => {
      // 更新下载的文件块字节大小
      skipProcess || this.showProgress(chunk.length, callback)
    })
    body.on('error', (err) => {
      callback != undefined && callback('error', err)
    })

    body.on('end', () => {
      // TODO: 检查文件，部署文件，删除文件
      callback != undefined && callback('finished', skipProcess)
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
