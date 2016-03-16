<?php
namespace Admin\Controller;

use Think\Controller;

class AuthPermissionController extends AdminController
{

    public function listsDatatables()
    {
        
        $model = D('AuthPermission');
        $columns = array(
            array('db' => 'id', 'dt' => 'id'),
            array('db' => 'name', 'dt' => 'name'),
            array('db' => 'title', 'dt' => 'title'),
            array('db' => 'ptitle', 'dt' => 'ptitle' ),
            array('db' => 'pid', 'dt' => 'pid' ),
            array('db' => 'level', 'dt' => 'level' ),
        );
        $data = $model->listsDatatables($columns);
        if($data){
            $data['data'] = \Org\Util\Tree::create($data['data']);
            echo json_encode($data);
        }
    }

    public function queryPnameListByJson()
    {
    	$model = D('AuthPermission');
        $field = 'id, title as text';
        $map = 'level = '.(I('level') - 1);
    	$data = $model->lists($map,$field);
    	echo json_encode($data);
    }

    public function save()
    {

        $model = D("AuthPermission");

        $param['id'] = I('id');
        $param['name'] = I('name');
        $param['title'] = I('title');
        $param['level'] = I('level');
        $param['pid'] = I('pid',0);
        $param['status'] = 1;

        return $model->save($param);

    }

    public function del()
    {
        $id = I("id",0);
        $model = D('AuthPermission');
        if($model->del($id)) {
            $this->success();
        } else {
            $this->error();
        }
    }    
}