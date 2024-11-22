	var VSnereden	= 1;
	var VSnereye	= 1;
	var params		= [0,1]; //footer'da sayým yapýlacak sütun numaralarý

	function tableSirala(VSnereden,VSnereye){
		jQuery.each($("#tableVS tr"), function(){$(this).children(":eq("+VSnereden+")").before($(this).children(":eq("+VSnereye+")")); });
	}

	function tut(ev){
		var th = ev.target.closest('th'); 
		var nodes = Array.from( th.closest('tr').children ); 
		var index = nodes.indexOf( th ); 
		VSnereden = index;
	}
	function kabul(ev) {
		ev.preventDefault();
		var th = ev.target.closest('th'); 
		th.style.border="dashed 1px #FF0000 !important";
		var nodes = Array.from( th.closest('tr').children ); 
		var index = nodes.indexOf( th ); 
	}
	function vazgec(ev) {
		var th = ev.target.closest('th'); 
		th.style.border="";
	}
	function birak(ev) {
		ev.preventDefault();
		var th = ev.target.closest('th');
		th.style.border="";
		var nodes = Array.from( th.closest('tr').children ); 
		var index = nodes.indexOf( th ); 
		VSnereye = index;
		tableSirala(VSnereye,VSnereden);
	}

	function siralaVS(tableId,n) {
		var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
		table = document.getElementById(tableId);
		tbody = table.getElementsByTagName("tbody")[0];
		switching = true;
		dir = "asc";
		while (switching) {
			switching = false;
			rows = tbody.rows;
			for (i = 0; i < (rows.length - 1); i++) {
				shouldSwitch = false;
				x = rows[i].getElementsByTagName("TD")[n];
				y = rows[i + 1].getElementsByTagName("TD")[n];

				var cmpX=isNaN(parseInt(x.innerText))?x.innerText.toLowerCase():parseInt(x.innerText);
				var cmpY=isNaN(parseInt(y.innerText))?y.innerText.toLowerCase():parseInt(y.innerText);
				cmpX=(cmpX=='-')?0:cmpX;
				cmpY=(cmpY=='-')?0:cmpY;

				if (dir == "asc") {
					if (cmpX > cmpY) {
						shouldSwitch= true;
						break;
					}
				} else if (dir == "desc") {
					if (cmpX < cmpY) {
						shouldSwitch= true;
						break;
					}
				}
			}
			if (shouldSwitch) {
				rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
				switching = true;
				switchcount ++;      
			} else {
				if (switchcount == 0 && dir == "asc") {
					dir = "desc";
					switching = true;
				}
			}
		}
	}


	function hesapla(table,params){
		var params = [];
		$('#tableVS thead tr th').each(function(){if($(this).attr('data-hesapla')==='evet'){params.push($(this).index());}});
		var liste = params; //[0,1]; 
		var column=[]
		for(i=0; i<liste.length; i++){column[liste[i]] = 0;}
		var table = document.getElementById(table);
		var tbody = table.getElementsByTagName("tbody");
		var tr = tbody[0].getElementsByTagName("tr");
		for(s=0; s< tr.length; s++){if(tr[s].style.display === ""){for(i=0; i<liste.length; i++){column[liste[i]] += parseFloat(tr[s].getElementsByTagName("td")[liste[i]].innerText);}}}
		var tfoot = table.getElementsByTagName("tfoot");
		var trf = tfoot[0].getElementsByTagName("tr");
		var td = trf[0].getElementsByTagName("th");
		for(i=0; i<liste.length; i++){td[liste[i]].innerHTML = "<b>"+column[liste[i]].toFixed(2)+"</b>";}
	}


	function tabelToExcel(table) {
		var tab_text = '<html xmlns:x="urn:schemas-microsoft-com:office:excel">';
		tab_text = tab_text + '<head><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>';
		tab_text = tab_text + '<x:Name>Suser Pro</x:Name>';
		tab_text = tab_text + '<x:WorksheetOptions><x:Panes></x:Panes></x:WorksheetOptions></x:ExcelWorksheet>';
		tab_text = tab_text + '</x:ExcelWorksheets></x:ExcelWorkbook></xml></head><body>';
		tab_text = tab_text + "<table>";
		tab_text = tab_text + $(table).html();
		tab_text = tab_text + '</table></body></html>';

		var data_type = 'data:application/vnd.ms-excel';
		var ua = window.navigator.userAgent;
		var msie = ua.indexOf("MSIE ");

		if(msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
			if (window.navigator.msSaveBlob) {
				var blob = new Blob([tab_text], {
					type: "application/csv;charset=utf-8;"
				});
				navigator.msSaveBlob(blob, 'indir.xls');
			}
		}else{
			//$('#tests').attr('href', data_type + ', ' + encodeURIComponent(tab_text));
			//$('#tests').attr('download', 'indir.xls');
			var result = "data:application/vnd.ms-excel," + encodeURIComponent(tab_text);
			window.open(result);
		}
	}