CREATE OR REPLACE VIEW jlxh_v_sys_node AS
select `node`.`id` AS `id`,
`node`.`name` AS `name`,
`node`.`title` AS `title`,
`node`.`status` AS `status`,
`node`.`level` AS `level`,
`pnode`.`title` AS `ptitle`,
`node`.`pid` AS `pid` 
from (`jlxh_sys_node` `node` left join `jlxh_sys_node` `pnode` on((`node`.`pid` = `pnode`.`id`)));


CREATE OR REPLACE VIEW jlxh_v_sys_user AS
select `jlxh_sys_user`.`id` AS `id`,
`jlxh_sys_user`.`username` AS `username`,
`jlxh_sys_user`.`real_name` AS `real_name`,
`jlxh_sys_user`.`email` AS `email`,
`jlxh_sys_user`.`password` AS `password`,
`jlxh_sys_user`.`status` AS `status`,
`jlxh_sys_user`.`last_login_time` AS `last_login_time`,
`jlxh_sys_user`.`last_login_ip` AS `last_login_ip`,
`jlxh_sys_user`.`remark` AS `remark`,
`jlxh_sys_user`.`add_time` AS `add_time`,
`jlxh_sys_user`.`update_time` AS `update_time` 
from `jlxh_sys_user` where (isnull(`jlxh_sys_user`.`delete_time`) or (`jlxh_sys_user`.`delete_time` = '0000-00-00'));




