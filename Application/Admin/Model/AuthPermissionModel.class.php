<?php  
namespace Admin\Model;

use Think\Model;

class AuthPermissionModel extends AdminModel
{

	public function __construct()
    {
		$this->model = M('sys_node');
        $this->view = M('v_sys_node');
	}

}