/******************************************
* Service Details View
*/
app.Views.PrintingCalendarView =  Backbone.View.extend({

	templateHTML: 'printingCalendar',

	events:	[],

	/** View Initialization
	*/
	initialize: function () {
		this.calendar = this.options.calendar;
		this.events = this.options.events;
	},


	/** Display the view
	*/
	render: function () {

		var self = this;
		// Retrieve the template // 
		$.get("templates/" + this.templateHTML + ".html", function(templateData){
			var template = _.template(templateData,{
				lang: app.lang,
			});
			$(self.el).html(template);

			// Print button //
			$('<span class="fc-button fc-button-print">' 
				   +'<i class="icon-print"></i></span>')
				  .appendTo(self.calendar.divCalendar + ' td.fc-header-right')
				  .button()
				  .on('click', function() {
						self.printCalendar();
				  })
				  .before('<span class="fc-header-space">');
		});
		return this;
	},


	/** Print Calendar
	*/
	printCalendar: function () {

		var date = moment( $(this.calendar.divCalendar).fullCalendar('getView').visStart );			
		var momentDate = moment().year(date.year()).week(date.week());
		
		var firstDayOfTheWeek = momentDate.clone().day(1);
		var lastDayOfTheWeek = momentDate.clone().day(7);


		if(firstDayOfTheWeek.isSame(lastDayOfTheWeek, 'month')){
			var titleFirstDay = momentDate.day(1).format('D');
		}
		else{
			if(firstDayOfTheWeek.isSame(lastDayOfTheWeek, 'year')){
				var titleFirstDay = momentDate.day(1).format('D MMM');
			}
			else{
				var titleFirstDay = momentDate.day(1).format('D MMM YYYY');
			}
		}

		$("#printingCalendar .before-muted").html( app.lang.week + " " + momentDate.week() + " - " ); 
		$("#printingCalendar .muted").html( titleFirstDay + " " + app.lang.to + " " + lastDayOfTheWeek.format('D MMM YYYY')  );			

		var self = this;

		var elementToPrint = $('#printingCalendar');
		var	worker = $('#worker').text(this.calendar.model.name);
		var table = $('#paperboard');

		var tasks = _.filter(this.events, function(task){ 
        	return (
        				task.state != app.Models.Task.status.draft.key &&
        				task.state != app.Models.Task.status.cancelled.key        			
        		); 
        });

		tasks = _.sortBy(tasks, function(item){ 
		    return item.date_start; 
		});


	    _.each(tasks, function(task){ 
	    	
	    	task["day"] = self.getDay(task.start);	    	
	    	task["inter"] = task.inter_name != false ? task.inter_name :'' ;
	    	task["description"] = task.inter_desc != false ? task.inter_desc :'';
	    	task["name"] = task.title;
	    	var site = task.inter_site ? task.inter_site : "";
	    	task["place"] = task.inter_equipment  ? _(task.inter_equipment).strLeft('/') + "- (" + site + ")": site;
	    	task["done"] = ( task.state == app.Models.Task.status.done.key  ? true : false );
	    	
	    	task["equipment"] = "";
	    	if( task.equipments ) {
		    	_.each( task.equipments , function( equipment ) {
		    		task["equipment"] += "[" + _(equipment).strLeft('/') + "]";
		    	});
		    }

			task["planned_hours"] =  ( task.planned_hours>0? task.planned_hours : '' );
			task["effective_hours"] =  ( task.effective_hours>0? task.effective_hours : '' );
			task["remaining_hours"] =  '';//( task.remaining_hours>0? task.remaining_hours : '' );
			task["oilQtity"] =  (task.oil_qtity>0? task.oil_qtity : '');
			task["oilPrice"] =  (task.oil_price>0? task.oil_price : '');
			var startDt = task.start!=false ? moment( task.start ):null;
			var endDt = task.end!=false ? moment( task.end ) :null;
			task["taskHours"] = '';
			if( !_.isNull(startDt) && !_.isNull(endDt))
				task["taskHours"] = startDt.format('H[h]mm')  + '-' + endDt.format('H[h]mm') ;
			task["km"] = ''; 
	    })
		
	    $('#paperboard').data('resultSet', tasks);
	    var results = $('#paperboard').data('resultSet');
	    self.results = results;
	    
		table.dataTable({
			"bAutoWidth": false,
			"aaData": self.results,
		    "bJQueryUI": true,
		    "sPaginationType": "full_numbers",
		    "bProcessing": true,
		    "bSort": true,
		    "aoColumns": [
				{"sDay": "Day", "mDataProp": "day", 'sWidth': '5%', 'sClass': "center", "bVisible": false, "sType": "day"},
				{"sInter": "Inter", "mDataProp": "inter", 'sWidth': '5%', 'sClass': "center"},
				{"sDescription": "Description", "mDataProp": "description", 'sWidth': '5%'},
				{"sName": "Name", "mDataProp": "name", 'sWidth': '5%', 'fnCreatedCell': self.getStyle },
				{"sPlace": "Place", "mDataProp": "place", 'sWidth': '5%', 'sClass': "center"},
				{"sDateStart": "DateStart", "mDataProp": "taskHours","sType": "date", 'sWidth': '2%'},
				{ "sWorkingTime": "WorkingTime", "mDataProp": "planned_hours", 'sWidth': '1%','sClass': "center"},
				{ "sEffectiveTime": "EffectiveTime", "mDataProp": "effective_hours", 'sWidth': '1%','sClass': "center toFill"}, 
				{ "sRemainingTime": "RemainingTime", "mDataProp": "remaining_hours", 'sWidth': '1%','sClass': "center toFill"}, 
				{ "sDone": "Done", "mDataProp": "done", 'sWidth': '2%','fnRender': self.renderResume},
				{ "sEquipment": "Equipment", "mDataProp": "equipment", 'sWidth': '25%','sClass': "center toFill"},
				{ "sOilQtity": "oilQtity", "mDataProp": "oilQtity", 'sWidth': '2%', 'sClass': "center toFill"},
				{ "km": "km", "mDataProp": "km", 'sWidth': '2%', 'sClass': "center toFill"},
				{ "sOilPrice": "oilPrice", "mDataProp": "oilPrice", 'sWidth': '2%', 'sClass': "center toFill"},
			],
		
		    "bFilter": false,"bInfo": false,"bPaginate": false,"bLengthChange": false,
		    bRetrieve: true,
		    "fnDrawCallback": function ( oSettings ) {
	            if ( oSettings.aiDisplay.length == 0 )
	            {
	                return;
	            }
	             
	            var nTrs = $('#paperboard tbody tr');
	            var iColspan = nTrs[0].getElementsByTagName('td').length;
	            var sLastGroup = "";
	            for ( var i=0 ; i<nTrs.length ; i++ )
	            {
	                var iDisplayIndex = oSettings._iDisplayStart + i;
	                var sGroup = oSettings.aoData[ oSettings.aiDisplay[iDisplayIndex] ]._aData["day"];
	                if ( sGroup != sLastGroup )
	                {
	                    var nGroup = document.createElement( 'tr' );
	                    var nCell = document.createElement( 'td' );
	                    
	                    nCell.colSpan = iColspan;
	                    nCell.className = "group";
	                    nCell.innerHTML = sGroup;
	                    nGroup.appendChild( nCell );
	                    nTrs[i].parentNode.insertBefore( nGroup, nTrs[i] );
	                    sLastGroup = sGroup;
	                }
	            }
	        },
	        "fnSort": function (x,y) {
		          return ((x < y) ? -1 : ((x > y) ?  1 : 0));
		    },
	        "aoColumnDefs": [
	            { "bVisible": false, "aTargets": [ 0 ] }
	        ],
	        "aaSorting": [[ 0, 'asc' ]],
		})

		table.fnClearTable();
		if (results.length)
			table.fnAddData(results);
		table.fnDraw();

		elementToPrint.printElement({
			leaveOpen	: true,
			printMode	: 'popup',
			overrideElementCSS:[
				{ href:'css/vendors/print_table.css', media: 'all'}
			]
		});
	},	
	//--------------------End  Print calendar----------------------------------------//

	/**
	 * Remove print button on close calendar
	 */
	close : function() {	
		$('span').remove('.fc-button-print');
		$('span').remove('.fc-header-space');
	},

   
    //--------------------Getter--------------------------------------//
	
	getStyle: function (nTd, sData, oData, iRow, iCol) {
		if( oData.state == app.Models.Task.status.absent.key )
			$(nTd).css('font-style', 'italic');
	},
	
	renderResume: function (o, check){
		if( o.aData.state != app.Models.Task.status.absent.key )
			return "<td class=\"center\"><input type=\"checkbox\" disabled " + (check?"checked":"") + "></td>";
		else
			return "<td class=\"center\"></td>";
	},
	
	getDay : function(date) {
		return moment(date).format('dddd D MMMM')
	},
	
});

jQuery.fn.dataTableExt.oSort['day-asc']  = function(x,y) {
	var days = Array("lundi","mardi","mercredi","jeudi","vendredi","samedi");
	var indexOfx = days.indexOf(x);
	var indexOfy = days.indexOf(y);
	return ((indexOfx < indexOfy) ? -1 : ((indexOfx > indexOfy) ? 1 : 0));
};
