var room;  // 房号
var nickname;  // 昵称

// 初始化页面
// 从查询字符串中获取房号和昵称等信息
// 将按钮的状态置为“使用昵称并加入房间”
$(function() {
	const params = new URLSearchParams(document.location.search);
	
	room = params.get('room')
	nickname = params.get('nickname');
	
	$('#room').val(room);
	$('#nickname').val(nickname);
	$('#submit').html('使用昵称并加入房间');
});

// 当Submit按钮被按下
function onClickSubmit() {
	sendMessage();
	$('#status').load('backend.php?serial=123456');
}

// 生成房间编号
function generateRoomId() {
    
}

// 检查房间编号的有效性
function checkRoomId() {
    return false;
}

// 发送消息到服务器端
function sendMessage() {
	
}

// 从服务器端请求数据
function requestMessage() {
    
}
