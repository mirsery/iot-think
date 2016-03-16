<?php
namespace Admin\Controller;

use Think\Controller;

class IndexController extends AdminController
{

    public function index()
    {
        
         $this->isLogin();

         $this->display('Index/index');

    }


    public function verify()
    {
        ob_clean();
        $Verify = new \Think\Verify();  
        $Verify->fontSize = 18;
        $Verify->length   = 4;
        // $Verify->useNoise = false; 
        $Verify->codeSet = '0123456789';
        $Verify->imageH = 40;
        $Verify->entry();  
    }

    public function toLogin()
    {
        $this->display('Login/login');
    }

    public function login()
    {

        $code = I("verify");

        $verify = new \Think\Verify();
        
        $param['username'] = I('username','');
        $this->assign('username',$param['username']);
        $authInfo = \Org\Util\Rbac::authenticate($param);

        if(!$verify->check($code)) {
            $this->assign('tip',"验证码错误！");
            $this->display('Login/login');
        } else {
            if(empty($authInfo)) {
                $this->assign('tip','账号不存在或者被禁用！');
                $this->display('Login/login');
            } else {
                if($authInfo['password']!=user_md5(I('password'),$authInfo['username'])){
                    $this->assign('tip','账号密码错误!');
                    $this->display('Login/login');
                } else {
                    $_SESSION[C('USER_AUTH_KEY')]=$authInfo['id'];
                    $_SESSION['email']=$authInfo['email'];
                    $_SESSION['user']=$authInfo['username'];
                    $_SESSION['remark'] = $authInfo['remark'];
                    $_SESSION['last_login_ip']=$authInfo['last_login_ip'];
                    //判断是否为超级管理员
                    if($authInfo['username'] == C('ADMIN_AUTH_KEY')){
                        $_SESSION[C('ADMIN_AUTH_KEY')]=true;
                    }
                        //以下操作为记录本次登录信息
                    $user = D('AuthUser');
                    // $param['id'] = $authInfo['id'];
                    $userInfo['last_login_ip'] = get_client_ip();

                    $userInfo['last_login_time'] = date('Y-m-d h:i:sa');
                    $user->update($authInfo['id'],$userInfo);
                    \Org\Util\Rbac::saveAccessList();
                    $this->assign('jumpUrl','Index/index');
                    $this->success('登录成功!');
                }
            }
        }
    }

    public function logout()
    {

        if(!empty($_SESSION[C('USER_AUTH_KEY')])){
            unset($_SESSION[C('USER_AUTH_KEY')]);
            $_SESSION=array();
            session_destroy();
            $this->assign('jumpUrl','Index/toLogin');
            $this->success('登出成功');
        } else {
            $this->error('已经登出了');
        }
    }
}