function fnc_ajax2()
{
	 $.ajax({
		url : code7_url+"/stadiumList",
		type : "GET",  
		/*data : { "id" : "" },*/
		error: function(xhr,status,error){
			  alert("code:"+xhr.status);
		  },
		success : function(data, status) {
			var response = data.list;
			$("#id_stadium").html("");
			for(var i=0; i<response.length; ++i)
			{					
				if(i != 0)
				{
					$("#id_stadium").append("<br><br>");
				}
				$("#id_stadium").append("<span style='font-weight:bold;'>"+response[i].name+"</span>");
				$("#id_stadium").append("<br><div style='text-align:left;'>&nbsp&nbsp"+response[i].descryption+"</span>");
			}
		}
	});
}