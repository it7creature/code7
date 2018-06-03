function fnc_setType(idx)	{
	$(".object_hide").hide();
	$(".mn_5_type_"+idx).slideDown(5000);
}

//초기세팅. 일자선택 및 가용멤버 가져오긔
function fnc_ajax5()
{
	 $.ajax({
		url : code7_url+"/memberList",
		dataType : 'json',
		type : "POST",  
		/*data : { "id" : "" },*/
		error: function(xhr,status,error){
			  alert("code:"+xhr.status);
		  },
		success : function(data, status) {
			var response = data.list;
			

			var temp_html = "";
			fnc_clearMember();
			$("#mn_5_member").html("");			
			$("#matchDay").val("");
			$(".mn_5_value").val("0");
			$("#mn_5_member_team_a").val("");
			$("#mn_5_member_team_b").val("");
			$(".team_make_radio").attr("disabled",true);
			$("#mn_5_member_tot_cnt").val(response.length);

			for(var i=0; i<response.length; ++i)
			{
				
				if(response[i].del_yn == "Y")	{
					continue;
				}
				temp_html += "<label id='member_label_"+response[i].uuid+"'>";
				temp_html += "<input type='checkbox' class='member_checkbox' id='member_checkbox_"+response[i].uuid+"' value='"+response[i].uuid+"|"+response[i].name+"' onclick='javascript:fnc_selectMember(\""+response[i].uuid+"\");'><span id='member_name_"+response[i].uuid+"' style='font-weight:normal;'>"+response[i].name+"</span>";
				temp_html += "</label>";
				if( (i+1) != response.length )	{
					temp_html += "&nbsp&nbsp";
				}
			}
			temp_html += "<div style='text-align:left;'>&nbsp&nbsp-- 총 <span id='member_cnt' style='color:red;'>0</span>명 참여&nbsp&nbsp[<span id='mn_5_member_fix_1'><a href='javascript:fnc_fixMember(1);'>멤버확정</a></span><span id='mn_5_member_fix_2' style='display:none;'><a href='javascript:fnc_fixMember(2);'>확정취소</a></span>]</div>";
			$("#mn_5_member").append(temp_html).trigger("create");
		}
	});
}

//가용멤버에서 참여멤버 선택
function fnc_selectMember(idx)	{
	var temp_color = "";
	var temp_weight = "";
	if($("#member_checkbox_"+idx).is(":checked"))	{
		temp_color = "#A9A9F5";
		temp_weight = "bold";
		$("#mn_5_member_cnt").val(parseInt($("#mn_5_member_cnt").val())+1);		
	}
	else	{
		temp_color = "black";
		temp_weight = "normal";
		$("#mn_5_member_cnt").val(parseInt($("#mn_5_member_cnt").val())-1);
	}
	$("#member_name_"+idx).css("color",temp_color);
	$("#member_name_"+idx).css("font-weight",temp_weight);
	$("#member_cnt").html($("#mn_5_member_cnt").val());
}

//참여멤버 확정 및 확정취소
function  fnc_fixMember(idx)	{
	if($("#matchDay").val() == "")	{
		alert("일자를 입력해주세요.");
		$("#matchDay").focus();
		return;
	}
	//확정을 눌렀다면
	if(idx == 1)	{
		//멤버 세팅
		for(var i=1 ; i <= parseInt($("#mn_5_member_tot_cnt").val()) ; ++i)	{
			if($("#member_checkbox_"+i).is(":checked"))	{
				var atemp_html = "";
				var btemp_html = "";
				var a="a";
				var b="b";
				var info = $("#member_checkbox_"+i).val().split('|');
				
				atemp_html += "<span class='team_member_span'><label id='member_label_fix_a_"+info[0]+"'>";
				atemp_html += "<input type='checkbox' class='member_checkbox_fix' id='member_checkbox_fix_a_"+info[0]+"' value='"+info[0]+"' onclick='javascript:fnc_selectFixMember(\""+a+"\",\""+b+"\",\""+info[0]+"\",\""+info[1]+"\");'><span id='member_name_fix_a_"+info[0]+"' style='font-weight:normal;'>"+info[1]+"</span>";
				atemp_html += "</label></span><span class='team_member_stats_span' id='team_a_member_stats_span' style='display:none;'></span>";
				btemp_html += "<span class='team_member_span'><label id='member_label_fix_b_"+info[0]+"'>";
				btemp_html += "<input type='checkbox' class='member_checkbox_fix' id='member_checkbox_fix_b_"+info[0]+"' value='"+info[0]+"' onclick='javascript:fnc_selectFixMember(\""+b+"\",\""+a+"\",\""+info[0]+"\",\""+info[1]+"\");'><span id='member_name_fix_b_"+info[0]+"' style='font-weight:normal;'>"+info[1]+"</span>";
				btemp_html += "</label></span><span class='team_member_stats_span' id='team_b_member_stats_span' style='display:none;'></span>";
				
				$("#team_a_member").append(atemp_html).trigger("create");
				$("#team_b_member").append(btemp_html).trigger("create");
			}
		}
		//팀 확정 세팅
		var temp_html = "";
		temp_html += "<div style='text-align:center;'><span id='team_a_cnt' style='color:red;'>0</span>&nbsp vs &nbsp<span id='team_b_cnt' style='color:red;'>0</span>[<span id='mn_5_team_fix_1'><a href='javascript:fnc_fixTeam(1);'>팀확정</a></span><span id='mn_5_team_fix_2' style='display:none;'><a href='javascript:fnc_fixTeam(2);'>확정취소</a> | <a href='javascript:fnc_saveResult();'>결과저장</a></span>]</div>";
		$("#team_fix").append(temp_html).trigger("create");

		//분류방법 세팅
		var temp_html = "";
		temp_html += "<label class='radio-inline'>";
		temp_html += "<input type='radio' name='team_make' class='team_make_radio' id='team_make_radio_manual' value='1' checked> 수동";
		temp_html += "</label>";
		temp_html += "<label class='radio-inline'>";
		temp_html += "<input type='radio' name='team_make' class='team_make_radio' id='team_make_radio_auto' value='2'> 자동";
		temp_html += "</label>";
		$("#team_make").append(temp_html).trigger("create");
		
		//일자 및 가용멤버 수정못하게 disabled
		$(".member_checkbox").attr("disabled",true);
		$("#matchDay").attr("readonly",true);
		$("#matchDay").attr("disabled",true);

		$(".team_table_tr").css("background-color","#FFFFD4");
		$("#mn_5_member_fix_1").css("display","none");
		$("#mn_5_member_fix_2").css("display","inline-block");
		$(".team_make_radio").attr("disabled",false);
	}
	//확정취소를 눌렀다면
	else	{			
		fnc_clearMember();
	}
}

function fnc_clearMember()	{
	//일자 및 가용멤버 수정 가능토록 enabled
	$(".member_checkbox").attr("disabled",false);
	$("#matchDay").attr("disabled",false);
	$("#matchDay").attr("readonly",false);

	//팀 카운트 초기화
	$("#mn_5_member_team_a_cnt").val("0");
	$("#mn_5_member_team_b_cnt").val("0");
	$("#mn_5_member_team_a_score").val("0");
	$("#mn_5_member_team_b_score").val("0");

	$(".team_table_tr").css("background-color","#FFFFFF");
	$("#mn_5_member_fix_1").css("display","inline-block");
	$("#mn_5_member_fix_2").css("display","none");
	$(".team_member").html("");
	$(".team_make_radio").attr("disabled",true);
}

//팀 멤버 선택
function fnc_selectFixMember(homeTeam,awayTeam, idx, nm)	{
	var temp_color = "";
	var temp_weight = "";
	if($("#member_checkbox_fix_"+homeTeam+"_"+idx).is(":checked"))	{
		var temp_br = "";
		if($("#mn_5_member_team_"+homeTeam+"_cnt").val() != "0")	{
			temp_br = "<br>";	
		}

		temp_color = "#A9F5A9";
		temp_weight = "bold";
		$("#mn_5_member_team_"+homeTeam+"_cnt").val(parseInt($("#mn_5_member_team_"+homeTeam+"_cnt").val())+1);
		$("#member_checkbox_fix_"+awayTeam+"_"+idx).attr("disabled", true);

		//스코어 입력가능토록 추가		
		$("#team_"+homeTeam+"_member_stats_span").append("<span id='team_"+homeTeam+"_member_stats_span_"+idx+"'>"+temp_br+""+nm+" <input type='number' min='0' class='input-form member_score_text member_score_"+homeTeam+"_text' size='1' onclick='javascript:fnc_setClear(\""+homeTeam+"\", \""+idx+"\");' onchange='javascript:fnc_setScore(\""+homeTeam+"\", \""+idx+"\"); ' id='team_"+homeTeam+"_member_stats_span_text_"+idx+"' style='display:inline-block;height:16px;width:50px;'value='0'><br></span>").trigger("create");		
	}
	else	{
		//스코어 입력란에서 제거
		$("#team_"+homeTeam+"_member_stats_span_"+idx).remove();
		temp_color = "black";
		temp_weight = "normal";
		$("#mn_5_member_team_"+homeTeam+"_cnt").val(parseInt($("#mn_5_member_team_"+homeTeam+"_cnt").val())-1);
		$("#member_checkbox_fix_"+awayTeam+"_"+idx).attr("disabled", false);
	}
	$("#team_"+homeTeam+"_cnt").text($("#mn_5_member_team_"+homeTeam+"_cnt").val());
	$("#member_name_fix_"+homeTeam+"_"+idx).css("color",temp_color);
	$("#member_name_fix_"+homeTeam+"_"+idx).css("font-weight",temp_weight);
}


//팀 멤버 확정 및 확정취소
function fnc_fixTeam(idx)	{
	//확정을 눌렀다면
	if(idx == 1)	{
		//팀 정보 세팅
		var team_a_info = "";
		var team_b_info = "";
		//A팀
		for (var i = 0; i < $(".member_score_a_text").length; i++) {
			if(i != 0)	{
				team_a_info += ",";
			}
			var temp_array = $(".member_score_a_text:eq("+i+")").attr('id').split('_');
			team_a_info += temp_array[temp_array.length-1];
		}
		//B팀
		for (var i = 0; i < $(".member_score_b_text").length; i++) {
			if(i != 0)	{
				team_b_info += ",";
			}
			var temp_array = $(".member_score_b_text:eq("+i+")").attr('id').split('_');
			team_b_info += temp_array[temp_array.length-1];
		}
		fnc_setTeamStats(team_a_info, 'a');
		fnc_setTeamStats(team_b_info, 'b');

		$(".member_checkbox_fix").attr("disabled", true);
		$("#mn_5_team_fix_2").css("display","inline-block");
		$("#mn_5_team_fix_1").css("display","none");

		//체크멤버는 사라지고
		$(".team_member_span").css("display","none");
		//골 스코어 및 어스 입력받음
		$(".team_member_stats_span").css("display","inline-block");
		//총점 show		
		$("#team_a_member").append("<div id='mn_5_team_a_score_div' class='mn_5_team_score_div' style='font-weight:bold;color:red;'>"+$("#mn_5_member_team_a_score").val()+"</div>");		
		$("#team_b_member").append("<div id='mn_5_team_b_score_div' class='mn_5_team_score_div' style='font-weight:bold;color:blue;'>"+$("#mn_5_member_team_b_score").val()+"</div>");
	}
	//확정취소를 눌렀다면
	else	{			
		//총점 hide
		$(".mn_5_team_score_div").remove();

		$(".member_checkbox_fix").attr("disabled", false);		
		$("#mn_5_team_fix_1").css("display","inline-block");
		$("#mn_5_team_fix_2").css("display","none");

		//골 스코어 및 어스 입력은 사라지고
		$(".team_member_stats_span").css("display","none");
		//체크멤버는 불러옴
		$(".team_member_span").css("display","inline-block");
	}
}

//결과저장
function fnc_saveResult()	{
	//승패구분은 , 멤버구분은 |, 멤버내 id와 스코어 구분은 _	
	var team_a_info = "";	//A팀 멤버정보
	var team_b_info = "";	//B팀 멤버정보

	if(parseInt($("#mn_5_member_team_a_score").val()) > parseInt($("#mn_5_member_team_b_score").val()) )	{
		team_a_info += "Y,";
		team_b_info += "N,";
	}
	else if(parseInt($("#mn_5_member_team_a_score").val()) == parseInt($("#mn_5_member_team_b_score").val()) )	{
		team_a_info += "X,";
		team_b_info += "Z,";
	}
	else if(parseInt($("#mn_5_member_team_a_score").val()) < parseInt($("#mn_5_member_team_b_score").val()) )	{
		team_a_info += "N,";
		team_b_info += "Y,";
	}
	//A팀 멤버정보 세팅
	for (var i = 0; i < $(".member_score_a_text").length; i++) {
		var temp_array = $(".member_score_a_text:eq("+i+")").attr('id').split('_');
		
		if(i != 0)	{
			team_a_info += "|";
		}
		team_a_info += temp_array[temp_array.length-1];
		team_a_info += "_"+$(".member_score_a_text:eq("+i+")").val();
	}
	//B팀 멤버정보 세팅
	for (var i = 0; i < $(".member_score_b_text").length; i++) {
		var temp_array = $(".member_score_b_text:eq("+i+")").attr('id').split('_');
		
		if(i != 0)	{
			team_b_info += "|";
		}
		team_b_info += temp_array[temp_array.length-1];
		team_b_info += "_"+$(".member_score_b_text:eq("+i+")").val();
	}

	$.ajax({
		url : code7_url+"/saveResult",
		dataType : 'json',
		type : "POST",  
		data : { 
				"matchDay" : $("#matchDay").val()
				,"teamAScore" : $("#mn_5_member_team_a_score").val()
				,"teamBScore" : $("#mn_5_member_team_b_score").val()
				,"teamAInfo" : team_a_info
				,"teamBInfo" : team_b_info
		},
		error: function(xhr,status,error){
			  alert("code:"+xhr.status);
		  },
		success : function(data, status) {
			if(data.result == "1")	{
				alert("저장완료");
				fnc_ajax5();
			}
			else	{
				alert("정상저장 실패. 관리자가 확인해봐야함!!");
			}			
		}
	});
}

//총점 세팅
function fnc_setScore(team, idx) {
	//해당 팀 점수 초기화
	$("#mn_5_member_team_"+team+"_score").val("0");
    for (var i = 0; i < $(".member_score_"+team+"_text").length; i++) {
		//총점 재계산
		$("#mn_5_member_team_"+team+"_score").val(parseInt($("#mn_5_member_team_"+team+"_score").val())+parseInt($(".member_score_"+team+"_text:eq("+i+")").val()));
    }
	//화면에 show
	$("#mn_5_team_"+team+"_score_div").html($("#mn_5_member_team_"+team+"_score").val()).trigger("create");
}

//해당 value 초기화
function fnc_setClear(team, idx)	{
	$("#team_"+team+"_member_stats_span_text_"+idx).val("");
}

//팀 통계 정보 리턴
function fnc_setTeamStats(teamInfo, team)	{
	$.ajax({
		url : code7_url+"/teamStats",
		dataType : 'json',
		type : "POST",  
		data : { "teamInfo" : teamInfo	},
		error: function(xhr,status,error){
			  alert("code:"+xhr.status);
		  },
		success : function(data, status) {
			var response = data.teamStats;
			
			$("#team_"+team+"_wrate").html(response[0].teamwrate);
			$("#team_"+team+"_crate").html(response[0].teamcrate);
			$("#team_"+team+"_score").html(response[0].teamscore);
			
			if(team == 'b')	{
				//승률 비교
				if ( parseInt($("#team_a_wrate").text()) > parseInt($("#team_b_wrate").text()))	{
					 $("#team_a_wrate").css("color", "blue");
				}
				else if ( parseInt($("#team_a_wrate").text()) < parseInt($("#team_b_wrate").text()))	{
					 $("#team_b_wrate").css("color", "blue");
				}
				//찬스율 비교
				if ( parseInt($("#team_a_crate").text()) > parseInt($("#team_b_crate").text()))	{
					 $("#team_a_crate").css("color", "blue");
				}
				else if ( parseInt($("#team_a_crate").text()) < parseInt($("#team_b_crate").text()))	{
					 $("#team_b_crate").css("color", "blue");
				}
				//득점 비교
				if ( parseInt($("#team_a_score").text()) > parseInt($("#team_b_score").text()) )	{
					 $("#team_a_score").css("color", "blue");
				}
				if ( parseInt($("#team_a_score").text()) < parseInt($("#team_b_score").text()) )	{
					 $("#team_b_score").css("color", "blue");
				}
				$(".team_stats").trigger("create");
			}
		}
	});
}