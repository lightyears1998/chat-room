// 依赖： JQuery

// 消息同步工具
function MessageCrawler(url = '', identity = {}) {
	this.url = url;                // 消息服务
	this.identity = identity;      // 给消息服务器发送请求时的传达的身份信息
	
	this.localMessageCoun;         // 本地接收的消息数量
	this.remoteMessageCount;       // 服务器端的消息总数
	
	this.active = false;           // 同步工具的启用状态
	this.timeoutId;                // setTimeout()返回的标识符
	
	// 启动同步
	this.start = function() {
		this.active = true;
		this.localMessageCount = 0;
		this.remoteMessageCount = 0;
		this.updateRemoteMessageCount();
	};
	
	// 停止同步
	this.stop = function() {
		this.active = false;
		clearTimeout(this.timeoutId);
	};
	
	// 从服务器更新消息总数
	this.updateRemoteMessageCount = function() {
		if (!this.active) return;
		
		let params = Object.assign(this.identity, { localMessageCount: this.localMessageCount });
		$.post(url, params, this.onRemoteMessageCountUpdated);
	}
	
	// 从服务器端更新消息数量之后的回调函数
	this.onRemoteMessageCountUpdated = function(response, status) {
		if (status == 'success') {
			this.serverMessageCount = Number(response);
			if (this.localMessageCount < this.serverMessageCount) {  // 若服务器端存在新消息，则从服务器端下载新消息
				this.getMessage();
			}
			else {  // 若服务器端无新消息，则等待一段时间后再次询问
				this.timeoutId = setTimeout(this.updateRemoteMessageCount, 1000);
			}
		}
		else { this.timeoutId = setTimeout(this.updateRemoteMessageCount, 1000); }
	}
	
	// 从服务器端顺序获取尚未下载到本地的消息
	this.getMessage = function () {
		if (!this.active) return;
		
		if (this.localMessageCount < this.remoteMessageCount) {
			let params = Object.assign(this.identity, { index: this.localMessageCount + 1 });
			$.post(url, params, onMessageReceived);
		}
		else {
			this.updateRemoteMessageCount();
		}
	}
	
	// 从服务器完成下载之后的回调函数
	this.onMessageReceived = function(response, status) {
		if (status == 'success') {
			this.localMessageCount++;
			this.handleNewMessage(response);
			this.getMessage();
		}
		else { this.timeoutId = setTimeout(this.updateRemoteMessageCount, 1000); }
	};
	
	// 接收到消息时的回调函数，应按需重载
	this.handleReceivedMessage = function(message) {
		throw '重载此方法以自定义收到新消息时的处理';
	}
	
	// 向服务器发送消息
	this.sendMessage = function (message) {
		let params = Object.assign(identity, {message: message});
		$.post(url, params);
	}
}
