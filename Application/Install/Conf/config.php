<?php
/**
 * 安装程序配置文件
 */
return array(
    //产品配置
    'INSTALL_PRODUCT_NAME'   => '前端框架模板', //产品名称
    'INSTALL_WEBSITE_DOMAIN' => 'http://www.szjlxh.com/WordPress/', //官方网址
    'INSTALL_COMPANY_NAME'   => '苏州嘉禄讯汇智能科技有限公司', //公司名称
    'ORIGINAL_TABLE_PREFIX'  => 'jlxh_', //默认表前缀

    //模板相关配置
    'TMPL_PARSE_STRING' => array(
        '__THEME__' => __ROOT__ . '/Public/themes',
        '__PUBLIC__' => __ROOT__.'/Public',
        '__IMG__' => __ROOT__.'/Public/'.MODULE_NAME.'/images',
        '__CSS__' => __ROOT__.'/Public/'.MODULE_NAME.'/css',
        '__JS__'  => __ROOT__.'/Public/'.MODULE_NAME.'/js',
    ),

    //前缀设置避免冲突
    'DATA_CACHE_PREFIX' => ENV_PRE.MODULE_NAME.'_', //缓存前缀
    'SESSION_PREFIX'    => ENV_PRE.MODULE_NAME.'_', //Session前缀
    'COOKIE_PREFIX'     => ENV_PRE.MODULE_NAME.'_', //Cookie前缀

    //是否开启模板编译缓存,设为false则每次都会重新编译
    'TMPL_CACHE_ON' => false,

    // 默认模块
    'DEFAULT_MODULE'     => 'Install',
);
