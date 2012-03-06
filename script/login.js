(function($){
    if(!window.WIZPlugin){
        window.WIZPlugin = {};
    }
	WIZPlugin.autoLogin = function() {
		chrome.cookies.get({url:"http://service.wiz.cn/web", name: "note_auth"}, function(cookie){
			if(cookie) {
				var info = cookie.value;
				var split_count = info.indexOf("*md5");
				var loginParam = new Object();
				loginParam.client_type = "web3";
				loginParam.api_version = 3;
				loginParam.user_id = info.substring(0, split_count);
				loginParam.password = info.substring(split_count + 1);				
				WIZPlugin.login(loginParam);
			}
		});
	}

	WIZPlugin.login = function(loginParam){
	    var url = "http://service.wiz.cn/wizkm/xmlrpc";
	    var sending = xmlrpc.writeCall("accounts.clientLogin", [loginParam]);
	    var port = chrome.extension.connect({name:"login"});
        port.postMessage(sending);
        port.onMessage.addListener(function(msg){
            if(msg == true){
            	if(keep_passoword.checked) {
            		chrome.cookies.set({
            			url:"http://service.wiz.cn/web", 
            			name: "note_auth",
            			value: user_id.value + "*md5." + hex_md5(password.value)
            		});
            	}
            	$("#wiz_login").css("display" , "none");
            	$("#wiz_clip_detail").css("display" , "");
            	WIZPlugin.Clip.save();
            }
            else if(msg == false) {
            	$("#wiz_login").css("display" , "");
            	$("#wiz_clip_detail").css("display" , "none");
            	document.getElementById("div_error_validator").innerText = "network is wrong"
            }
            else  {
            	$("#wiz_login").css("display" , "");
            	$("#wiz_clip_detail").css("display" , "none");
            	document.getElementById("div_error_validator").innerText = msg;
            }
   		});
	}
	
	WIZPlugin.doLogin = function() {
		var loginParam = new Object();
		loginParam.client_type = "web3";
		loginParam.api_version = 3;
		loginParam.user_id = user_id.value;
		loginParam.password = "md5." + hex_md5(password.value);
		WIZPlugin.login(loginParam);
	}

})(jQuery);