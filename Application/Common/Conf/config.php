<?php

//Production Database Information
// $user = '';
// $password = '';
// $db = "ssha_police_prod";
// $host = "192.168.110.2";

// Develop Database Information
$user = 'root';
$password = 'welcome1';
$db = "jlxh";
$host = "localhost";



$_config = array(

	'DEFAULT_MODULE' => 'Admin',

	 'APP_DEBUG'     =>  false,// 开启调试模式

	 'USER_AUTH_ON' => true,
	 'USER_AUTH_TYPE' => 1,
	 'USER_AUTH_KEY' => 'authId',
	 'ADMIN_AUTH_KEY' => 'root',
	 'USER_AUTH_MODEL' => 'sys_user',
	 'NOT_AUTH_MODULE' => 'Index', //无需认证模块
	 'AUTH_PASSWORD_ENCODER' => 'md5',
	 'RBAC_ROLE_TABLE' => 'ssha_sys_role',
	 'RBAC_USER_TABLE' => 'ssha_sys_role_user',
	 'RBAC_ACCESS_TABLE' => 'ssha_sys_access',
	 'RBAC_NODE_TABLE' => 'ssha_sys_node',


	 'TITLE' => 'iot-think',


	 'WARNING_MSG' => '服务器开小差，请稍后再试',
	 'ERROR_MSG' => '服务器出错，请联系工程师',

	 'SAVE_SUCCESS' => '保存成功',
	 'SAVE_FAIL' => '保存失败',

	 'LOAD_SUCCESS' => '载入成功',
	 'LOAD_FAIL' => '载入失败',


	 'DEL_SUCCESS' => '删除成功',
	 'DEL_FAIL' => '删除失败',
);


if (is_file('./Data/db.php')) {
    $db_config = include './Data/db.php';  // 包含数据库连接配置
} else {

	$db_config = array(
			'DB_TYPE'  => 'mysql',// 数据库类型 
			'DB_HOST'  => $host,// 数据库服务器地址
			'DB_NAME'  => $db,// 数据库名称
			'DB_USER'  => $user,// 数据库用户名
			'DB_PWD'  => $password,// 数据库密码
			'DB_PREFIX'  => 'ssha_',// 数据表前缀
			'DB_CHARSET' => 'utf8',// 网站编码
			'DB_PORT'  => '3306',// 数据库端口

			'SQL_DETAILS' => array(
		        'user' => $user,
		        'pass' => $password,
		        'db'   => $db,
		        'host' => $host
			 )

		);
}

// var_dump(array_merge($_config,$db_config));
// die();


return array_merge($_config,$db_config);