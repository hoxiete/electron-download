import StreamDownload from './StreamDownload'
var http = require('https')
// var axios = require('axios');
var cheerio = require('cheerio')
// url 获取信息的页面部分地址
var url = ''

export function searchUrl (url) {
  return new Promise((resolve, reject) => {
    http.get(url, function (res) { // 通过get方法获取对应地址中的页面信息
      var chunks = []
      var size = 0
      res.on('data', function (chunk) { // 监听事件 传输
        chunks.push(chunk)
        size += chunk.length
      })
      res.on('end', function () { // 数据传输完
        var data = Buffer.concat(chunks, size)
        var html = data.toString()
        var $ = cheerio.load(html) // cheerio模块开始处理 DOM处理
        var srcList = $('.nthread_firstpostbox img.zoom').map(function (i, el) { return $(this).attr('src') }).toArray()
        return resolve(srcList)
      })
    })
  })
}

function download4Url (url, callback) {
  const refreshStatus = callback
  let present = 0
  http.get(url, function (res) { // 通过get方法获取对应地址中的页面信息
    var chunks = []
    var size = 0
    res.on('data', function (chunk) { // 监听事件 传输
      chunks.push(chunk)
      size += chunk.length
    })
    res.on('end', function () { // 数据传输完
      var data = Buffer.concat(chunks, size)
      var html = data.toString()
      var $ = cheerio.load(html) // cheerio模块开始处理 DOM处理
      var srcList = $('.nthread_firstpostbox img.zoom').map(function (i, el) { return $(this).attr('src') }).toArray()
      let count = srcList.length
      let errCount = 0
      let totalSize = 0
      let currentSize = 0
      srcList.forEach((src, i) => {
        setTimeout(() => {
          StreamDownload.downloadFile(src, 'D://crawler/javbusImg/', (status, res) => {
            if (status === 'start') {
              totalSize += res.total
            } else if (status === 'progress') {
              // 显示进度
              currentSize += res.received
              let body = {
                'percentage': isChunked(totalSize) ? (currentSize * 100) / totalSize
                  : ((srcList.length - count) * 100) / srcList.length,
                'currentSize': currentSize
              }
              refreshStatus('progress', body)
            } else if (status === 'finished') {
              count -= 1
              // 通知完成
              if (count == 0) {
                refreshStatus('finished')
              } else if (count == errCount) {
                refreshStatus('error')
              } else {

              }
            } else if (status === 'error') {
              errCount += 1
              if (count == errCount) {
                refreshStatus('error')
              }
            }
          })
        }, (i + 1) * 400)
      })
    })
  })
};

function isChunked (str) {
  return str == NaN
}
export default download4Url
