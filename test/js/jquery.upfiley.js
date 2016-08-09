jQuery.extend({
	iframe:null,
	iform:null,
	upNum:0,
	upFiley: function(inputFile,options) {
		//配置属性
		this.url="";
		this.params=null;
		this.hiddenInput=""
		this.dataType="json";
		this.init=null;
		this.success=null;
		this.error=null;
		var _this=this;
        if (options) {  
            for (var k in options) {
            	this[k]=options[k]
            }  
        }
        if (this.params) {  
            for (var i in this.params) {
            	this.hiddenInput+='<input type="hidden" name="' + i + '" value="' + this.params[i] + '" />'
            }  
        }

		//创建上传表单
		if($(inputFile).length<2){
			var fileName=$(inputFile).attr("name");
			$(inputFile).wrap('<form action='+this.url+' method="post" style="display:none;" id="form_'+fileName+'" target="iframe_up" enctype="multipart/form-data"></form>');
			var iform=$('#form_'+fileName).append(this.hiddenInput);
			$.iform=iform;
		}else{
			$.each($(inputFile),function(i,n){
				var fileName=$(n).attr("name");
				$(n).wrap('<form action='+this.url+' method="post" style="display:none;" id="form_'+fileName+'" target="iframe_up" enctype="multipart/form-data"></form>');
			})
		}
		$(inputFile).on("change", function ( eo ) {
			$.upNum=0;
			_this.createIframe();
		})
		this.createIframe=function(){
	        //创建iframe并添加事件
	        $.iframe=$('<iframe name="iframe_up"  style="display: none"></iframe>').insertBefore($.iform).on("load", function (e) {
				$.upNum++;
	            var r = this.contentWindow.document.body.innerHTML;
	            var cons=$(this).contents();
	            var contents = $(this).contents().get(0);
	            var data = $(contents).find('body').text();
	            if(data!=""){
	                if ('json' == _this.dataType) {
	                    data = window.eval('(' + data + ')');
	                    _this.success(data);
	                }
	            }else if($.upNum<=2){
	            	//此处针对IE8的处理
	            	setTimeout(function(){
	            		_this.createIframe();
	            	},200);	            	
	            }else{
	            	_this.error("没有返回任何数据内容");
	            }
	            //删除自身
                $(this).unbind('load');
                $(this).remove();
	        });
	        //初始化
	        if(_this.init)_this.init(eo);
	        //提交数据表单
	        try{
	        	$.iform.submit();
	        }catch(e){
	        	if(_this.error)_this.error(e);
	        }
		}
		//手动发送数据事件
		this.upData=function(formId){
			if(arguments[0]){
				$(formId).submit();
			}else{
				$.iform.submit();
			}
		}
		return this;
	}
});