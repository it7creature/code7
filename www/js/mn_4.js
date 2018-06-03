//공통으로 필요한 값 세팅
function fnc_ajax4()
{
	$("#recordSelectId").html("");
	 $.ajax({
		url : code7_url+"/commonSet",
		type : "GET",  
		/*data : { "id" : "" },*/
		error: function(xhr,status,error){
			  alert("code:"+xhr.status);
		  },
		success : function(data, status) {
			var response = data.list;
			
			var temp_year_array = response[0].matchYear;
			var temp_year = temp_year_array.split("|");

			for(var i=(temp_year.length-1); i>=0; --i)
			{	
				$("#recordSelectId").append("<option value='"+temp_year[i]+"'>"+temp_year[i]+"</option>");
				//가장 마지막인 년도를 select
				if((i+1) == temp_year.length)	{
					$("#recordSelectId option:eq("+(i-1)+")").attr("selected", "selected");
				}
			}
			//해당년도 정보 가져오긔
			fnc_ajaxMatchRecord();
			fnc_ajaxPlayerRecord();
		}
	});
}



function fnc_ajaxMatchRecord()
{
	 $.ajax({
		url : code7_url+"/matchRecordList",
		dataType : 'json',
		type : "POST",  
		data : { "matchYear" : $("#recordSelectId option:selected").val() },
		error: function(xhr,status,error){
			  alert("code:"+xhr.status);
		  },
		success : function(data, status) {
			var response = data.list;
			$("#id_matchRecord").html("");
			
			var temp_html = "";
			var seq = 1;
			for(var i=0; i<response.length; ++i)
			{		
				if(i % 2 == 0)
				{
					temp_html += "<tr>";
					temp_html += "<th scope='row' style='width:10%;'>"+(parseInt(seq++))+"</th>";
					temp_html += "<td style='width:20%;'>"+response[i].date+"</td>";
				}
				temp_html += "<td style='vertical-align:top;' style='width:35%;'><span style='color:";
				if(response[i].win_yn == "Y")
				{
					temp_html += "blue;";
				}
				else
				{
					temp_html += "red;";
				}
				temp_html += "font-weight:bold;'>"+response[i].score+"</span>";
				var temp_memberArray = new Array();
				temp_memberArray = response[i].members.split('|');
				for(var j=0; j<temp_memberArray.length; ++j)
				{
					if(j%2 ==0)
					{
						temp_html += "<br>";
					}

					var temp_memberName = temp_memberArray[j].split(',');
					temp_html += temp_memberName[0];

					if(j%2 ==0 && (j+1)!=temp_memberArray.length)
					{
						temp_html +="&nbsp";
					}												
				}	
				temp_html += "</td>";
				if(i % 2 == 1)
				{
					temp_html +="</tr>";
				}
			}
			$("#id_matchRecord").html(temp_html);
			//$("#id_matchRecord").trigger( "create" );
		}
	});
}

function fnc_ajaxPlayerRecord()
{
	 $.ajax({
		url : code7_url+"/playerRecordList",
		type : "POST",  
		dataType : 'json',
		data : { "matchYear" : $("#recordSelectId option:selected").val(), "guest" : "N" },
		error: function(xhr,status,error){
			  alert("code:"+xhr.status);
		  },
		success : function(data, status) {
			var response = data.list;
			$("#id_playerRecordAppr").html("ap(t:"+response[0].tmatch+")");
			$("#id_playerRecord").html("");
			
			var temp_html = "";
			var seq = 1;
			for(var i=0; i<response.length; ++i)
			{	
				temp_html += "<tr>";
				temp_html += "<th scope='row' style='width:5%;'>"+(parseInt(seq++))+"</th>";
				temp_html += "<td style='width:20%;'>"+response[i].name+"</td>";
				temp_html += "<td style='width:25%;'>"+response[i].tappr+"("+response[i].arate+")</td>";
				temp_html += "<td style='width:10%;'>"+response[i].wappr+"</td>";
				temp_html += "<td style='width:10%;'>"+response[i].dappr+"</td>";
				temp_html += "<td style='width:10%;'>"+response[i].lappr+"</td>";
				temp_html += "<td style='width:10%;'>"+response[i].wrate+"</td>";
				var temp_crate = "-";
				if (response[i].member_id != "4")
				{
					temp_crate = response[i].crate;
				}
				temp_html += "<td style='width:10%;'>"+temp_crate+"</td>";	
				//temp_html += "<td style='width:10%;'>"+response[i].score+"</td>";		
			}
			$("#id_playerRecord").html(temp_html).trigger( "create" );;
			$("#id_matchRecord").trigger( "create" );
			//이미지 슬라이드
			var swiper = new Swiper('.swiper-container', {
				pagination: '.swiper-pagination',
				paginationClickable: true
			});
		}
	});
}

//년도 변경 시
function fnc_searchMatchList()	{
	fnc_ajaxMatchRecord();
	fnc_ajaxPlayerRecord();
}