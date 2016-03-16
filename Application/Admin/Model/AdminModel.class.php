<?php  
namespace Admin\Model;

use Think\Model;


/**
 * 所有Admin模块的父类
 */
class AdminModel extends Model
{

	protected $model;
	protected $view;


	/**
     * 封装了SSP类库的simple方法
     */
	public function listsDatatables($columns,$primaryKey = "id")
	{
		return \Org\Util\SSP::simple($_POST, C("SQL_DETAILS"), C('DB_PREFIX').$this->view->name, $primaryKey, $columns);
	}

	/**
     * 获取当前模型的数据列表
     */
	public function lists($map,$field = true)
	{
		return $this->view->field($field)->where($map)->select();
	}


	/**
     * 获取列表的数量
     */
	public function listsCount($map)
	{

		$list = $this->view
		->field('count(id) as count_id')
		->where($map)
		->select();

		return $list[0]['count_id'];
	}

	/**
     * 删除指定行的数据
     * @param int $id 表的主键名称
     * @param boolean $flag 是否实现软删除，默认为true
     */
	public function del($id, $softDelete = true)
	{
		if($softDelete) {
			$data['delete_time'] = date('Y-m-d H:i:s');
			$map['id'] = $id;
			$rs = $this->model->where($map)->save($data);
		} else {
			$rs = $this->model->delete($id);
		}

		return $rs;
	}


	/**
     * 保存数据
     */
	public function save($data)
	{
		return $this->model->add($data);
	}

	/**
     * 更新数据
     */
	public function update($id,$data)
	{
		$map['id'] = $id;
		return $this->model->where($map)->save($data);
	}

	protected function encodeDailyList($list)
	{
		$dailyList = array(
				"0" => 0,
				"2" => 0,
				"4" => 0,
				"6" => 0,
				"8" => 0,
				"10" => 0,
				"12" => 0,		
				"14" => 0,
				"16" => 0,
				"18" => 0,
				"20" => 0,
				"22" => 0,
			);

		for($i = 0 ; $i <count($list); $i++) {
			if($list[$i]['hour'] % 2 == 0)
				$dailyList[$list[$i]['hour'] - 0] += $list[$i]['count'];
			else
				$dailyList[$list[$i]['hour'] - 1] += $list[$i]['count'];
		}

		return $dailyList;
	}
}
