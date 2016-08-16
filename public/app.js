$(function(){
    String.prototype.replaceAll = function(search, replacement) {
        var target = this;
        return target.replace(new RegExp(search, 'g'), replacement);
    };

	var socket = io('/vip');
	socket.connect();
	var $messageForm = $('#message-form'),
        $messageChat = $('#messageChat'),
        $message = $('#message'),
        $chat = $('#chat'),
        $userForm = $('#userRegister'),
        $username = $('#username'),
        $userList = $('#users'),
        currentTabActiveState = true,
        notificationCounter = 0,
        defaultTitle = $(document).find('title').text(),
        notificationSound = new Audio('/static/notif-sound.wav'),
        titleInterval;

	var ioChat = {
		init: function(){
			this.connected();
			this.messageForm();
			this.userForm();
			this.userListUpdate();
			this.newMessage();
            this.leaveRoom();
			this.clearChat();
            helpers.isActiveTab();
		},
		connected: function(){
			socket.on('connected', function(messagesArray){
                //print all msg
				for(var single in messagesArray){
                    helpers.appendNewMessage(messagesArray[single], socket.username === messagesArray[single].author );
                }
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
					if(data === true){
						socket.currentRoom = $userForm.find('#room').val();
                        socket.username = $username.val();
						self.showMessageForm();
                        $('.error-msg').hide();
					}else{
						$('.error-msg').show();
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
                console.log(socket.username);
                helpers.appendNewMessage(data, socket.username === data.author);

                //scroll to the bottom
				var element = document.getElementById("chat");
				element.scrollTop = element.scrollHeight;

                //notify if not active
                if(currentTabActiveState === false){
                    helpers.activateNotification();
                    //play sound
                    notificationSound.play();
                }


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
        isActiveTab: function(){
            //check if current tab is active
            // Set the name of the hidden property and the change event for visibility
            var hidden, visibilityChange;
            if (typeof document.hidden !== "undefined") { // Opera 12.10 and Firefox 18 and later support
                hidden = "hidden";
                visibilityChange = "visibilitychange";
            } else if (typeof document.mozHidden !== "undefined") {
                hidden = "mozHidden";
                visibilityChange = "mozvisibilitychange";
            } else if (typeof document.msHidden !== "undefined") {
                hidden = "msHidden";
                visibilityChange = "msvisibilitychange";
            } else if (typeof document.webkitHidden !== "undefined") {
                hidden = "webkitHidden";
                visibilityChange = "webkitvisibilitychange";
            }

            document.addEventListener(visibilityChange, function(){
                if(document[hidden]){
                    //console.log('NOT visible tab!');
                    currentTabActiveState = false;
                }else{
                    //console.log('Visible tab!');
                    currentTabActiveState = true;
                    helpers.deactivateNotification();
                }
                console.log(currentTabActiveState);
            }, false);
        },
        activateNotification: function(){
            notificationCounter++;
            var intervalHalf = 0;
                clearInterval(titleInterval);
                titleInterval = window.setInterval(function(){
                    intervalHalf = (intervalHalf ? false : true);
                if(intervalHalf){
                    helpers.changeSiteTitle(notificationCounter + ' new messages - kageChat');
                }
                else{
                    helpers.changeSiteTitle(defaultTitle);
                }
            },1000);

        },
        deactivateNotification: function(){
            notificationCounter = 0;
            clearInterval(titleInterval);
            this.changeSiteTitle(defaultTitle);

        },
        changeSiteTitle: function(titleValue){
            $(document).find('title').text(titleValue);
        },
        appendNewMessage: function(msgData, isSelf){
            var classes = {
                alert: 'alert alert-danger',
                info: 'alert alert-info',
                warning: 'alert alert-warning',
                normal: 'single-message well',
                self: 'self-msg',
                user: 'user-msg',

            },
                outputHTML = '',
                templateHTML = '<li class="{{elementClasses}}" role="alert"><strong>{{author}}:</strong>{{msg}}</li>',
                selfClass;
            if(isSelf === true){
                selfClass = classes.self; //if is send by yourself
            }
            else{
                selfClass = classes.user; //if is send by another user
            }

            if(msgData.type === 'info'){
                outputHTML = templateHTML.replaceAll('{{elementClasses}}', classes.info + ' ' + selfClass);
            }
            else if(msgData.type === 'danger'){
                outputHTML = templateHTML.replaceAll('{{elementClasses}}', classes.alert + ' ' + selfClass);
            }
            else if(msgData.type === 'warning'){
                outputHTML = templateHTML.replaceAll('{{elementClasses}}', classes.warning + ' ' + selfClass);
            }
            else{
                outputHTML = templateHTML.replaceAll('{{elementClasses}}', classes.normal + ' ' + selfClass);
            }
            outputHTML = outputHTML.replaceAll('{{author}}', msgData.author).replaceAll('{{msg}}', msgData.msg).replace(/(http:\/\/|https:\/\/|www\.)[^ <]+/g, function(match){
                return '<a href="' + match + '" target="_blank">' + match + '</a>';
            });
            $chat.append(outputHTML);
        }

	};
	ioChat.init();



});
