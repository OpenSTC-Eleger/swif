/******************************************
* Row Intervention View
*/
app.Views.ItemInterventionView = Backbone.View.extend({

	tagName     : 'tr',

	templateHTML : 'items/itemIntervention',
	
	className   : 'row-item',

	// The DOM events //
	events       : {
		
		'click a.printInter'				: 'print',
		'change .taskEquipment'				: 'fillDropdownEquipment',
		'click a.buttonCancelInter'			: 'displayModalCancelInter',
		'click a.accordion-object'    		: 'tableAccordion',
		'click a.modalSaveInter'			: 'displayModalSaveInter',
	},



	/** View Initialization
	*/
	initialize : function() {
		this.model.off();

		// When the model are updated //
		this.listenTo(this.model, 'change', this.change);
	},



	/** When the model ara updated //
	*/
	change: function(model){
		var self = this;
		model.fetch({silent: true, data: {fields: app.views.interventions.collections.interventions.fields}})
		.done(function(){
			self.render();

			// Highlight the Row and recalculate the className //
			self.highlight().done(function(){
//				self.$el.attr('class', _.result(self, 'className'));
			});

			app.notify('', 'success', app.lang.infoMessages.information, self.model.getName()+' : '+ app.lang.infoMessages.interventionUpdateOK);

		})
		.fail(function(e){
			console.log(e);
		});
		
		// Partial Render //
		app.views.interventions.partialRender();
	},



	/** Display the view
	*/
	render : function() {
		var self = this;


		// Retrieve the template // 
		$.get("templates/" + this.templateHTML + ".html", function(templateData){

		 
			var template = _.template(templateData, {
				lang                   : app.lang,
				interventionsState     : app.Models.Intervention.status,
				intervention          : self.model.toJSON(),
			});

			$(self.el).html(template);

			// Set the Tooltip / Popover //$(self.el).html(template);
			$('*[data-toggle="tooltip"]').tooltip();
			$('*[rel="popover"]').popover({trigger: 'hover'});

			// Set the focus to the first input of the form //
			$('#modalCancelInter').on('shown', function (e) {
				$(this).find('input, textarea').first().focus();
			})
			
			$('tr.row-object').css({ opacity: '1'});
			$('tr.row-object > td').css({ backgroundColor: '#FFF'});
			$('tr.row-object:nth-child(4n+1) > td').css({backgroundColor: '#F9F9F9' });
			
		});
		$(this.el).hide().fadeIn('slow'); 
		return this;
	},

	/** Print a Task or an Intervention
	*/
	print: function(e){
		e.preventDefault();
		var self = this;
		
		
		var interJSON = this.model.toJSON();

		// Hide the print Inter section //
		$('#printTask div.forTask').hide();
		$('#printTask div.forInter').show();
		$('#tableTasks tbody').empty();

		// Display all the tasks of the inter //
		_.each(interJSON.tasks, function(task, i){
			var taskJSON = app.views.interventions.collections.tasks.get(task).toJSON();
			$('#tableTasks tbody').append('<tr style="height: 70px;"><td>'+taskJSON.name+'</td><td>'+app.decimalNumberToTime(taskJSON.planned_hours, 'human')+'</td><td class="toFill"></td><td class="toFill"></td><td class="toFill"></td><td class="toFill"></td><td class="toFill"></td><td class="toFill"></td></tr>');
		})

		var deferred = $.Deferred();
		deferred.always(function(){
			$('#interName').html(interJSON.name);
			$('#interDescription').html(interJSON.description);
			$('#interService').html(!interJSON.service_id?'':interJSON.service_id[1]);

			$('#interDateCreate').html(moment(interJSON.create_date).format('LL'));
			console.info(interJSON);
			console.log(interJSON);
			if(interJSON.date_deadline != false){
				$('#interDeadline').html(' / ' + moment(interJSON.date_deadline).format('LL'));
			}
			$('#interPlace').html(interJSON.site1[1]);
			$('#interPlaceMore').html(interJSON.site_details);

			$('#printTask').printElement({
				leaveOpen	: true,
				printMode	: 'popup',
				overrideElementCSS:[
					{ href:'css/vendors/print_table.css', media: 'all'}
				]
			});
		});
		if(!interJSON.ask_id){
			
			$('#claimentName').html(interJSON.create_uid[1]);
			deferred.resolve();
		}else{
			//retrieve ask associated, if exist
			var ask = new app.Models.Request();
			ask.setId(interJSON.ask_id[0]);
			ask.fetch().done(function(){
				var askJSON = ask.toJSON();
				if(askJSON.partner_id != false){
					$('#claimentName').html(askJSON.partner_id[1]+' - '+ !askJSON.partner_address?'':askJSON.partner_address[1]);
					$('#claimentPhone').html(askJSON.partner_phone);
					
				}
				else{
					$('#claimentName').html(askJSON.people_name);
					$('#claimentPhone').html(askJSON.people_phone);
				}
	
				$('#claimentType').html(askJSON.partner_type[1]);
				deferred.resolve();
			})
			.fail(function(e){
				console.log(e);
				deferred.reject();
			});
		}
		

	},



	
	expendAccordion: function(){
		// Retrieve the intervention ID //
		//var id = _($(e.target).attr('href')).strRightBack('_');
		var id = this.model.toJSON().id.toString();

		var isExpend = $('#collapse_'+id).hasClass('expend');

		// Reset the default visibility //
		$('tr.expend').css({ display: 'none' }).removeClass('expend');
		$('tr.row-object').css({ opacity: '0.45'});
		$('tr.row-object > td').css({ backgroundColor: '#FFF'});
		
		// If the table row isn't already expend //       
		if(!isExpend){
			// Set the new visibility to the selected intervention //
			$('#collapse_'+id).css({ display: 'table-row' }).addClass('expend');
			$(this.el).parents('tr.row-object').css({ opacity: '1'});  
			$(this.el).parents('tr.row-object').children('td').css({ backgroundColor: "#F5F5F5" }); 
		}
		else{
			$('tr.row-object').css({ opacity: '1'});
			$('tr.row-object > td').css({ backgroundColor: '#FFF'});
			$('tr.row-object:nth-child(4n+1) > td').css({backgroundColor: '#F9F9F9' });
		}
	},
	
	tableAccordion: function(e){

		e.preventDefault();
		this.expendAccordion();
		   
	},
	
	/** Display the form to add / update an intervention
	*/
	displayModalSaveInter: function(e){
		e.preventDefault();
		var params = {el:'#modalSaveInter'}
		params.model = this.model;
		new app.Views.ModalInterventionView(params);
	},
	


	displayModalCancelInter: function(e) {
		e.preventDefault();
		new app.Views.ModalCancelInterventionView({el: '#modalCancelInter', model: this.model});
	},

	
	/** Highlight the row item
	*/
	highlight: function(){
		var self = this;

		$(this.el).addClass('highlight');

		var deferred = $.Deferred();

		// Once the CSS3 animation are end the class are removed //
		$(this.el).one('webkitAnimationEnd oanimationend msAnimationEnd animationend',   
			function(e) {
				$(self.el).removeClass('highlight');
				deferred.resolve();
		});

		return deferred;
	}


});