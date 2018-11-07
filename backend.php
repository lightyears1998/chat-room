<?php

if ($_REQUEST['room'] != null) {
	$room = hash('sha1', $_REQUEST['room']);  // 获取房间暗号对应Sha1值
	
	// 如果房间哈希不存在,创建房间并添加第一条消息
	if (!file_exists($room)) {
		mkdir($room);
		$count = fopen($room.'/totalMessageCount', 'w');
		fwrite($count, 1);
		fclose($count);
	}
}
