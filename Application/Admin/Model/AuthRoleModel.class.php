<?php  
namespace Admin\Model;

use Think\Model;

class AuthRoleModel extends AdminModel
{

	public function __construct()
    {
		$this->model = M('sys_role');
        $this->view = M('sys_role');
	}

}
