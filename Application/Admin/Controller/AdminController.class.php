<?php
namespace Admin\Controller;

use Think\Controller;

class AdminController extends Controller
{
    /*
    *  默认访问模板
    */
    public function index()
    {
        $this->isLogin();
        $this->isAuth();
        $this->display();
    }
    /**
     * 空操作处理
     */
    public function _empty($name)
    {
       // $this->assign('msg',"你的思想太飘忽，系统完全跟不上....");
        $this->display('Error/404');
    }

    /**
     * ajax操作登录验证
     */
    public function isAjaxLogin()
    {
        $s = session(C('USER_AUTH_KEY'));
        if(empty($s))die("{status:-999,url:'toLogin'}");
    }

    /**
     * 登录操作验证
     */
    public function isLogin()
    {
        $s = session(C('USER_AUTH_KEY'));
        if(empty($s))$this->redirect("Index/toLogin");

    }

    public function isAuth()
    {
        $notAuth = in_array(MODULE_NAME, explode(',', C('NOT_AUTH_MODULE')));
        if(C('USER_AUTH_ON') && !$notAuth) {
            if(!\Org\Util\Rbac::AccessDecision()) {
                $this->display('Error/not_auth');
                exit();
            }
        }
    }

    public function isAjaxAuth()
    {
        $notAuth = in_array(MODULE_NAME, explode(',', C('NOT_AUTH_MODULE')));
        if(C('USER_AUTH_ON') && !$notAuth) {
            if(!\Org\Util\Rbac::AccessDecision()) {
                die("{status:-998}");
            }
        }
    }

    protected function diffForDays($startDate, $endDate)
    {
        $timediff = strtotime($endDate) - strtotime($startDate);
        $days = intval($timediff/86400);
        return $days;
    } 
}
