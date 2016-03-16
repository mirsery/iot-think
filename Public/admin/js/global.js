// JavaScript Document
$(function() {
    $(".selectlist ul li").hover(function() {
        $(this).addClass("cur_tr");
    }, function() {
        $(this).removeClass("cur_tr");
    });
    //取消
    $(".dels").live('click', function() {
        $(this).parent().remove();
    });

    //保存新增项
    $(".ok").live('click', function() {
        var btn = $(this);
        var input_str = btn.parent().find('input').val();
        if (input_str == "") {
            jNotify("请输入类别名称!");
            return false;
        }
        $.post("post.php", {action: 'add', title: input_str}, function(data) {
        if (data.success == 1) {
                var li = "<li rel='" + data.id + "'><span class='del' title='删除'></span><span class='edit' title='编辑'></span><span class='txt'>" + data.title + "</span></li>";
                $("#catalist").append(li);
                btn.parent().remove();
                jSuccess("恭喜，操作成功!");
            } else {
                jNotify("出错了！");
                return false;
            }
    }, "json")
    });

    //删除项
    $(".del").live('click', function() {
        var btn = $(this);
        var id = btn.parent().attr('rel');
        var URL = "post.php";
        hiConfirm('您确定要删除吗？', '提示', function(r) {
            if (r) {
                $.ajax({
                    type: "POST",
                    url: URL,
                    data: "id=" + id+"&action=del",
                    success: function(msg) {
                        if (msg == 1) {
                            jSuccess("删除成功!");
                            btn.parent().remove();
                        } else {
                            jNotify("操作失败!");
                            return false;
                        }
                    }
                });
            }
        });
    });

    //编辑选项
    $(".edit").live('click', function() {
        $(this).removeClass('edit').addClass('oks').attr('title', '保存');
        $(this).prev().removeClass('del').addClass('cancer').attr('title', '取消');
        var str = $(this).parent().text();
        var input = "<input type='text' class='input' value='" + str + "' />";
        $(this).next().wrapInner(input);
    });
    //编辑处理
    $(".oks").live('click', function() {
        var input_str = $(this).parent().find('input').val();
        if (input_str == "") {
            jNotify("请输入类别名称!");
            return false;
        }
        var id = $(this).parent().attr("rel");
        var URL = "post.php";

        var btn = $(this);
        $.ajax({
            type: "POST",
            url: URL,
            data: "action=edit&title=" + input_str + "&id=" + id,
            success: function(msg) {
                if (msg == 1) {
                    jSuccess("编辑成功!");
                    var strs = "<span class='del' title='删除'></span><span class='edit' title='编辑'></span><span class='txt'>" + input_str + "</span>";
                    btn.parent().html(strs);
                } else {
                    jNotify("操作失败!");
                    return false;
                }
            }
        });
    });
    //取消编辑
    $(".cancer").live('click', function() {
        var li = $(this).parent().html();
        var str_1 = $(this).parent().find('input').val();
        var strs = "<span class='del' title='删除'></span><span class='edit' title='编辑'></span><span class='txt'>" + str_1 + "</span>";
        $(this).parent().html(strs);
        //alert(str);
    });
});

function addOpt() {
    var str = "<li><span class='dels' title='取消'></span><span class='ok' title='保存'></span><input type='text' class='input' /></li>";
    $("#catalist").append(str);
}