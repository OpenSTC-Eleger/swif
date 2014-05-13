/*!
 * SWIF-OpenSTC
 * Copyright 2013-2014 Siclic <contact@siclic.fr>
 * Licensed under AGPL-3.0 (https://www.gnu.org/licenses/agpl.txt)
 */

define(['app',
		'appHelpers',

		'bookingModelExtend',
		'bookingLineModel',
		'bookingRecurrenceModel',
		'bookableModel',
		'bookingLinesCollection',
		'bookablesCollection',
		'claimersCollection',
		'claimersContactsCollection',

		'itemFormBookingLineView',
		'formRecurrenceView',
		'advancedSelectBoxView',
		'moment',
		'moment-timezone',
		'moment-timezone-data',
		'bsTimepicker',
		'bsDatepicker-lang',
		'bsSwitch'

], function (app, AppHelpers, BookingModel, BookingLineModel, BookingRecurrenceModel, BookableModel, BookingLinesCollection, BookablesCollection, ClaimersCollection, ClaimersContactsCollection, ItemFormBookingLineView, FormRecurrenceView, AdvancedSelectBoxView, moment) {

	'use strict';


	/******************************************
	* Booking Form View
	*/
	var FormBookingView = Backbone.View.extend({


		el          : '#rowContainer',

		templateHTML: '/templates/forms/form_booking.html',



		// The DOM events //
		events: {
			'change #bookingPartner'     : 'changeBookingPartner',
			'change #bookingContact'     : 'changeBookingContact',
			'change #bookingAddBookable' : 'changeBookingAddBookable',

			'change #bookingCheckin'     : 'changeBookingCheckin',
			'change #bookingCheckout'    : 'changeBookingCheckout',
			'change #bookingCheckinHour' : 'changeBookingCheckin',
			'change #bookingCheckoutHour': 'changeBookingCheckout',

			'blur #bookingName'          : 'changeName',
			'blur #bookingNote'          : 'changeNote',
			'blur #bookingPeopleName'    : 'changePeopleName',
			'blur #bookingPeoplePhone'   : 'changePeoplePhone',
			'blur #bookingPeopleMail'    : 'changePeopleEmail',
			'blur #bookingPeopleStreet'  : 'changePeopleStreet',
			'blur #bookingPeopleCity'    : 'changePeopleCity',
			'blur #bookingPeopleZip'     : 'changePeopleZip',

			//Form Buttons
			'click #saveFormBooking'     : 'saveBookingForm',
			'click #postFormBooking'     : 'postBookingForm',
			'click #redraftFormBooking'  : 'redraftBookingForm',
			'click #getRecurrenceDates'  : 'getRecurrenceDates',
			'switchChange.bootstrapSwitch #bookingAddRecurrence': 'changeAddRecurrence',
			'switchChange.bootstrapSwitch #bookingIsCitizen'    : 'changeIsCitizen',
			'switchChange.bootstrapSwitch #bookingWholeDay'     : 'changeWholeDay',
		},
		/**
		 *@param id: id of Booking to route to
		 *@return: url to call to go to specified Booking (or to create new Booking if id is not set)
		*/
		urlBuilder: function(id){
			var url = _.strLeft(app.routes.formReservation.url, '(');
			var params = '';
			if(!_.isUndefined(id)){
				params = 'id/' + id.toString();
			}
			return _.join('/','#' + url, params);
		},

		initializeWithNonPersistedModel: function(){
			var self = this;

			this.model.updateLinesData().done(function(){
				app.router.render(self);
			});
		},

		initializeWithId: function(){
			var self = this;
			this.model.set({id:this.options.id},{silent:true});
			this.model.fetchFromBackend().done(function(){
				app.router.render(self);
			});
		},

		/** View Initialization
		*/
		initialize : function(params) {
			this.options = params;
			var self = this;
			if(_.isUndefined(this.model)){
				this.model = new BookingModel();
			}

			this.claimers = new ClaimersCollection();
			this.isClaimer = !app.current_user.isResaManager();
			var ret = {};

			//if view is called with a filled model (new booking from calendar or new form 'from scratch')
			if(_.isUndefined(self.options.id)){
				//if user is a claimer, retrieve it's corresponding partner and partner_contact
				if(self.isClaimer){
					app.current_user.fetchContactAndClaimer(ret).done(function(){
						self.model.setClaimer([ret.claimer.id, ret.claimer.name]);
						self.model.setClaimerContact([ret.contact.id, ret.contact.name]);
						self.initializeWithNonPersistedModel();
					});
				}
				else{
					self.initializeWithNonPersistedModel();
				}
			}
			//else, init view fetching model from db
			else{
				self.initializeWithId();
			}

			self.listenTo(self.model, 'change', self.updateDisplayDoms);
			self.listenTo(self.model.lines, 'add', self.updateDisplayDoms);
			self.listenTo(self.model.linesToRemove, 'add', self.updateDisplayDoms);
		},

		//compute if form can be modified or not
		isEditable: function(){
			return this.model.getState() == BookingModel.status.draft.key;
		},

		//compute display of button addBookable (readonly or visible)
		updateDisplayAddBookable: function(){
			var elt = $('#bookingAddBookable');
			if(this.isEditable() && this.model.getStartDate() != '' && this.model.getEndDate() != '' && this.model.getClaimer('id') != false){
				elt.removeAttr('disabled');
			}
			else{
				elt.attr('disabled','');
			}
			if(!_.isUndefined(app.views.selectListAddBookableView)){
				app.views.selectListAddBookableView.render();
			}
		},

		//compute display of button save (readonly or visible)
		updateDisplaySave: function(){
			var elt = $('button[form="formSaveBooking"]');
			if(this.isEditable() && this.model.getStartDate() != ''
				&& this.model.getEndDate() != '' && this.model.getClaimer('id') != false
				&& this.model.lines.length > 0 && this.model.getAllDispo()){
				elt.removeAttr('disabled');
			}
			else{
				elt.attr('disabled','');
			}
		},

		//compute display of button addRecurrence (readonly or visible)
		updateDisplayAddRecurrence: function(){
			var elt = $('#bookingAddRecurrence');
			//@TODO: remove isHidden when tests are finished
			var isHidden = this.recurrence != null && !this.isTemplate();
			if(!isHidden && this.isEditable() && this.model.lines.length > 0){
				elt.bootstrapSwitch('disabled', false);
			}
			else{
				elt.bootstrapSwitch('disabled', true);
			}
		},

		updateDisplayCitizenInfos: function(){

			var val = $('#bookingIsCitizen').bootstrapSwitch('state');
			if(this.isClaimer){
				$('#bookingIsCitizen').bootstrapSwitch('state', false);
			}
			if(val){
				$('#blockBookingContact').addClass('hide-soft');
				$('#citizenInfos').removeClass('hide-soft');
			}
			else{
				$('#blockBookingContact').removeClass('hide-soft');
				$('#citizenInfos').addClass('hide-soft');
			}
			if(!_.isUndefined(app.views.selectListClaimersContactsView)){
			}
		},

		//main method to compute all conditionnal display of form inputs
		updateDisplayDoms: function(model){
			this.updateDisplayAddBookable();
			this.updateDisplayAddRecurrence();
			this.updateDisplaySave();
			this.updateDisplayCitizenInfos();
		},

		/**split rendering of form and rendering of lines to avoid change-events conflicts
		 * (which perform unwanted updates on lineModels)
		 */
		renderLines: function(){
			var self = this;
			_.each(this.model.lines.models, function(lineModel){
				var lineView = new ItemFormBookingLineView({model:lineModel});
				$(self.el).find('#bookingLines').append(lineView.render().el);
			});
		},

		renderRecurrence: function(){
			if(this.model.recurrence != null){
				var recurrenceView = new FormRecurrenceView({model:this.model.recurrence});
				$(this.el).find('#recurrence').html(recurrenceView.render().el);
			}
		},


		/** Display the view
		*/
		render: function(loader) {
			//boolean to know if form is fully rendered or not, used to avoid pb of change events
			this.viewRendered = false;
			var pageTitle = '';
			if(_.isNull(this.model.getId())) {
				pageTitle = app.lang.resa.viewsTitles.newAskingBooking;
			}
			else{
				pageTitle = app.lang.resa.viewsTitles.reservationDetails +' '+ this.model.getId();
			}

			// Change the page title //
			app.router.setPageTitle(pageTitle);

			var self = this;
			// Retrieve the template //
			$.get(app.menus.openresa + this.templateHTML, function(templateData){
				//compute dates with user TZ
				var checkin = self.model.getAttribute('checkin',false);
				var checkout = self.model.getAttribute('checkout',false);
				var startDate = '';
				var startHour = '';
				var endDate = '';
				var endHour = '';

				if(checkin != false && checkout != false){
					checkin = AppHelpers.convertDateToTz(checkin);
					checkout = AppHelpers.convertDateToTz(checkout);

					startDate = checkin.format('D/M/YYYY');
					startHour = checkin.format('H:m');
					endDate = checkout.format('D/M/YYYY');
					endHour = checkout.format('H:m');
				}

				var template = _.template(templateData, {
					lang   		: app.lang,
					pageTitle   : pageTitle,
					booking		: self.model,
					loader 		: loader,
					startDate	: startDate,
					startHour	: startHour,
					endDate 	: endDate,
					endHour		: endHour,
					readonly	: !self.isEditable(),
					user		: app.current_user
				});

				$(self.el).html(template);

				self.renderLines();
				self.renderRecurrence();

				if(self.isClaimer){
					$('#bookingPartner').attr('disabled');
					$('#bookingContact').attr('disabled');
				}

				$('*[data-toggle="tooltip"]').tooltip();
				$('.make-switch').bootstrapSwitch();
				$('.timepicker-default').timepicker({ showMeridian: false, disableFocus: true, showInputs: true, modalBackdrop: false});
				$(".datepicker").datepicker({ format: 'dd/mm/yyyy',	weekStart: 1, autoclose: true, language: 'fr' });

				// Booking Claimer //
				app.views.selectListClaimersView = new AdvancedSelectBoxView({el: $('#bookingPartner'), url: ClaimersCollection.prototype.url });
				app.views.selectListClaimersView.resetSearchParams();
				app.views.selectListClaimersView.render();

				// Booking Contact //
				app.views.selectListClaimersContactsView = new AdvancedSelectBoxView({el: $('#bookingContact'), url: ClaimersContactsCollection.prototype.url });
				app.views.selectListClaimersContactsView.resetSearchParams();
				app.views.selectListClaimersContactsView.render();

				//selectBox to add bookables to booking
				app.views.selectListAddBookableView = new AdvancedSelectBoxView({el: $('#bookingAddBookable'), url: BookablesCollection.prototype.url }),
				app.views.selectListAddBookableView.resetSearchParams();
				app.views.selectListAddBookableView.render();

				//i initialize advancedSelectBox here to correctly trigger change event at init (and so, perform correct view updates)
				var partner = self.model.getClaimer('array');
				if(partner != 0){
					app.views.selectListClaimersView.setSelectedItem(partner);
					self.changeBookingPartner();
				}
				var contact = self.model.getClaimerContact('array');
				if(contact != 0){
					app.views.selectListClaimersContactsView.setSelectedItem(self.model.getClaimerContact('array'));
					self.changeBookingContact();
				}
				//manually fire listeners to apply dynamic DOM visibilities and filter to selectBoxes
				self.changeIsCitizen();
				self.updateDisplayCitizenInfos();
				self.changeWholeDay();
				$(this.el).hide().fadeIn('slow');
				self.viewRendered = true;
			});
			return this;
		},

		/*
		 * Update searchParam of ClaimerContact (partner.id = self if partner_id is set, else, remove searchParams)
		 */
		changeBookingPartner: function(e){
			var silent = !this.viewRendered;
			var partner_id = app.views.selectListClaimersView.getSelectedItem();
			if(partner_id != ''){
				app.views.selectListClaimersContactsView.setSearchParam({'field':'partner_id.id','operator':'=','value':partner_id},true);
				this.model.setClaimer([partner_id,app.views.selectListClaimersView.getSelectedText()], silent);
			}
			else{
				app.views.selectListClaimersContactsView.resetSearchParams();
				this.model.setClaimer(false, silent);
			}
		},

		changeBookingContact: function(e){
			if(this.viewRendered){
				var contact_id = app.views.selectListClaimersContactsView.getSelectedItem();
				if(contact_id){
					this.model.setClaimerContact([contact_id, app.views.selectListClaimersContactsView.getSelectedText()]);
				}
				else{
					this.model.setClaimerContact(false);
				}
			}
		},

		/*
		 * each time a bookable is selected on AdvancedSelectBox, we create a new itemView (not any save before user click on validate)
		 */
		changeBookingAddBookable: function(e){
			if(this.viewRendered){
				var self = this;
				e.preventDefault();
				//create lineModel and initialize values
				var bookable_id = app.views.selectListAddBookableView.getSelectedItem();
				if(bookable_id != ''){
					var bookable_name = app.views.selectListAddBookableView.getSelectedText();
					var lineModel = new BookingLineModel({
						reserve_product:[bookable_id, bookable_name],
						pricelist_amount:0});

					lineModel.setQuantity(1);
					lineModel.bookable = new BookableModel({id:bookable_id});
					//reset selection to be able to add another bookable to booking
					app.views.selectListAddBookableView.reset();

					//perform manually updates to lineModel to get pricing, dispo, ...
					var partner_id = this.model.getClaimer('id');
					var checkin = this.model.getStartDate();
					var checkout = this.model.getEndDate();
					$.when(lineModel.fetchAvailableQtity(checkin,checkout),
					lineModel.fetchPricing(partner_id,checkin,checkout),
					lineModel.bookable.fetch()).always(function(){
						self.model.addLine(lineModel);
						var lineView = new ItemFormBookingLineView({model:lineModel});
						$(self.el).find('#bookingLines').append(lineView.render().el);
					})
					.fail(function(e){
						console.log(e);
					});
				}
			}
		},

		changeBookingCheckin: function(e){
			if(this.viewRendered){
				e.preventDefault();
				if($("#bookingCheckin").val() != '' && $("#bookingCheckinHour").val() != ''){
					var dateVal = new moment( $("#bookingCheckin").val(),"DD-MM-YYYY")
					.add('hours',$("#bookingCheckinHour").val().split(":")[0] )
					.add('minutes',$("#bookingCheckinHour").val().split(":")[1] );
					this.model.setStartDate(moment.utc(dateVal).format('YYYY-MM-DD HH:mm:ss'));
				}
				else{
					this.model.setStartDate('');
				}
			}
		},

		changeBookingCheckout: function(e){
			if(this.viewRendered){
				e.preventDefault();
				if($("#bookingCheckout").val() != '' && $("#bookingCheckoutHour").val() != ''){
					var dateVal = new moment( $("#bookingCheckout").val(),"DD-MM-YYYY")
					.add('hours',$("#bookingCheckoutHour").val().split(":")[0] )
					.add('minutes',$("#bookingCheckoutHour").val().split(":")[1] );
					this.model.setEndDate(moment.utc(dateVal).format('YYYY-MM-DD HH:mm:ss'));
				}
				else{
					this.model.setEndDate('');
				}
			}
		},

		changeName: function(e){
			this.model.setName($("#bookingName").val());
		},

		changeNote: function(e){
			this.model.set({note:$("#bookingNote").val()},{silent:true});
		},

		changeIsCitizen: function(e){
			var val = $('#bookingIsCitizen').bootstrapSwitch('state');
			this.model.setFromCitizen(val, false);
			if(val){
				app.views.selectListClaimersView.setSearchParam({field:'type_id.code', operator:'ilike', value:'PART'},true);
			}
			else{
				app.views.selectListClaimersView.resetSearchParams();
			}
			this.changeBookingPartner();
		},

		changePeopleName: function(e){
			this.model.setCitizenName($('#bookingPeopleName').val(),true);
		},

		changePeoplePhone: function(e){
			this.model.setCitizenPhone($('#bookingPeoplePhone').val(),true);
		},

		changePeopleEmail: function(e){
			this.model.setClaimerMail($('#bookingPeopleMail').val(),true);
		},

		changePeopleStreet: function(e){
			this.model.set({'people_street':$('#bookingPeopleStreet').val()},{silent:true});
		},

		changePeopleCity: function(e){
			this.model.set({'people_city':$('#bookingPeopleCity').val()},{silent:true});
		},

		changePeopleZip: function(e){
			this.model.set({'people_zip':$('#bookingPeopleZip').val()},{silent:true});
		},

		changeWholeDay: function(e){
			var val = $('#bookingWholeDay').bootstrapSwitch('state');
			this.model.set({'whole_day':val},{silent:true});
			if(val){
				$('#bookingCheckinHour').val('00:00');
				$('#blockBookingCheckinHour').addClass('hide');
				$('#bookingCheckoutHour').val('23:59');
				$('#blockBookingCheckoutHour').addClass('hide');

			}
			else{
				$('#blockBookingCheckinHour').removeClass('hide');
				$('#blockBookingCheckoutHour').removeClass('hide');
			}
		},

		/**
		 * Save form and evolve workflow from 'draft' to 'remplir' state. Adapt url to call if it's a recurrente or a simple booking
		 */
		postBookingForm: function(e){
			var self = this;
			e.preventDefault();
			this.model.saveToBackend()
			.done(function(){
				var model = (self.model.isTemplate() && self.model.recurrence != null) ? self.model.recurrence : self.model;
				model.save({state_event:"save"},{wait:true,patch:true}).always(function(){
					window.history.back();
				});
			})
			.fail(function(e){
				console.log(e);
			});
		},

		/**
		 * evolve workflow to 'draft' state, fetch the model and render this view to update widget states (visible, readonly, etc.)
		 */
		redraftBookingForm: function(e){
			e.preventDefault();
			var self = this;
			var model = (self.model.isTemplate() && self.model.recurrence != null) ? self.model.recurrence : self.model;
			model.save({state_event:"redraft"}, {wait:true, patch:true}).done(function(){
				self.model.fetchFromBackend().done(function(){
					self.render();
				});
			});
		},

		/**
		 * Save only form, do not evolve workflow
		 */
		saveBookingForm: function(e){
			e.preventDefault();
			this.model.saveToBackend()
			.done(function(){
				//window.history.back();
				app.router.navigate(_.strLeft(app.routes.reservations.url, '('), {trigger: true, replace: true});
			})
			.fail(function(e){
				console.log(e);
			});
		},

		changeAddRecurrence: function(e){
			var val = $('#bookingAddRecurrence').bootstrapSwitch('state');
			if(val){
				this.addRecurrence(e);
			}
			else{
				this.removeRecurrence(e);
			}
		},

		addRecurrence: function(e){
			e.preventDefault();
			var recurrenceModel = new BookingRecurrenceModel();
			recurrenceModel.setTemplate(this.model);
			recurrenceModel.setStartDate(this.model.getStartDate());
			var recurrenceView = new FormRecurrenceView({model:recurrenceModel});
			$(this.el).find('#recurrence').html(recurrenceView.render().el);
		},

		removeRecurrence: function(e){
			e.preventDefault();
			if(this.model.recurrence != null){
				this.model.destroyRecurrenceOnBackend();
			}
		}

	});
	return FormBookingView;
})