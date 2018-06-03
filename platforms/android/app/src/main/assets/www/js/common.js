var code7_url = "https://itainer.cafe24.com:8443/code7";
//var code7_url = "http://itainer.cafe24.com:8080/code7";
//var code7_url = "http://localhost:8080/code7";
//타임아웃 1시간(3600초)
var session_tm_out = 3600;

//메뉴 선택
function fnc_goMn(idx)	{	
	if(idx == "" || idx == null)	{
		alert("잘못된 메뉴호출입니다.");
		return false;
	}
	
	//세션체크
	var session_check = true;
	//존재 체크
	if(!sessionStorage.getItem("session_time"))	{
		session_check = false;
	}	
	//타임아웃 체크
	var session_time = new Date(sessionStorage.getItem("session_time"));
	var current_time = new Date();
	if( ((current_time - session_time) / 1000) > session_tm_out )	{
		session_check = false;
	}
	if(!session_check)	{
		alert("로그인 후 이용해주시기 바랍니다.");
		onBackKeyResult(2);
	}	
	
	if(idx == "0")	{
		onBackKey();
	}
	else if(idx == "1")	{
		fnc_ajax2();
	}
	else if(idx == "3")	{
		fnc_ajax3();
	}
	else if(idx == "4")	{
		fnc_ajax4();
	}
	else if(idx == "5")	{
		if(sessionStorage.getItem("user_level") != "2")	{
			fnc_showAlert("관리자만 접근가능합니다", "접근실패", "확인");
			return false;
		}
		fnc_ajax5();
	}
	
	if(idx != "0")	{
		$(".mn").css("display","none");
		$("#mn_"+idx).css("display","block");
	}
}

//개인기록카드
function fnc_goPersonalRecord(member_id, name)
{
	$("#myModalLabel").html("<span style='font-weight:bold;'>"+name+"님 기록차트</span>");		
	$(".div_member_popup").html("");
	
	var temp_html = "";


	$.ajax({
		url : code7_url+"/playerPopupRecordList",
		type : "POST",  
		dataType : 'json',
		data : { "memberId" : member_id},
		error: function(xhr,status,error){
			  alert("code:"+xhr.status);
		  },
		success : function(data, status) {
			var getRecentWinYn = data.getRecentWinYn;
			var getWithMemberStats = data.getWithMemberStats;
			var getYearStats = "";
			
			//차트를 위한 연도별 값 세팅
			for(var i=0; i<data.getYearStats.length; ++i)	{
				getYearStats += data.getYearStats[i].year;
				getYearStats += "."+data.getYearStats[i].wappr;
				getYearStats += "."+data.getYearStats[i].dappr;
				getYearStats += "."+data.getYearStats[i].lappr;
				if( (i+1) != data.getYearStats.length)	{
					getYearStats += ",";
				}
			}
			$("#member_year_stats").val(getYearStats);

			//최근 10경기 승무패
			$("#div_recent_win_yn").html(getRecentWinYn[0].r10days_winYn);
			//최고의 파트너 5명
			for(var i=0; i<getWithMemberStats.length; ++i)	{
				if(i==5)	{
					break;
				}
				$("#div_get_with_best_member_stats").append((i+1)+". "+getWithMemberStats[i].name+" : 승률 "+getWithMemberStats[i].wrate+"%("+getWithMemberStats[i].wappr+"승 "+getWithMemberStats[i].lappr+"패)<br>");
			}

			var temp_seq = 0;
			//최악의 파트너 5명
			for(var i=getWithMemberStats.length; i > 0; --i)	{
				if(temp_seq==5)	{
					break;
				}
				$("#div_get_with_worst_member_stats").append((temp_seq+1)+". "+getWithMemberStats[i-1].name+" : 승률 "+getWithMemberStats[i-1].wrate+"%("+getWithMemberStats[i-1].wappr+"승 "+getWithMemberStats[i-1].lappr+"패)<br>");
				temp_seq++;
			}
			$('#myModal').modal('show');
			$("#chart_iframe").attr("src","./personal_stats.html");
			$("#chart_iframe").trigger("create");			
		}
	});	
}

//alert 메시지
function fnc_showAlert(msg, title, btnName) {
        navigator.notification.alert(
            msg,  // message
            fnc_alertDismissed,         // callback
            title,            // title
            btnName                  // buttonName
        );
    }
//혹시 alert callback msg
function fnc_alertDismissed()	{
}