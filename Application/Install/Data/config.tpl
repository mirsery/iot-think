<?php
// +----------------------------------------------------------------------
// | OpenCMF [ Simple Efficient Excellent ]
// +----------------------------------------------------------------------
// | Copyright (c) 2014 http://www.opencmf.cn All rights reserved.
// +----------------------------------------------------------------------
// | Author: jry <598821125@qq.com>
// +----------------------------------------------------------------------

/**
 * CoreThink数据库连接配置文件
 */

// 开启开发部署模式

// 数据库配置
return array(
    'DB_TYPE'   => '[DB_TYPE]',       // 数据库类型
    'DB_HOST'   => '[DB_HOST]',       // 服务器地址
    'DB_NAME'   => '[DB_NAME]',       // 数据库名
    'DB_USER'   => '[DB_USER]',       // 用户名
    'DB_PWD'    => '[DB_PWD]',        // 密码
    'DB_PORT'   => '3306',            // 端口
    'DB_PREFIX' => '[DB_PREFIX]',     // 数据库表前缀

    'SQL_DETAILS' => array(
        'user' => '[DB_USER]',
        'pass' => '[DB_PWD]',
        'db'   => '[DB_NAME]',
        'host' => '[DB_HOST]'
     ),
);

