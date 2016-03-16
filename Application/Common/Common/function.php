<?php
/**
 * 系统非常规MD5加密方法
 * @param  string $str 要加密的字符串
 * @return string
 * @author jry <598821125@qq.com>
 */
function user_md5($str, $auth_key) {
	
    return '' === $str ? '' : md5(sha1($str) . $auth_key);
}