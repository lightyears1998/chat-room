const serverURL = 'backend.php';

var room;       // 房号
var nickname;   // 昵称
var localMessageConnt;          // 本地接收的消息总数
var remoteMessageCount;         // 服务器上消息的总数

// 初始化页面
// 从查询字符串中获取房号和昵称等信息
// 将按钮的状态置为“使用昵称并加入房间”
$(function() {
	const params = new URLSearchParams(document.location.search);
	
	room = params.get('room')
	nickname = params.get('nickname');
	localMessageConnt = 0;
	remoteMessageCount = 0;
	
	$('#room').val(room);
	$('#nickname').val(nickname);
	
	setInterval(updateRemoteMessageCount, 2000);
});

// 当Submit按钮被按下
function onClickSubmit() {
	room = $('#room').val();
	nickname = $('#nickname').val();
	
	sendMessage();
}

// 发送消息到服务器端
function sendMessage() {
	var data = {
		room: room,
		nickname: nickname,
		message: $('#message').val()
	};
	$.post(serverURL, data);
}

// 从服务器端更新消息总数
function updateRemoteMessageCount() {
    if (room != null && nickname != null) {
		var data = {
			room: room
		};
		$.post(serverURL, data, function(response, status) {
			console.log(status);
			if (status == 'success') {
				$('#status').html(String(response));
				remoteMessageCount = Number(response);
			} else {
				$('#status').html('通信质量不佳');
			}
			getMessage();
		});
	}
}

// 从服务器上获取消息
function getMessage() {
	if (localMessageConnt < remoteMessageCount) {
		var data = {
			room: room,
			count: localMessageConnt
		}
		$.post(serverURL, data, function() {
			$('#dialog').append('<p>' + String(data) + '</p>');
			getMessage()();
		});
	}
}
