<?php


return array(

	/* 默认模板 */
	'DEFAULT_THEME' => 'adminlte',

   /* 模板相关配置 */
    'TMPL_PARSE_STRING' => array(
    	'__THEME__' => __ROOT__ . '/Public/themes',
        '__PLUGIN__' => __ROOT__ . '/Public/plugins',
        '__IMG__'    => __ROOT__ . '/Public/' . MODULE_NAME . '/images',
        '__CSS__'    => __ROOT__ . '/Public/' . MODULE_NAME . '/css',
        '__JS__'     => __ROOT__ . '/Public/' . MODULE_NAME . '/js',
    ),
);

?>
