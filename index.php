<?php
// +----------------------------------------------------------------------
// | ThinkPHP [ WE CAN DO IT JUST THINK ]
// +----------------------------------------------------------------------
// | Copyright (c) 2006-2014 http://thinkphp.cn All rights reserved.
// +----------------------------------------------------------------------
// | Licensed ( http://www.apache.org/licenses/LICENSE-2.0 )
// +----------------------------------------------------------------------
// | Author: liu21st <liu21st@gmail.com>
// +----------------------------------------------------------------------

// 应用入口文件

// 检测PHP环境
if(version_compare(PHP_VERSION,'5.3.0','<'))  die('require PHP > 5.3.0 !');

// 开启调试模式 建议开发阶段开启 部署阶段注释或者设为false
define('APP_DEBUG',True);

// 定义应用目录
define('APP_PATH','./Application/');



//包含开发模式数据库连接配置
if (@$_SERVER[ENV_PRE.'DEV_MODE'] !== 'true') {
    @include './Data/dev.php'; 
}

//系统安装模式及开发模式的检测
if (is_file('./Data/install.lock') === false && @$_SERVER[ENV_PRE.'DEV_MODE'] !== 'true') {
    define('BIND_MODULE','Install');
} else {
    // 系统调试设置, 项目正式部署后请设置为false
    define('APP_DEBUG', @$_SERVER[ENV_PRE.'APP_DEBUG'] ? : true);
}

// 引入ThinkPHP入口文件
require './ThinkPHP/ThinkPHP.php';
