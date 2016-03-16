<?php
namespace Admin\Controller;

use Think\Controller;

class AuthUserController extends AdminController
{

    public function listsDatatables()
    {
        $model = D('AuthUser');
        $columns = array(
            array('db' => 'id', 'dt' => 'id'),
            array('db' => 'username', 'dt' => 'username'),
            array( 'db' => 'email',  'dt' => 'email' ),
            array( 'db' => 'status',   'dt' => 'status' ),
            array('db' => 'remark', 'dt' => 'remark'),
            array( 'db' => 'last_login_time',     'dt' => 'last_login_time' ),
            array( 'db' => 'last_login_ip',     'dt' => 'last_login_ip' ),
        );
        $data = $model->listsDatatables($columns);
        // $data = null;
        if($data){
            $this->ajaxReturn($data);
            // $this->success($data);
        }
    }

    public function listsRoleName()
    {
        $model = D("AuthRole");

        $field = array('id','name' => 'text');
        $list = $model->lists(null,$field);

        $this->ajaxReturn($list);
    }  


    public function save($id = 0)
    {
        $model = D("AuthUser");


    	$data['username'] = I('username');
	    $data['status'] = I('status');
        $data['password'] = md5(I('password'));
	    $data['email'] = I('email');
        $data['remark'] = I('remark');

        if($id == 0){
            $result = $model->save($data);
        }
        else {
            $result = $model->update($id,$data);
        }
        if($result){
            $this->success();
        }
        // if($result) {
        //     if(I('role') != '') {
        //         $this->success();
        //         $roleUserModel = D('AuthRoleUser');
        //         if($roleUserModel->update($id,I('role'))) {
        //             // $this->ajaxReturn(C('SAVE_SUCCESS'));
                    
        //         }
        //     }
        // }
        $this->error();
	}

    public function del($id = 0)
    {

        $model = D('AuthUser');

        if($model->del($id)) {
            $this->success();
        } else {
            $this->error();
        }
    }
}