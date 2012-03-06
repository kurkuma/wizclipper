
$.ajaxSetup({
    dataType:'text',
    cache:false,
});

var token = null;
chrome.extension.onConnect.addListener(function(port){
    if(port.name == "noteSubmit"){
        port.onMessage.addListener(function(msg){
        	var regexp = /%20/g;
        	var title = msg.title;
        	var body = msg.notecontent;
        	var url = msg.sourceurl;
        	var requestData = "title=" + encodeURIComponent(title).replace(regexp, "+") 
        					+ "&token_guid=" + encodeURIComponent(token).replace(regexp, "+") 
        					+ "&body=" + encodeURIComponent(body).replace(regexp, "+");
            $.ajax({
                type:"POST",
                url:"http://service.wiz.cn/wizkm/a/web/post?",
                data:requestData,
                
                success:function(res){
                	var json = eval('(' + res + ')'); 
                	if(json.return_code != 200) {
                		port.postMessage(json.return_message);
                		return;
                	} 
                	port.postMessage(true)
                },
                error: function(res) {
                	port.postMessage(false);
                }
            });
        });
    }else if(port.name == "login"){
        port.onMessage.addListener(function(msg){
        	var url = "http://service.wiz.cn/wizkm/xmlrpc";
            $.ajax({
                type:"POST",
                url:url,
                data:msg,
                success:function(res){
                	var xmldoc = xmlrpc.createXml(res);
                	try {
                		var ret = xmlrpc.parseResponse(xmldoc);
                	} catch(err) {
                		port.postMessage(err);
                		return;
                	}
                	token = ret.token;
                    port.postMessage(true);
                },
                error: function(res) {
                	port.postMessage(false);
                }
            });
        });
    }
});

chrome.extension.onRequest.addListener(
	function(request, sender, sendResponse) {
		if(request.hello == "ok") {
			var content = getSelectedHTML();
			if(content == "") {
				var base = "<base href='" + window.location.protocol + "//" + window.location.host + "'/>";
				var page_content = document.getElementsByTagName("html")[0];
            	page_content = $(page_content).clone().find("script").remove().end().html();
				var index = page_content.indexOf("<head>");
				content = page_content.substring(0, index + 6) + base + page_content.substring(index + 6);
			}
			sendResponse({
				data:content,
				title: document.title
			});
		}
	}
);
getSelectedHTML = function(){
    var selection = document.getSelection();
    if (selection.rangeCount > 0){
        var range = selection.getRangeAt(0);
        var html = range.commonAncestorContainer.ownerDocument.createElement("div");
        html.appendChild(range.cloneContents());
        return $(html).html();
    } else 
    	return "";
}