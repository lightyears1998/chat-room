var room;                       // 房号
var nickname;                   // 昵称
var active;                     // 指示网页是否处于与服务器正常通信的状态或暂停状态
var crawler;                    // MessageCrawler实例

// 页面初始化工作
$(function() {
	// 从查询字符串中获取房间号和用户房间号和昵称等信息
	const params = new URLSearchParams(document.location.search);
	room = params.get('room'), nickname = params.get('nickname'); 
	$('#room').val(room), $('#nickname').val(nickname);
	
	crawler = new MessageCrawler();
	active = false;  // 将网页状态置为暂停态
});

// 注册事件处理函数
$(function() {
	// 若用户在会话中改变了房间号则将网页置为暂停态，等待用户确认
	$('#room').change(stop);
	$('#nickname').change(stop);
});

// 当Submit按钮被按下
function onClickSubmitButton() {
	if (active && $('#message').val()) {
		crawler.sendMessage($('#message').val());
	}
	if (!active) {
		start();
	}
}

// 开始与服务器进行通讯
function start() {
	active = true;
	crawler = new MessageCrawler('backend.php', { room: $('#room').val(), nickname: $('#nickname').val() });
	crawler.handleReceivedMessage = function (message) {
		$('#dialog').append('<p>' + message + '</p>');
	};
	crawler.start();
	$('#message').prop('disabled', false);
	$('#submit').html('发送消息');
}

// 暂停与服务器的通信
function stop() {
	active = false;
	crawler.stop();
	$('#message').prop('disabled', true);
	$('#submit').html('加入房间');
}
