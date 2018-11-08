const serverURL = 'backend.php';

var room;                       // 房号
var nickname;                   // 昵称
var ready = false;              // 在用户确认了房号和昵称信息之后为true
var localMessageCount = 0;      // 本地接收的消息数量
var serverMessageCount = 0;     // 服务器上消息的总数

// 当页面加载完成时进行初始化工作
$(function() {
	// 从查询字符串中获取房间号和用户房间号和昵称等信息
	const params = new URLSearchParams(document.location.search);
	room = params.get('room')
	nickname = params.get('nickname');
	
	$('#room').val(room);
	$('#nickname').val(nickname);
	
	// 若用户在会话中改变了房间号则暂停从服务器获取数据，等待用户确认
	$('#room').change(pause);
	$('#nickname').change(pause);
});

// 将网页设置为“等待用户确认信息”状态
function pause() {
	ready = false;
	$('#message').prop('disabled', true);
	$('#submit').html('加入房间');
}

// 将网页设置为“正常工作”状态
function start() {
	if (!($('#room').val() && $('#nickname').val())) {
		alert('房间号和昵称都是必填项目哟');
	}
	if (room != $('#room').val()) {
		$('#dialog').empty();
		localMessageCount = 0;
	}  // 若更改了房间号则清除历史聊天记录
	room = $('#room').val();
	nickname = $('#nickname').val();
	$('#message').prop('disabled', false);
	$('#submit').html('发送消息');
	ready = true;
	setTimeout(updateMessageFromServer, 1000);  // 定时从服务器端获取消息
}

// 当Submit按钮被按下
function onClickSubmitButton() {
	if (ready && $('#message').val()) {
		sendMessage();
	}
	if (!ready) {
		start();
	}
}

// 发送消息到服务器端
function sendMessage() {
	if (ready) {
		var data = {
			room: room,
			nickname: nickname,
			message: $('#message').val()
		};
		$.post(serverURL, data);
		$('#message').val('');
	}
}

// 从服务器端更新消息总数
function updateMessageFromServer() {
    if (ready) {
		var data = {
			room: room,
			nickname: nickname,
			localMessageCount: localMessageCount
		};
		$.post(serverURL, data, function(response, status) {
			if (status == 'success') {
				$('#status').html('共计' + String(response) + '条消息');
				serverMessageCount = Number(response);
			} else {
				$('#status').html('通信质量不佳');
			}
			getNextMessage();  // 尝试获取下一条没有同步到服务器端的消息
		});
	}
}

// 尝试从服务器获取下一条尚未下载到本地的消息
function getNextMessage() {
	if (ready) {
		if (localMessageCount < serverMessageCount) {  
			// 若本地消息少于服务器上的消息，从服务器上获取新的消息
			var data = {
				room: room,
				nickname: nickname,
				index: localMessageCount + 1
			}
			$.post(serverURL, data, function(response, status) {
				if (status == 'success') {
					$('#dialog').append('<p>' + String(response) + '</p>');
					localMessageCount++;
					getNextMessage();
				}
			});
		}
		else {
			// 若本地消息与服务器上消息数量相同，定时询问服务器是否有新的消息
			setTimeout(updateMessageFromServer, 1000);
		}
	}
}
