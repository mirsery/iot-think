<?php  
namespace Admin\Model;

use Think\Model;

class AuthUserModel extends AdminModel
{

	public function __construct()
    {
		$this->model = M('sys_user');
		$this->view = M("v_sys_user");
//		$this->view = M('v_sys_user');
	}
}
