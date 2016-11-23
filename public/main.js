'use strict';
const addList = function(){
    const write_list = $('#add').val();
    if(write_list === '') alert("Your empty string is not allowed!");
    else{
        $.ajax({
            url: "/add",
            method: "post",
            dataType: "json",
            data: JSON.stringify({
                message   : write_list,
                checked : false
            }),
            success: function (data) {
                getList();
                $('#add').val('');
            },
            error: function (err) {
                alert("Error, while adding");
            }
        });
    }
};
const getList = function(){
    const searchtext = $('#search').val();
    $.ajax({
        url: "/search",
        method: "get",
        dataType: "json",
        data: {searchtext: searchtext},
        success: function (data) {
            $("#todo-list").html('');
            data.items.forEach (function (item) {
                let Box = $("<li>" + item.message +
                    "<input id='"+item.id+"' onclick = 'update_list(this.id)' type ='checkbox'>" +
                    "<button onclick = 'delete_list(this.id)' id='"+item.id+"' class ='delete_button'> Delete </button></li>");
                let done_check = Box.find("input");
                done_check.prop("checked", item.checked);
                $("#todo-list").append(Box);
            });
        },
        error: function (err) {
            alert("Error!");
        }
    });
};

const update_list = function(todoItemID){
    $.ajax({
        url         : "/update/" + todoItemID,
        method        : 'put',
        dataType    : 'text',
        contentType : "application/json",
        success     : function(data) {
            getList();
        },
        error       : function(data) {
            alert('Error, while updating');
        }
    });

};

const delete_list = function(todoItemID){
    $.ajax({
        url     : "/delete/" + todoItemID,
        method : 'delete',
        dataType: 'text',
        success : function(data) {
            getList();
        },
        error: function (err) {
            alert("Error, while deleting");
        }
    });
};
getList();