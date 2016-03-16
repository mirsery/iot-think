<?php
namespace Admin\Controller;
use Think\Controller;

class AuthRoleController extends AdminController
{
    public function listsDatatables()
    {
        $model = D('AuthRole');
        $columns = array(
            array('db' => 'id', 'dt' => 'id'),
            array('db' => 'name', 'dt' => 'name'),
            array( 'db' => 'status', 'dt' => 'status'),
            array('db' => 'remark', 'dt' => 'remark' )
        );
        $data = $model->listsDatatables($columns);
        if($data){
            echo json_encode($data);
        }
    }

    public function queryNodeByJson()
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
        $tree = new \Org\Util\Tree();
        echo json_encode($tree->create($data));
    }

    public function queryNodeIdByJson()
    {
        $model = D('AuthAccess');
        $field = 'node_id';
        $map = 'role_id ='.I('id');
        $data = $model->lists($map,$field);
        echo json_encode($data);
    }

    public function save()
    {

        $model = D("AuthRole");

        $param['id'] = I('id');
    	$param['name'] = I('name');
	    $param['status'] = I('status');
        $param['remark'] = I('remark');

        return $model->save($param);

	}

    public function saveConfig()
    {

        if(I('nodeIdList') != '' && I('id') != '') {
            $model = D('AuthAccess');
            $node_id = I('id');
            $node_field = I('nodeIdList');
            $model->update($node_id,$node_field);

            echo json_encode(C('WARNING_MSG'));
        } else {
            echo json_decode(C('ERROR_MSG'));
        }
    }

    public function del()
    {
        $id = I("id",0);
        $model = D('AuthRole');
        if($model->del($id)) {
            $this->success();
        } else {
            $this->error();
        }
    }
}
