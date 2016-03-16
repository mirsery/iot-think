<?php
namespace Admin\Controller;

use Think\Controller;

class AuthUserRoleController extends AdminController
{
    public function lists($id = 0)
    {
        $model = D('AuthRoleUser');
        $field = array('role_id');
        $map['user_id'] = $id;

        $list = $model->lists($map,$field);
        $roleIds = '';
        foreach ($list as $item) {
            $roleIds .= $item['role_id'].',';
        }
        $roleIds = trim($roleIds,',');

        $this->ajaxReturn($roleIds);
    }
}