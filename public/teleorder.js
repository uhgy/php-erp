$(function(){

			//查询订单
			$("#findOrder").click(function(){
				//分页栏切换
				$('#pageOfList > li.active').removeAttr('class');
				$('#pageOfList > li > a[title$=1]').parent().attr('class', 'active');
				$('#startCallinDate').attr('value','');
				$('#endCallinDate').attr('value','');
				var formData = {
					action : "findOrder",
					teleNum : $("#teleNum").val(),
					orderNum : $("#orderNum").val(),
					recordOfService : $("#recordOfService").val(),
				};
				$.ajax({
					method : "GET",
					url : "getTele.php",
					data : formData,
				}).done( 
					function (data, textStatus){
					showData(data);
					$('#currentState').text('查找订单');
					//$("#txtHint").html(data);			
				});
			});


			//增加订单
			$("#addOrder").click(function(){
				//分页栏切换
				$('#pageOfList > li.active').removeAttr('class');
				$('#pageOfList > li > a[title$=1]').parent().attr('class', 'active');
				$('#startCallinDate').attr('value','');
				$('#endCallinDate').attr('value','');
				var formData = {					
					action : "addOrder",
					teleNum : $("#teleNum").val(),
					orderNum : $("#orderNum").val(),
					recordOfService : $("#recordOfService").val()
				};
				$.ajax({
					method : "POST",
					url : "getTele.php",
					data : formData,
				}).done(
				  function (data, textStatus){
					showData(data);
					if($('#teleInfoList >tr').size() != 0){
						alert('添加成功');
					}else{
						alert('添加失败');
					}
					$('#currentState').text('增加订单');					
				});
			});

			//业务种类下拉栏
			var  typeDropDown = '<div class="btn-group">' +
			   '<button type="button" class="btn btn-primary dropdown-toggle" id="valueOfService" data-toggle="dropdown">业务分类' +
			      '<span class="caret"></span>' +
			   '</button>' +
			   '<ul class="dropdown-menu" role="menu" aria-labelledby="dropdownMenu1" id="typeOfService">' +
			      '<li role="presentation">' +
			         '<a href="#">咨询</a>' +
			      '</li>' +
			      '<li role="presentation">' +
			         '<a href="#">投诉</a>' +
			      '</li>' +
			      '<li role="presentation">' +
			         '<a href="#">' +
			            '催单' +
			         '</a>' +
			      '</li>' +
			      '<li role="presentation">' +
			         '<a href="#">' +
			            '修改订单' +
			         '</a>' +
			      '</li>' +
				  '<li role="presentation">' +
			         '<a href="#">' +
			            '问题订单' +
			         '</a>' +
			      '</li>' +			      
			      '<li role="presentation">' +
			         '<a href="#">' +
			            '其他' +
			         '</a>' +
			      '</li>' +					      
			   '</ul>' +
			'</div>';


						//业务种类下拉栏
			var  stuffDropDown = '<div class="btn-group">' +
			   '<button type="button" class="btn btn-primary dropdown-toggle" id="nameOfStuff" data-toggle="dropdown">处理人' +
			      '<span class="caret"></span>' +
			   '</button>' +
			   '<ul class="dropdown-menu" role="menu" aria-labelledby="dropdownMenu1" id="listOfStuff">' +
			      '<li role="presentation">' +
			         '<a href="#">蔡方华</a>' +
			      '</li>' +
			      '<li role="presentation">' +
			         '<a href="#">鲍慧文</a>' +
			      '</li>' +
			      '<li role="presentation">' +
			         '<a href="#">梅娟</a>' +
			      '</li>' +
			      '<li role="presentation">' +
			         '<a href="#">沙亚琴</a>' +
			      '</li>' +
			      '<li role="presentation">' +
			         '<a href="#">童玲</a>' +
			      '</li>' +	
			      '<li role="presentation">' +
			         '<a href="#">相海双</a>' +
			      '</li>' +	
			      '<li role="presentation">' +
			         '<a href="#">潘俊</a>' +
			      '</li>' +	
			      '<li role="presentation">' +
			         '<a href="#">仇晓彬</a>' +
			      '</li>' +	
			      '<li role="presentation">' +
			         '<a href="#">还良俊</a>' +
			      '</li>' +	
			      '<li role="presentation">' +
			         '<a href="#">曹光晨</a>' +
			      '</li>' +	
			      '<li role="presentation">' +
			         '<a href="#">杨培</a>' +
			      '</li>' +				      			      			      			      			      			      				      
			   '</ul>' +
			'</div>';

			//更新订单
			$("#updateOrder").live("click", function(){	
				$('#currentState').text('更新订单');				
				if($(this).text() == "更新"){
					$(this).text("保存");
					//获取选中的一行
					$line = $(this).parent().siblings("td");
					$.each($line, function(key, val){
						var inner;
						//要取出需要更新一行里面每一列的文本
						if(key ==  3){
							//订单编号是一个链接，
							inner = $(val).children().text(); 													
						}else{
							inner = val.innerHTML;
						}

						//替换为输入框
						if(key == 4){
							$(val).wrapInner(typeDropDown)
							.find("#valueOfService")
								.html(inner+'<span class="caret"></span>');
						}else if(key == 5){
							$(val).html("<input type='text'></input>");
						}else if(key == 6){
							$(val).wrapInner(stuffDropDown)
							.find("#nameOfStuff")
								.html(inner+'<span class="caret"></span>');

						}else{ 
							$(val).wrapInner("<input type='text'></input>").children()
								.attr("value", inner);								
						}
					});
					$line.eq(0).children().attr("disabled", "true");
					$line.eq(1).children().attr("disabled", "true");
					$line.eq(7).children().attr("disabled", "true");
					$("td > button:contains('更新')").attr("disabled", "false");
					//业务种类下拉栏
					$('#typeOfService > li').live("click", function(){
						var valueOfService = $(this).children().text();
						$(this).parent().prev().html(valueOfService+'<span class="caret"></span>');
					});	
					//处理人下拉栏
					$('#listOfStuff > li').live("click", function(){
						var nameOfStuff = $(this).children().text();
						$(this).parent().prev().html(nameOfStuff+'<span class="caret"></span>');
					});	
				}else if($(this).text() == "保存"){
					$(this).text("更新");
					$("td > button").attr("disabled", "false");
					$line = $(this).parent().siblings("td");
					var res=[];
					var updateData;
					$.each($line, function(key, val){
						if(key == 4){
							//业务种类下拉栏
							res.push($('#valueOfService').text());
						}else if(key == 6){
							//人员下拉栏
							res.push($('#nameOfStuff').text());							
						}else{
							res.push($(val).children().attr("value"));
							//alert(res[key]);							
						}
					});
					var formData = {					
						action : "updateOrder",
						dateOfTele : res[1],
						teleNum : res[2],
						orderNum : res[3],
						typeOfService : res[4],
						recordOfService : res[5],
						nameOfStuff :res[6],
					};
					//alert(JSON.stringify(formData));
					console.log(formData);
					$.ajax({
						method : "POST",
						url : "getTele.php",	
						data : formData,
					}).done(
					  function (data, textStatus){
					  	// alert(data);
						showData(data);					
						//$("#txtHint").html(data);
					});
				};
			});
		

			//日历被点击时获取当天电话咨询，导出excel起始日期
			$('#startCalender').datetimepicker({
			        language:  'zh-CN',
			        weekStart: 1,
			        todayBtn:  1,
					autoclose: 1,
					todayHighlight: 1,
					startView: 2,
					minView: 2,
					forceParse: 0,
					// initialDate : new Date()
		    	}).on('changeDate', function(ev){
		    		// alert(ev);
		    		// var str;
		    		// $.each(ev, function(key, val){
		    		// 	str += (key+'='+val+'\n');
		    		// });
		    		// alert(ev.date.valueOf());
					var dateOfTele;
			    if (ev){
			        dateOfTele = new Date(ev.date).toISOString().slice(0, 10);
			        // $('#startDateVal').attr('value',dateOfTele);
			        //.toLocaleDateString();
			    	// alert(dT.toISOString().slice(0, 10));
			    	// alert(dateOfTele);
			    }
			    var formData = {			    	
					action : "findOrderByDate",
					dateOfTele : dateOfTele
				};
				$('#currentState').text('日期：'+ dateOfTele);
				$.ajax({
					method : "GET",
					url : "getTele.php",
					data : formData,
				}).done(
					function (data, textStatus){
					showData(data);
				});
			});


		    //导出excel截止日期
			$('#endCalender').datetimepicker({
			        language:  'zh-CN',
			        weekStart: 1,
			        todayBtn:  1,
					autoclose: 1,
					todayHighlight: 1,
					startView: 2,
					minView: 2,
					forceParse: 0
		    	}).on('changeDate', function(ev){
					var dateOfTele;
				    if (ev){
				        dateOfTele = new Date(ev.date).toISOString().slice(0, 10);
				        $('#endDateVal').attr('value',dateOfTele);
				    }				
				    var startCallinDate = $('#startCallinDate').attr('value');
					var endCallinDate = $('#endCallinDate').attr('value');
					// console.log(startCallinDate+" "+endCallinDate);
					if(startCallinDate == "" || endCallinDate == "" || startCallinDate > endCallinDate){
						alert("日期设置有问题");
					}else{
					    var formData ={
							action : "findBeforeDate",
							startCallinDate : startCallinDate,
							endCallinDate : endCallinDate,
						};
						$.ajax({
							method : "GET",
							url : "getTele.php",
							data : formData,
						}).done(
							function (data, textStatus){
								// console.log(data.length);
								showData(data);
							});
					}									
			});	

			//导出列表excel
			$("#exportExcel").click(function(){
				var startCallinDate = $('#startCallinDate').attr('value');
				var endCallinDate = $('#endCallinDate').attr('value');
				// console.log(startCallinDate+" "+endCallinDate);
				if(startCallinDate == "" || endCallinDate == "" || startCallinDate > endCallinDate){
					alert("日期设置有问题");
				}else{
					var formData ={
					action : "exportExcel",
					startCallinDate : startCallinDate,
					endCallinDate : endCallinDate,
					};
					$.ajax({
						method : "GET",
						url : "getTele.php",
						data : formData,
					}).done(
						function (data, textStatus){
							// alert('ok');
								if(confirm('确定要打印从'+startCallinDate
									+'号到'+endCallinDate+'号的'+data+'条数据吗？')){
							        // 删除某某
							        location.href = './downloadExcel.php';
							        return true;
							    }else{
							    	return false;
							 	}
						});					
				}			
			});

			// $('#test').click(function(){
			// 	location.href = './downloadExcel.php';
			// })

	  //   	//点击一个订单时显示该电话对应的所有订单
			// $('#teleInfoList > tr > td:nth-child(3)').live("click", function(){
			// 	var teleNum = $(this).text();

			// 					// alert(teleNum);
	  //   // 		var str;
	  //   // 		$.each($(this), function(key, val){
	  //   // 			str += (key+'='+val+'\n');
	  //   // 		});
			// 	 // alert(str);
			// 	var formData ={					
			// 		action : "findOrderByTele",
			// 		teleNum : teleNum
			// 	};
			// 	$('#currentState').text('电话：'+ teleNum);
			// 	$.ajax({
			// 		method : "GET",
			// 		url : "getTele.php",
			// 		data : formData,
			// 	}).done(
			// 		function (data, textStatus){
			// 			// showData(data);
			// 				// window.location.href="main.html?teleNum="+teleNum;						
			// 				showData(data);
			// 		});
			// });
	
			
			//分页页数设置和响应
			var  options = {
	                size:"middle",
                	bootstrapMajorVersion:3,
	                currentPage: 1,
	                numberOfPages: 5,
	                totalPages: 65535,

	                onPageChanged: function(e,oldPage,newPage){
	                	var action;
	                	var startCallinDate = $('#startCallinDate').attr('value');
	                	var endCallinDate = $('#endCallinDate').attr('value'); 
	                	if(startCallinDate != '' && endCallinDate != ''){
	                		// action = 'exportExcel';
							var formData ={
												pageNum : newPage,
												action : "findBeforeDate",
												startCallinDate : startCallinDate,
												endCallinDate : endCallinDate,
											};	                		
	                	}else if(startCallinDate!= ''){
	                		// action = 'findOrderByDate';
	                		var formData = {
												pageNum : newPage,					
												action : "findOrderByDate",
												dateOfTele : startCallinDate
											};                		
	                	}else if($('#currentState').text().indexOf('电话') != -1){
											var formData = {
												pageNum : newPage,					
												action : "findOrderByTele",
												teleNum : $('#currentState').text().substr(3)
											}
	                	}else{
	                		var formData = {
												pageNum : newPage,					
												action : "findOrder",
											}
	                	}
	                	console.log(formData);
										$.ajax({
											method : "GET",
											url : "getTele.php",
											data : formData,
										}).done(
											function (data, textStatus){
												// console.log(data);
												showData(data, newPage);
											});
            			}
	            };

	        $('#pageOfList').bootstrapPaginator(options);

	        $('#teleInfoList > tr > td >a').live("click", function(){
	        	// alert($(this).text());
	        	$('#orderNumOfForm').text($(this).text());
	        	$("#toBackendForm").submit();	
	        });
		});

		
		$(function(){
			$("#findOrder").click();
			// $('#')
		});

		
		//显示数据列表
		function showData(data, pageNum){
			if(!arguments[1]) pageNum = 1;
			$("#teleInfoList").empty();
			// var pageOfList = arguments[1] ? arguments[1] : 1;
			 console.log(data);
			if(data != "nothing"){
				var  allTeleInfo = $(eval ("(" + data + ")"))[0].data;
				// console.log(allTeleInfo);
				var infoNum = allTeleInfo.length;
				// console.log(infoNum);
				for(var i = 0; i < infoNum; i++){
					var orderPerPage = 20;
					var contentOfTbody = 	"<tr>" +
							"<td>"+ parseInt(i + 1 + orderPerPage * (pageNum -1)) + "</td>" +
							"<td>" + allTeleInfo[i].dateOfTele + "</td>" + 
							"<td>" + allTeleInfo[i].teleNum + "</td>" +
							"<td><a>" + allTeleInfo[i].orderNum + "</a></td>" +
							"<td class='typeDropDown'>" + allTeleInfo[i].typeOfService + "</td>" + 
							"<td class='col-lg-2'>" + allTeleInfo[i].recordOfService + "</td>" + 
							"<td>" + allTeleInfo[i].nameOfStuff + "</td>" +
							"<td>" + allTeleInfo[i].dateOfLastEdit + "</td>" +
							"<td><button class='btn btn-primary' id='updateOrder' >更新</button></td>" +
						"</tr>";
					$("#teleInfoList").append(contentOfTbody);
				}
				// $("#teleNum").val("");
				// $("#orderNum").val("");
				// $("#recordOfService").val("");
				if(infoNum != 0){
					//alert(allTeleInfo[0].dateOfTele);
				}

			}else{
				// $("#txtHint").html(data);
			}	
		}
