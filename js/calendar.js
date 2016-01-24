$(function(){
	var $viewYear = $(".view-year"),
		$viewMonth = $(".view-month"),
		$actionPrevMonth = $(".prev-month"),
		$actionNextMonth = $(".next-month"),
		$actionPrevYear = $(".prev-year"),
		$actionNextYear = $(".next-year"),
		$goYear = $(".go-year"),
		$goMonth = $(".go-month"),
		$dateUl = $(".calendar-date ul"),
		viewYearVal = viewMonthVal = goYearVal = goMonthVal = 0,
		firstLoad = true;
	
	// 农历
	var lunarDate = {
		lunarInfo :   [0x04bd8,0x04ae0,0x0a570,0x054d5,0x0d260,0x0d950,0x16554,0x056a0,0x09ad0,0x055d2,   
					   0x04ae0,0x0a5b6,0x0a4d0,0x0d250,0x1d255,0x0b540,0x0d6a0,0x0ada2,0x095b0,0x14977,   
					   0x04970,0x0a4b0,0x0b4b5,0x06a50,0x06d40,0x1ab54,0x02b60,0x09570,0x052f2,0x04970,   
					   0x06566,0x0d4a0,0x0ea50,0x06e95,0x05ad0,0x02b60,0x186e3,0x092e0,0x1c8d7,0x0c950,   
					   0x0d4a0,0x1d8a6,0x0b550,0x056a0,0x1a5b4,0x025d0,0x092d0,0x0d2b2,0x0a950,0x0b557,   
					   0x06ca0,0x0b550,0x15355,0x04da0,0x0a5d0,0x14573,0x052d0,0x0a9a8,0x0e950,0x06aa0,   
					   0x0aea6,0x0ab50,0x04b60,0x0aae4,0x0a570,0x05260,0x0f263,0x0d950,0x05b57,0x056a0,   
					   0x096d0,0x04dd5,0x04ad0,0x0a4d0,0x0d4d4,0x0d250,0x0d558,0x0b540,0x0b5a0,0x195a6,   
					   0x095b0,0x049b0,0x0a974,0x0a4b0,0x0b27a,0x06a50,0x06d40,0x0af46,0x0ab60,0x09570,   
					   0x04af5,0x04970,0x064b0,0x074a3,0x0ea50,0x06b58,0x055c0,0x0ab60,0x096d5,0x092e0,   
					   0x0c960,0x0d954,0x0d4a0,0x0da50,0x07552,0x056a0,0x0abb7,0x025d0,0x092d0,0x0cab5,   
					   0x0a950,0x0b4a0,0x0baa4,0x0ad50,0x055d9,0x04ba0,0x0a5b0,0x15176,0x052b0,0x0a930,   
					   0x07954,0x06aa0,0x0ad50,0x05b52,0x04b60,0x0a6e6,0x0a4e0,0x0d260,0x0ea65,0x0d530,   
					   0x05aa0,0x076a3,0x096d0,0x04bd7,0x04ad0,0x0a4d0,0x1d0b6,0x0d250,0x0d520,0x0dd45,   
					   0x0b5a0,0x056d0,0x055b2,0x049b0,0x0a577,0x0a4b0,0x0aa50,0x1b255,0x06d20,0x0ada0],
		solarMonth :   [31,28,31,30,31,30,31,31,30,31,30,31],   

		nStr1 : ['日','一','二','三','四','五','六','七','八','九','十'],

		nStr2 : ['初','十','廿','卅','　'],

		lYearDays : function(y){
			 var i, sum = 348;   
			 for(i=0x8000; i>0x8; i>>=1){
				sum += (this.lunarInfo[y-1900] & i)? 1: 0;   
			 }   
			 return(sum+this.leapDays(y));   
		},

		leapDays : function(y){
			if(this.leapMonth(y)){
				return((this.lunarInfo[y-1900] & 0x10000)? 30: 29);
			 } 

			 else{
				return(0);
			 }      
		},

		leapMonth : function(y){
			return(this.lunarInfo[y-1900] & 0xf);
		},  

		monthDays : function(y,m){
			return((this.lunarInfo[y-1900] & (0x10000>>m))? 30: 29);  
		}, 

		Lunar : function(objDate){
			   var i, leap=0, temp=0;   
			   var baseDate = new Date(1900,0,31);   
			   var offset = (objDate - baseDate)/86400000;   
		   
			   var dayCyl = offset   +   40 ;  
			   var monCyl = 14;
		   
			   for(i=1900; i<2050 && offset>0; i++)   {   
					 temp = this.lYearDays(i)   
					 offset -= temp   
					 monCyl += 12   
			   }   
		  
			  if(offset<0) {   
					offset += temp;   
					i--;   
					monCyl -= 12;   
			  }   
		  
			  var year = i;   
			  var yearCyl = i-1864;   
		  
			  leap = this.leapMonth(i); //闰哪个月   
			  var isLeap = false;   
		  
			  for(i=1; i<13 && offset>0; i++)   {   
					//闰月   
					if(leap>0 && i==(leap+1) && isLeap==false){   
						--i; isLeap = true; temp = this.leapDays(year); 
					}   
					else{ 
						temp = this.monthDays(year, i); 
					}   
		  
					//解除闰月   
					if(isLeap==true && i==(leap+1)){
						isLeap = false   
					} 
					offset -= temp;   
					if(isLeap == false){
						monCyl ++ ; 
					}  
			 }   
		  
			 if(offset==0 && leap>0 && i==leap+1)   
				   if(isLeap)   
						 { isLeap = false; }   
				   else   
						 { isLeap = true; --i; --monCyl;}   
		  
			 if(offset<0){ 
				offset += temp; --i; --monCyl;
			 } 
			 
			 return {
				  month:i,
				  day :offset + 1 
			  }  
		},

		solarDays : function(y,m){
		   if(m==1){
			  return(((y%4 == 0) && (y%100 != 0) || (y%400 == 0))? 29: 28);   
		   }        
		   else{
			  return(this.solarMonth[m]);  
		   }     
		},

		cMonth : function(m){
			var s;       
			switch (m) {   
				  case 1:   
						s = '正月'; break;   
				  case 2:   
						s = '二月'; break;   
				  case 3:   
						s = '三月'; break;   
				  case 4:   
						s = '四月'; break;   
				  case 5:   
						s = '五月'; break;   
				  case 6:   
						s = '六月'; break;   
				  case 7:   
						s =  '七月'; break;   
				  case 8:   
						s = '八月'; break;   
				  case   9:   
						s = '九月'; break;   
				  case 10:   
						s = '十月'; break;   
				  case 11:   
						s = '十一月'; break;   
				  case 12:   
						s = '十二月'; break;   
				  default   :   
						break;   
			}   
			return(s);
		},

		cDay : function(d){
			var s;    
			switch (d) {   
				  case 10:   
						s = '初十'; break;   
				  case 20:   
						s = '二十'; break;   
						break;   
				  case   30:   
						s = '三十'; break;   
						break;   
				  default :   
						s = this.nStr2[Math.floor(d/10)];   
						s += this.nStr1[d%10];   
			}   
			return(s);  
		},

		lunarMonth : function(y,m,d){
			var sDObj=new Date(parseInt(y),parseInt(m)-1,parseInt(d))   
			var lDObj=this.Lunar(sDObj);  
			return this.cMonth(lDObj.month);
		},
		
		lunarDay : function(y,m,d){
			var sDObj=new Date(parseInt(y),parseInt(m)-1,parseInt(d))   
			var lDObj=this.Lunar(sDObj);  
			return this.cDay(lDObj.day);
		},
		
		// 获得 阴历/农历 年份 或者 星座 或者 属相
		lunarYear : function(y,m,d,type){
			var result = "";

			switch (type)
			{
				//星座
				case 'xz':
				  var XZDict = '摩羯宝瓶双鱼白羊金牛双子巨蟹狮子处女天秤天蝎射手';
				  var Zone = new Array(1222,122,222,321,421,522,622,722,822,922,1022,1122,1222);
		
				  if((100*m+d)>=Zone[0]||(100*m+d)<Zone[1])
					var i=0;
				  else
					for(var i=1;i<12;i++)
					{
						if((100*m+d)>=Zone[i]&&(100*m+d)<Zone[i+1])
						  break;
					 }
		
				  result = XZDict.substring(2*i,2*i+2)+'座';
				  break;
				
				//干支
				case 'gz':
				  var GZDict = ['甲乙丙丁戊己庚辛壬癸','子丑寅卯辰巳午未申酉戌亥'];
				  var i= y -1900+36 ;
				  result = GZDict[0].charAt(i%10)+GZDict[1].charAt(i%12);
				  break;
		        
		        //生肖
				case 'sx':
				  var SXDict = '鼠牛虎兔龙蛇马羊猴鸡狗猪';
				  result = SXDict.charAt((y-4)%12);
				  break;
			 }
		
			return result;
		}	
	}

	var calendar = {
		// 切换到上个月
		prevMonth : function(){
			viewMonthVal--;
			if(viewMonthVal == 0){
				viewYearVal--;
				viewMonthVal = 12;
			}
			calendar.dataChange("-30px");
		},
		// 切换到下个月
		nextMonth : function(){
			viewMonthVal++;
			if(viewMonthVal == 13){
				viewYearVal++;
				viewMonthVal = 1;
			}
			calendar.dataChange("30px");
		},
		// 切换到上一年
		prevYear : function(){	
			viewYearVal--;
			calendar.dataChange("-30px");
		},
		// 切换到下一年
		nextYear : function(){
			viewYearVal++;
			calendar.dataChange("30px");
		},
		dataChange : function(moveDis){
			this.monthSwitch();
			$dateUl.css("left",moveDis).animate({"left":0},"fast");
		},
		monthSwitch : function(){
			goYearVal = viewYearVal;  
			goMonthVal = viewMonthVal-1;
			// 判断当前月是否为一月，如果是，则上个月的数据切换到上一年，且月份为12月
			if(viewMonthVal==1){ 
				goYearVal--;
				goMonthVal=12;
			}
			$viewYear.html(viewYearVal);
			$viewMonth.html(viewMonthVal);
			$goYear.val(goYearVal);
			$goMonth.val(goMonthVal);
			this.showCalendar();	
		},
		showCalendar : function(){
			/* 当月第一天是星期几 - 上个月天数 - 当月天数
			 * 当月天数 - 上个月天数 - 下个月天数
		     * 每次切换清0
		     */
			var nowMonthInitDay = preMonthDays = nowuMonthDays= 0,
				nowMonthViewDayNum = prevMonthViewDayNum = nextMonthViewDayNum = 0,
				nowDate = new Date().getFullYear()+"-"+(new Date().getMonth()+1)+"-"+new Date().getDate(),
				t = this;
			
			viewYearVal = Number($viewYear.html()),
			viewMonthVal = Number($viewMonth.html());
			
			if(firstLoad){
				var calendarStr = "";
				for(var i=0;i<42;i++){
					calendarStr += "<li><a class='single-date' href='javascript:;'>";
					calendarStr += "<span class='solar'></span>";
					calendarStr += "<span class='lunar'></span>";
					calendarStr += "<b class='schedule'></b>"
					calendarStr += "</a></li>"
				}
				
				$dateUl.html(calendarStr);
			}
			firstLoad=false;

			if(viewMonthVal == 1){
				$goYear.val(viewYearVal-1);
				$goMonth.val(12);
			}
			else{	
				$goYear.val(viewYearVal);
				$goMonth.val(viewMonthVal-1);
			}
			
			goYearVal = Number($goYear.val());
			goMonthVal = Number($goMonth.val());
			
			nowMonthInitDay = new Date(viewYearVal+"/"+viewMonthVal+"/"+"01").getDay();//获得当月1号在星期几
			nowMonthInitDay = nowMonthInitDay == 0 ? 7 : nowMonthInitDay;
			
			preMonthDays = this.getMonthDays(goYearVal,goMonthVal); // 上个月天数
			nowuMonthDays = this.getMonthDays(viewYearVal,viewMonthVal); // 本月天数	
			prevMonthViewDayNum = preMonthDays-nowMonthInitDay+1;

			var $dateSingleDay = $(".calendar-date .single-date");
			
			$.each($dateSingleDay,function(index,item){
				$(item).removeClass("gray-date now-date festival-date");
				
				var thisSolar = $(this).find(".solar"),
					thisLunar = $(this).find(".lunar");
				
				if(index>=nowMonthInitDay-1&&index<nowuMonthDays+(nowMonthInitDay-1)){
					nowMonthViewDayNum++;
					thisSolar.html(nowMonthViewDayNum);
					if(viewYearVal+"-"+viewMonthVal+"-"+thisSolar.html()==nowDate){
						$(item).addClass("now-date");
					}
					t.setLunarAndFestival(viewYearVal,viewMonthVal,thisSolar.html(),$(item),thisLunar);
				}
				// 上一个月的最后几天
				else if(index<nowMonthInitDay-1){ 
					prevMonthViewDayNum++;
					$(item).addClass("gray-date");
					thisSolar.html(prevMonthViewDayNum);
					t.setLunarAndFestival(viewYearVal,viewMonthVal-1,thisSolar.html(),$(item),thisLunar);
				}
				// 下一个月的最前几天
				else{ 
					nextMonthViewDayNum++;
					$(item).addClass("gray-date");
					thisSolar.html(nextMonthViewDayNum);
					t.setLunarAndFestival(viewYearVal,viewMonthVal+1,thisSolar.html(),$(item),thisLunar);
				}
				// 判断除夕
				if(thisLunar.html()=="春节" && $dateSingleDay.eq(index-1)){
					$dateSingleDay.eq(index-1).addClass("festival-date").find(".lunar").html("除夕");
				}
			})	
			window.localStorage &&  dateSchedule();
		},
		//获取月天数  
		getMonthDays : function(year,month){ 
			var nowMonth = new Date(year+"/"+parseInt(month)+"/"+1);
			// 如果当月是12月，则年份加1，月份为0; 2013-12 -> 2013-13? 注意判断
			if(month==12){ 
				year++;
				month=0;
			}
			var nextMonth = new Date(year+"/"+(parseInt(month)+1)+"/"+1);	
			return parseInt(nextMonth-nowMonth)/(24*60*60*1000);
		},
		// 设置农历时间和节日
		setLunarAndFestival : function(y,m,d,dContainer,dLunar){ 
			dLunar.html(lunarDate.lunarDay(y, m, d));// 设置农历时间
			
			var thisSolarDate = m+"-"+d;
			var thisLunarDate = lunarDate.lunarMonth(y,m,d)+lunarDate.lunarDay(y,m,d);
			// 判断是否为节日
			if(this.festivalDay(thisSolarDate, thisLunarDate)){
				dContainer.addClass("festival-date");
				dLunar.html(this.festivalDay(thisSolarDate, thisLunarDate));
			}
			else if( $goYear.val() >= 2050 ){
				dLunar.html("");
			}
			else{
				dLunar.html(lunarDate.lunarDay(y, m, d));
			}	
		},
		festivalDay : function(iSolarDay,iLunarDay){
			var festivalDate = {"1-1" :"元旦", 
							"5-1":"五一", 
							"10-1":"国庆",
							"12-25":"圣诞",
							"正月初一":"春节",
							"正月十五":"元宵",
							"五月初五":"端午",
							"七月初七":"七夕",
							"八月十五":"中秋"
						   };
			for(var i in festivalDate){
				if(iSolarDay==i || iLunarDay==i){
					return festivalDate[i];
				}
			}
		},
		hoverDateLi : function(){
			$(".calendar-date").on("mouseover","li a",function(){
				$(this).addClass("hover-date");
			})
			$(".calendar-date").on("mouseout","li a",function(){
				$(this).removeClass("hover-date");
			})
		},
		clearAllSchedule : function(){
			$(".clear-schedule").bind("click",function(){
				if(window.localStorage){
					var isClear = confirm("清空日历所有日程安排");
					if(isClear){
						localStorage.clear();
						alert('清空完毕！');
						location.href = location.href;
					}
				}
				else{
					alert("当前浏览器不支持本地存储！");
				}	
			})
		},
		init : function(){
			$viewYear.html(new Date().getFullYear());
			$viewMonth.html(new Date().getMonth()+1);
			$actionPrevMonth.bind("click",this.prevMonth);
			$actionNextMonth.bind("click",this.nextMonth);
			$actionPrevYear.bind("click",this.prevYear);
			$actionNextYear.bind("click",this.nextYear);
			this.showCalendar();
			this.hoverDateLi();
			this.clearAllSchedule();
		}
	};		

	calendar.init();

	// localStorage 设置日程
	function dateSchedule(){
		var $calendarList = $(".calendar-date"),	
			$dateSingleDay = $(".calendar-date .single-date"),
			$dateLayer = $(".date-layer"),
			$contentTit = $(".content-box-tit"),
			$dateContent = $(".date-content"),
			$contentSave = $(".content-save"),
			$contentCancel = $(".content-cancel"),
			viewYearVal = Number($(".view-year").html());
		
		$.each($dateSingleDay,function(index,item){
			$(item).removeClass("schedule-date");
			var dataDate = "",
				thisSolarDate = $(item).find(".solar").html();
						
			if(!$(item).hasClass("gray-date")){
				dataDate=viewYearVal+"-"+viewMonthVal+"-"+thisSolarDate;	
			}
			else if($(item).hasClass("gray-date") && thisSolarDate>15){ // 上个月
				var prevY = viewYearVal,
					prevM = viewMonthVal-1;
				if(prevM == 0){
					prevM = 12;
					prevY -=1;
				}
				dataDate=prevY+"-"+prevM+"-"+thisSolarDate;		
			}
			else{  //下个月
				var nextY = viewYearVal,
					nextM = viewMonthVal+1;
				if(nextM == 13){
					nextM =1;
					nextY +=1;
				}
				dataDate=nextY+"-"+nextM+"-"+thisSolarDate;	
			}
			$(item).attr("data-date",dataDate);
		
			if (window.localStorage) {
			　 for (var i=0,len=localStorage.length; i<len; i++) {
			　　   var iKey = localStorage.key(i);
			　　   var iItem = localStorage[iKey];
				   if($(item).attr("data-date")==iKey){
						$(item).addClass("schedule-date");
				   }
			   }
			}	
		})
		
		$calendarList.on("click","li",function(){
			var index = $dateSingleDay.index($(this)),
				dataDate = $(this).find("a").attr("data-date");

			$dateLayer.show(); 
			$contentTit.html(dataDate+" 日程安排")
			$dateContent.attr("data-list",dataDate);
		
			var dateContentData = $dateContent.attr("data-list");
		
			if(localStorage[dateContentData]){
				$dateContent.html(localStorage[dateContentData]);
			}
			else{
				$dateContent.html("当前日期还未创建日程安排，点击创建！");
			}
		})
		
		// 如果为首次或默认编辑内容，则清空内容
		$dateContent.bind("click",function(){
			if($(this).html()=="当前日期还未创建日程安排，点击创建！"){
				$(this).html("");
			}
		})
		
		// 保存内容
		$contentSave.bind("click",function(){
			var dateContentData = $dateContent.attr("data-list"),
				dateContentText = $dateContent.html();
			// 清空内容时，pc端为空字符串，而wap页的内容则为 <br>。
			if($dateContent.html()!=="" && $dateContent.html()!=="<br>" && $dateContent.html()!="当前日期还未创建日程安排，点击创建！"){
				localStorage[dateContentData] = dateContentText;
				$.each($dateSingleDay,function(index,item){
					if($(item).attr("data-date")== dateContentData){
						$(item).addClass("schedule-date");
					}
				})
			}
			else if(!$dateContent.html() || $dateContent.html()=="<br>"){
				alert("日程内容为空！");
				clearDateSchedule($dateSingleDay,dateContentData);
			}
			else{
				alert("日程内容未发生改变！");
			}
			$dateLayer.hide();
		})
		
		// 取消保存内容
		$contentCancel.bind("click",function(){
			var dateContentData = $dateContent.attr("data-list"),
				dateContentText = $dateContent.html();
		
			if(localStorage[dateContentData]){
				if($dateContent.html()!=localStorage[dateContentData]){
					var iSave = confirm("日程内容发生改变，是否保存？");
					if(iSave){
						if($dateContent.html()!="" && $dateContent.html()!=="<br>"){
							localStorage[dateContentData] = dateContentText;
						}
						else{
							clearDateSchedule($dateSingleDay,dateContentData);
						}	
					}
				}
			}
			$dateLayer.hide(); 
			return;
		})	
		
		// 日程为空时，清空内容
		function clearDateSchedule(dContainer,dateContentData){
			$.each(dContainer,function(index,item){
				if($(item).attr("data-date") == dateContentData){
					$(item).removeClass("schedule-date");
				}
			})
			localStorage.removeItem(dateContentData);
		}
	}	

})