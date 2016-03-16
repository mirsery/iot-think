<?php  
namespace Admin\Model;

use Think\Model;

class AuthRoleUserModel extends AdminModel
{

	

	public function __construct()
    {
		$this->model = M('sys_role_user');
        $this->view = M('sys_role_user');
	}

}
