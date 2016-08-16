$(function(){
	var socket = io('/vip');
	socket.connect();
	var $messageForm = $('#message-form'),
        $messageChat = $('#messageChat'),
        $message = $('#message'),
        $chat = $('#chat'),
        $userForm = $('#userRegister'),
        $username = $('#username'),
        $userList = $('#users');

	var ioChat = {
		init: function(){
			this.connected();
			this.messageForm();
			this.userForm();
			this.userListUpdate();
			this.newMessage();
            this.leaveRoom();
			this.clearChat();
		},
		connected: function(){
			socket.on('connected', function(data){
				$chat.append(data);
			});
		},
		messageForm: function(){
			//messageForm
			$messageForm.submit(function(e){
				e.preventDefault();
				socket.emit('send message', $message.val());
				$message.val('').focus();
			});
		},
		userForm: function(){
            var self = this;
			$userForm.on('submit', function(e){
				e.preventDefault();
				socket.emit('new user', {username: $username.val(), selectedRoom: $userForm.find('#room').val()}, function(data){
					if(data){
						socket.currentRoom = $userForm.find('#room').val();
						self.showMessageForm();
					}
				});
			});
		},
		userListUpdate: function(){
			socket.on('update users', function(data){
				var printHTML = '';
				//clear list
				$userList.html('');
				for(var i = 0; i < data.length; i++){
					printHTML += '<li class="list-group-item">' + data[i] + '</li>';
				}
				$userList.html(printHTML);
			});
		},
		newMessage: function(){
			socket.on('new message', function(data){
				//check if there is /code at the beggining
				if(data.type === 'message'){
					data.type = helpers.checkMessageType(data.msg);
					//cut beggining command if supported
					if(data.type !== 'message'){
						data.msg = helpers.cutMessageCode(data.msg);
					}

				}

				if(data.type === 'info'){
					$chat.append('<li class="alert alert-info" role="alert"><strong>'+data.author+':</strong>' + data.msg + '</li>');

				}
				else if(data.type === 'danger'){
					$chat.append('<li class="alert alert-danger" role="alert"><strong>'+data.author+':</strong>' + data.msg + '</li>');
				}
				else if(data.type === 'warning'){
					$chat.append('<li class="alert alert-warning" role="alert"><strong>'+data.author+':</strong>' + data.msg + '</li>');
				}
				else{
					$chat.append('<li class="single-message well"><strong>'+data.author+':</strong>' + data.msg + '</li>');
				}
				var element = document.getElementById("chat");
				element.scrollTop = element.scrollHeight;
			});
		},
        leaveRoom: function(){
            var self = this;
            $('#leave-room').on('click', function(e){
                e.preventDefault();
                socket.emit('leave room', socket.currentRoom);
                self.showIntroForm();
                
            });
        },
        showIntroForm: function(){
            $messageChat.hide();
            $userForm.show();
        },
        showMessageForm: function(){
            $userForm.hide();
            $messageChat.show();
        },
		clearChat: function(){
			socket.on('clear chat', function(){
				$chat.html('');
				$userList.html('');
			});
		},
	};

	var helpers = {
		checkMessageType: function(message){
			var codes = {
				warning: new RegExp('^/warning'),
				danger: new RegExp('^/alert'),
				info: new RegExp('^/info')
			};


			if(message.match(codes.warning)) return 'warning';
			if(message.match(codes.danger)) return 'danger';
			if(message.match(codes.info)) return 'info';
			else return 'message';
		},
		cutMessageCode: function(message){
			return message.replace(/\/\w+/, '');
		},
	};
	ioChat.init();

});	