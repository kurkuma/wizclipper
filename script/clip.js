(function($){
    if(!WIZPlugin.Clip){
        WIZPlugin.Clip = {
            running: false
        };
        
        
        WIZPlugin.Clip.save = function(){
        	 chrome.windows.getCurrent(function(win) {
            	chrome.tabs.getSelected(win.id, function(tab) {
		    		chrome.tabs.sendRequest(tab.id, {hello: "ok"}, function(response) {  
		        		WIZPlugin.Clip.selection(response);
					});  
            	});
	        });
        };
        
     
        
        WIZPlugin.Clip.selection = function(extraContent){
            if(this.running){
                return false;
            }
            var content = document.getElementById("wiz_note_iframe").contentDocument,
            title = $("#wiz_note_title"),
            maxSize = {
                width: 650,
                height: 350,
                originWidth: 400
            },
            
            addBtnsListener = function(){
                var submit = $("#wiz_note_submit");
                submit.bind("click", function(){
                    var title = $("#wiz_note_title").val(),
                    content = document.getElementById("wiz_note_iframe").contentDocument.getElementsByTagName("html")[0].outerHTML,
                    data = {
                        "title": title,
                        "notecontent": content,
                        "noteid": "",
                        "sourceurl": location.href,
                        "importance": "0"
                    },
                    
                    port = chrome.extension.connect({name:"noteSubmit"});
                    port.postMessage(data);
                    document.getElementById("note_submit_message").innerText = "保存中,请稍后……";
                    port.onMessage.addListener(function(msg){
                        if(msg == true){
                        	document.getElementById("note_submit_message").innerText = "保存成功";
                        } else if(msg == false) {
                        	document.getElementById("note_submit_message").innerText = "未保存成功";
                        } else {
                        	document.getElementById("note_submit_message").innerText = "保存失败：" + msg;
                        }
                    });
                });
             },
            
            
            selection = extraContent.data;
            
            addBtnsListener();
            
            title.val(extraContent.title);
            content.open("text/html", "replace");
			content.write(selection);
			content.close();
            
            //chrome content css script @@extension_id bug fix
            var id = chrome.i18n.getMessage("@@extension_id");
            
            WIZPlugin.Clip.running = true;
        };
    }
})(jQuery);