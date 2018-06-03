function fnc_ajax3()
{
	 $.ajax({
		url : code7_url+"/memberList",
		dataType : 'json',
		type : "POST",  
		data : { "guest" : "N" },
		error: function(xhr,status,error){
			  alert("code:"+xhr.status);
		  },
		success : function(data, status) {
			var response = data.list;
			$("#id_memberList").html("");

			var temp_html = "";
			var temp_seq = 1;
			for(var i=0; i<response.length; ++i)
			{	
				if(response[i].del_yn == "Y")	{
					continue;
				}
				temp_html="";
				temp_html += "<tr>";
				temp_html += "<th scope='row' style='width:5%;'>"+(temp_seq++)+"</th>";
				temp_html += "<td style='width:40%;text-align:left;'><a href='javascript:fnc_goPersonalRecord(\""+response[i].uuid+"\",\""+response[i].name+"\");'>"+response[i].name+"("+response[i].cname+")</a></td>";
				temp_html += "<td style='width:10%;'>"+response[i].tappr+"</td>";
				temp_html += "<td style='width:10%;'>"+response[i].wappr+"</td>";
				temp_html += "<td style='width:10%;'>"+response[i].dappr+"</td>";
				temp_html += "<td style='width:10%;'>"+response[i].lappr+"</td>";
				temp_html += "<td style='width:15%;'>"+response[i].wrate+"%</td>";
				temp_html += "</tr>";
				$("#id_memberList").append(temp_html).trigger( "create" );
			}			
		}
	});
}	