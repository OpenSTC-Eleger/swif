/******************************************
* Row Intervention View
*/
app.Views.ItemEquipmentView = Backbone.View.extend({

	tagName     : 'tr',

	templateHTML : 'items/itemEquipment',
	
	className   : 'row-item',

	// The DOM events //
	events       : {
		'click a.modalDeleteEquipment'  			: 'modalDeleteEquipment',
		'click a.modalSaveEquipment'  				: 'modalSaveEquipment',
		'click button.btnDeleteEquipment' 			: 'deleteEquipment',

	},



	/** View Initialization
	*/
	initialize : function() {
		this.model.off();
		console.log('EquipmentItemView initialization');
		// When the model are updated //
		this.listenTo(this.model, 'change', this.change);
		this.listenTo(this.model, 'destroy', this.destroy);
	},


	destroy: function(model){
		var self = this;
		app.Helpers.Main.highlight($(this.el)).alaways(function(){
			self.remove();
		});
		
	},
	
	/** When the model ara updated //
	*/
	change: function(model){
		this.render();
		app.Helpers.Main.highlight($(this.el));
//		var self = this;
//		model.fetch({silent: true, data: {fields: app.views.interventions.collections.interventions.fields}})
//		.done(function(){
//			self.render();
//
//			// Highlight the Row and recalculate the className //
//			app.Helpers.Main.highlight($(self.el)).done(function(){
////				self.$el.attr('class', _.result(self, 'className'));
//			});
//
//			app.notify('', 'success', app.lang.infoMessages.information, self.model.getName()+' : '+ app.lang.infoMessages.interventionUpdateOK);
//
//		})
//		.fail(function(e){
//			console.log(e);
//		});
//		
//		// Partial Render //
//		app.views.interventions.partialRender();
	},



	/** Display the view
	*/
	render : function() {
		var self = this;


		// Retrieve the template // 
		$.get("templates/" + this.templateHTML + ".html", function(templateData){

		 
			var template = _.template(templateData, {
				lang                   : app.lang,
				equipment				: self.model.toJSON()
			});

			$(self.el).html(template);
			$(self.el).attr('id','equipment_' + self.model.toJSON().id.toString());
			
			// Set the Tooltip / Popover //$(self.el).html(template);
			$('*[data-toggle="tooltip"]').tooltip();
			$('*[rel="popover"]').popover({trigger: 'hover'});

			// Set the focus to the first input of the form //
//			$('#modalCancelInter').on('shown', function (e) {
//				$(this).find('input, textarea').first().focus();
//			})
			
			$('tr.row-object').css({ opacity: '1'});
			$('tr.row-object > td').css({ backgroundColor: '#FFF'});
			$('tr.row-object:nth-child(4n+1) > td').css({backgroundColor: '#F9F9F9' });
			
		});
		$(this.el).hide().fadeIn('slow'); 
		return this;
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
	
	deleteEquipment: function(e){
		e.preventDefault();
		this.model.destroy();
	},
	
	modalSaveEquipment: function(e){
		new app.Views.ModalEquipmentView({model:this.model,el:'#modalSaveEquipment', equipments:this.options.equipments});
	},
	
});