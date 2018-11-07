<?php

/** 服务器端文件结构
 *
 * /- 根目录
 *  | hash_room - 房号对应的sha1值；
 *              | message_count - 服务器上保存消息的总数
 *              | 1 - 第一条消息
 *              | 2 - 第二条消息
 *              | ...
**/

// 请求中必须具备房号和昵称信息，丢弃没有房号信息的请求
if (isset($_REQUEST['room']) && isset($_REQUEST['nickname'])) {
	$hash_room = hash('sha1', $_REQUEST['room']);  // 获取房号对应sha1值
	$nickname = htmlspecialchars($_REQUEST['nickname']);
	
	// 如果房间哈希不存在,创建房间并添加第一条消息
	if (!file_exists($hash_room) && mkdir($hash_room)) {
		// 创建保存消息总数的message_count文件,并将消息总数置为1
		file_put_contents("${hash_room}/message_count", 1);
		
		// 生成建立房间的欢迎消息
		$date = date('Y-m-d h:i:sa');
		$content = "<b>${nickname}</b> <i>${date}</i> 创建房间";
		
		// 将欢迎消息写入1号文件
		file_put_contents("${hash_room}/1", $content);
	}
	
	// 向客户端返回服务器端的消息总数
	if (isset($_REQUEST['localMessageCount'])) {
		$message_count = file_get_contents("${hash_room}/message_count");
		print($message_count);
	}
	
	// 向客户端返回对应序号的消息
	if (isset($_REQUEST['index'])) {
		// 从文件中加载消息并返回给客户端
		$index = intval($_REQUEST['index']);
		$content = file_get_contents("${hash_room}/${index}");
		print($content);
	}
	
	// 将客户端发送的消息存入服务器
	if (isset($_REQUEST['message'])) {
		$message_count = intval(file_get_contents("${hash_room}/message_count")) + 1;
		file_put_contents("${hash_room}/message_count", $message_count);
		
		$date = date('Y-m-d h:i:sa');
		$message = htmlspecialchars($_REQUEST['message']);
		$content = "<b>${nickname}</b> <i>${date}</i> ${message}";
		file_put_contents("${hash_room}/${message_count}", $content);
	}
}
