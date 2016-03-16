<?php  
namespace Admin\Model;

use Think\Model;

class AuthAccessModel extends AdminModel
{

	public function __construct()
    {
		$this->model = M('sys_access');
        $this->view = M('sys_access');
	}

}
