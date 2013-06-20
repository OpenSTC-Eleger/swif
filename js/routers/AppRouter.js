/******************************************
* Application Router
*/
app.Router = Backbone.Router.extend({

	routes: {},

	mainMenus: {
		manageInterventions        : 'gestion-des-interventions',
		reporting                  : 'reporting',
		configuration              : 'configuration',
		cartographie               : 'cartographie'
	},


	/** Router Initialization
	*/
	initialize: function () {
		var self = this;

		// Create all the Routes of the app //
		_.each(app.routes, function(route, i){
			self.route(route.url, route.function);
		});

		
		// Check if the user is connect //
		this.checkConnect();
		
		// Header, Footer Initialize //    	
		//app.views.app = new app.Views.app();
		app.views.headerView = new app.Views.HeaderView();
		app.views.footerView = new app.Views.FooterView();
	},


	
	render: function (view) {
		//Close the current view
		if (this.currentView) {
			if (this.currentView.$el) this.currentView.undelegateEvents();
			this.currentView.$el = (this.currentView.el instanceof $) ? this.currentView.el : $(this.currentView.el);
			this.currentView.el = this.currentView.$el[0];
		}

		//render the new view
		view.render();

		//Set the current view
		this.currentView = view;

		return this;
	},



	/** Check if the User is connect
	*/
	checkConnect: function(){

		console.log('### checkConnect Function ###');
		
		// Check if a user exist in localStorage //
		if ( app.collections.users.length ){
			//console.log('User in the localStorage');
			
			app.models.user = app.collections.users.at(0);

			// Check if a user has a sessionID //
			if(app.models.user.hasSessionID()){
				console.log('User is connect');
				return true;
			}
			else{
				console.log('User is not connect');
				return false;
			}
		}
		else{
			console.log('User NOT in the localStorage');
			return false;
		}
	},



	/** Change the Title of the page
	*/
	setPageTitle: function(title){
		$(document).attr('title', title);
	},




	/******************************************
	* ROUTE FUNCTION
	*/

	/************* Generiq ****************/

	/** Display the login View
	*/
	login: function(){
		// Check if the user is connect //
		if(!this.checkConnect()){
			// If the view exist we reuse it //        	
			//if(app.views.loginView == null){
				app.views.loginView = new app.Views.LoginView(app.models.user);
			//}
			this.render(app.views.loginView);
		}
		else{
			this.navigate(app.routes.home.url, {trigger: true, replace: true});
		}
	},


	/** Logout the user
	*/
	logout: function(){
		app.models.user.logout();
	},


	/** About app
	*/
	about: function(){
		// Check if the user is connect //
		if(this.checkConnect()){
			// If the view exist we reuse it //
//            if(app.views.aboutView) {
//                app.views.aboutView.render();
//            }
//            else{
				app.views.aboutView = new app.Views.AboutView();
				this.render(app.views.aboutView);
//            }

		}
		else{
			this.navigate('login', {trigger: true, replace: true});
		}

	},



	/************* Request ****************/
	
	/** Requests List
	*/
	requestsList: function(page) {
		var self = this;

		// Check if the user is connect //
		if(this.checkConnect()){


			self.page = page ? parseInt(page, 10) : 1;

			// Check if the collections is instantiate //
			if(app.collections.requests == null ){
				app.collections.requests = new app.Collections.Requests();
			}

			app.collections.requests.fetch({
				beforeSend: function(){
					app.loader('display');
				},
				success: function(){
					if(app.collections.categoriesInterventions == null ){
						app.collections.categoriesInterventions = new app.Collections.CategoriesInterventions();
					}
					app.collections.categoriesInterventions.fetch({
						success: function(){
							if(app.collections.claimersServices == null ){
								app.collections.claimersServices = new app.Collections.ClaimersServices();
							}
							app.collections.claimersServices.fetch({
								success: function(){
									if(app.collections.interventions == null ){
										app.collections.interventions = new app.Collections.Interventions();
									}

									app.collections.interventions.fetch({
										success: function(){
											if(app.collections.tasks == null ){
												app.collections.tasks = new app.Collections.Tasks();        	
											}
											app.collections.tasks.fetch({							                	
													success: function(){

														if(app.collections.categoriesTasks == null ){
															app.collections.categoriesTasks = new app.Collections.CategoriesTasks();
														}
														
														app.collections.categoriesTasks.fetch({
															success: function(){
																app.views.requestsListView = new app.Views.RequestsListView({page: self.page});
																self.render(app.views.requestsListView);
															},
															complete: function(){
																app.loader('hide');
															}
														});
													}

											 });
										 }
									});
								}
							});
					   }
					});
				}
			});
		}
		else{
			this.navigate('login', {trigger: true, replace: true});
		}
	},


	/** Request Details
	*/
	detailsRequest: function (id) {

		// Check if the user is connect //
		if(this.checkConnect()){

			var self = this;

			if(app.collections.places == null){
				app.collections.places = new app.Collections.Places();
			}
			//load details after places list loaded
			if (id)
				self.request = app.collections.requests.get(id);
			else
				self.request = app.models.request.clear();           

			app.loader('display');
			app.collections.places.fetch({
				beforeSend: function(){
					app.loader('display');
				},
				success: function(){                    
					if(app.collections.claimers == null){
						app.collections.claimers = new app.Collections.Claimers();
					}
					app.collections.claimers.fetch({
						success: function(){
							if(app.collections.claimersServices == null ){
								app.collections.claimersServices = new app.Collections.ClaimersServices();
							}
							app.collections.claimersServices.fetch({
								success: function(){		                    	                                          	
									if(app.collections.claimersTypes == null){
										app.collections.claimersTypes = new app.Collections.ClaimersTypes();
									}
									app.collections.claimersTypes.fetch({
										success: function(){                    
											if(app.collections.claimersContacts == null){
												app.collections.claimersContacts = new app.Collections.ClaimersContacts();
											}
											app.collections.claimersContacts.fetch({
												success: function(){
													if(app.collections.officers == null ){
														app.collections.officers = new app.Collections.Officers();
													}
													app.collections.officers.fetch({
														success: function(){
															if(id == undefined)
																app.views.requestView = new app.Views.RequestView(self.request,  true);
															else 
																app.views.requestView = new app.Views.RequestView(self.request,  false);
															
															self.render(app.views.requestView);
															
														},
														error: function(){
															console.log('ERROR - unable to load ClaimersTypes');
														},
														complete: function(){
															app.loader('hide');
														}

														
													});
												}
											});
										}
								   });
								},
							});
						},
					});
				},
			});
		}
		else{
			this.navigate('login', {trigger: true, replace: true});
		}
	},
	




	/** Interventions list
	*/
	interventions: function(page){
		
		var self = this;
		
		// Check if the user is connect //
		if(this.checkConnect()){
			

			self.page = page ? parseInt(page, 10) : 1;
			
			if(app.collections.tasks == null ){
					app.collections.tasks = new app.Collections.Tasks();        	
			}
			
			
			app.collections.tasks.fetch({  
				
				beforeSend: function(){
					app.loader('display');
				},
				success: function(){

					// Check if the collections is instantiate //
					if(app.collections.interventions == null ){
						app.collections.interventions = new app.Collections.Interventions();
					}
		
					app.collections.interventions.fetch({
						success: function(){
							if(app.collections.requests == null ){
								app.collections.requests = new app.Collections.Requests();
							}
				
							app.collections.requests.fetch({
								success: function(){
						
									if(app.collections.categoriesTasks == null ){
										app.collections.categoriesTasks = new app.Collections.CategoriesTasks();
									}
									app.collections.categoriesTasks.fetch({
										success: function(){
											if(app.collections.equipments == null ){
												app.collections.equipments = new app.Collections.Equipments();
											}
	
										   
											app.collections.equipments.fetch({
												success: function(){
												
													if(app.collections.claimersServices == null ){
														app.collections.claimersServices = new app.Collections.ClaimersServices();
													}
													app.collections.claimersServices.fetch({
														success: function(){

															if(app.collections.officers == null ){
																app.collections.officers = new app.Collections.Officers();
															}
															
															app.collections.officers.fetch({
																success: function(){
																	app.views.interventionsListView = new app.Views.InterventionsListView({page: self.page});
																	self.render(app.views.interventionsListView);
																},
																complete: function(){
																	app.loader('hide');
																}
															});
														 },
													});
												}
											});
										 }
									 });
								}
							});
						}
					});
				}                
			});
		}
		else{
			this.navigate('login', {trigger: true, replace: true});
		}
	},
	


	/** Interventions details
	*/
	detailsIntervention: function(id) {
		// Check if the user is connect //
		if(this.checkConnect()){
			
			var self = this;
		   
	
			if(app.collections.places == null ){
				app.collections.places = new app.Collections.Places();
			}
			if (id)
				self.intervention = app.collections.interventions.get(id);
			else
				self.intervention = app.models.intervention.clear();
	
			app.collections.places.fetch({
				beforeSend: function(){
					app.loader('display');
				},
				success: function(){                
					if(app.collections.claimersServices == null ){
						app.collections.claimersServices = new app.Collections.ClaimersServices();
					}
					app.collections.claimersServices.fetch({
						success: function(){
							if(id == undefined)
								app.views.interventionView = new app.Views.InterventionView( self.intervention, true);
							else
								app.views.interventionView = new app.Views.InterventionView( self.intervention, false);

							self.render(app.views.interventionView);
						},
						complete: function(){
							app.loader('hide');
						}
					});
				}
			});
		}
		else{
			this.navigate('login', {trigger: true, replace: true});
		}
	},
	


	/** Planning
	*/
	planning: function(id){
		
		var self = this;
	
		// Check if the user is connect //
		if(this.checkConnect()){  
			
			
	
			if(app.collections.tasks == null ){
				app.collections.tasks = new app.Collections.Tasks();
			}
			
			
			app.collections.tasks.fetch({  
				beforeSend: function(){
					app.loader('display');
				},
				success: function(){
					if(app.collections.interventions == null ){
						app.collections.interventions = new app.Collections.Interventions();        	
					}

				
					app.collections.interventions.fetch({
						success: function(){
							if(app.collections.claimersServices == null ){
								app.collections.claimersServices = new app.Collections.ClaimersServices();
							}
							app.collections.claimersServices.fetch({
								success: function(){
									if(app.collections.officers == null ){
										app.collections.officers = new app.Collections.Officers();
									}
									app.collections.officers.fetch({
										success: function(){
											if(app.collections.teams == null ){
												app.collections.teams = new app.Collections.Teams();
											}
										
											app.collections.teams.fetch({
												success: function(){
													if(app.collections.places == null ){
														app.collections.places = new app.Collections.Places();
													}
												
													app.collections.places.fetch({
														success: function(){
															if(app.collections.categoriesTasks == null ){
																app.collections.categoriesTasks = new app.Collections.CategoriesTasks();
															}
															app.collections.categoriesTasks.fetch({
																success: function(){
																	if(app.collections.absentTypes == null ){
																		app.collections.absentTypes = new app.Collections.AbsentTypes();
																	}
	
																   
																	app.collections.absentTypes.fetch({
																		success: function(){
																			if(app.collections.equipments == null ){
																				app.collections.equipments = new app.Collections.Equipments();
																			}
	
																		   
																			app.collections.equipments.fetch({
																				success: function(){
																					app.views.planningView = new app.Views.PlanningView(id);
																					self.render(app.views.planningView);
																				},
																				complete: function(){
																					//app.loader('hide');
																				}
																			});
																		}
																	});
																 }
															});													         
														}
													});
												 }
											});
										}			        	
									});	
								}
							});
						} 			        		
					});	
				} 
			});
		}
		else{
			this.navigate('login', {trigger: true, replace: true});
		}
	   
	},



	tasksCheck: function(year, week){
	
		console.debug("****************tasksCheck********************");
		
		// Check if the user is connect //
		if(this.checkConnect()){
			var self = this;
			

			self.yearSelected = year;
			self.weekSelected = week;
 
			if(app.collections.interventions == null ){
				app.collections.interventions = new app.Collections.Interventions();
			}
			
			
			app.collections.interventions.fetch({
				beforeSend: function(){
					app.loader('display');
				},
				success: function(){

					if(app.collections.tasks == null ){
						app.collections.tasks = new app.Collections.Tasks();
					}
					app.collections.tasks.fetch({
						success: function(){
							if(app.collections.teams == null ){
								app.collections.teams = new app.Collections.Teams();
							}

							app.collections.teams.fetch({
								success: function(){
									if(app.collections.places == null ){
										app.collections.places = new app.Collections.Places();
									}
									app.collections.places.fetch({						        						        	
										success: function(){
											if(app.collections.equipments == null ){
												app.collections.equipments = new app.Collections.Equipments();
											}
	
										   
											app.collections.equipments.fetch({
												success: function(){
													if(app.collections.categoriesTasks == null ){
														app.collections.categoriesTasks = new app.Collections.CategoriesTasks();
													}
	
												   
													app.collections.categoriesTasks.fetch({

														success: function(){

															if(app.collections.officers == null ){
																app.collections.officers = new app.Collections.Officers();
															}
															
															app.collections.officers.fetch({
																success: function(){

																	if(app.collections.claimersServices == null ){
																		app.collections.claimersServices = new app.Collections.ClaimersServices();
																	}
																	

																	app.collections.claimersServices.fetch({
																		success: function(){

																		   app.views.tasksListView = new app.Views.TasksListView({yearSelected: self.yearSelected, weekSelected: self.weekSelected});
																		   self.render(app.views.tasksListView);
																		},
																		complete: function(){
																			app.loader('hide');
																		}
																	});
																}
															});
														}
													});
												}
											});
										}
									});
								}
							});
						}		        		
					});
				}			        		
			});
		}
		else{
			this.navigate('login', {trigger: true, replace: true});
		}

	},



	detailsTask: function(id){		
		console.debug("****************detailsTask********************");
		// Check if the user is connect //
		if(this.checkConnect()){
			var self = this;
			var task = app.collections.tasks.get(id);
			self.task = task;   
			
			if(app.collections.interventions == null ){
				app.collections.interventions = new app.Collections.Interventions();
			}
			
			app.loader('display');
			app.collections.interventions.fetch({
				success: function(){
			
					if(app.collections.tasks == null ){
						app.collections.tasks = new app.Collections.Tasks();
					}

					app.collections.tasks.fetch({
						success: function(){
						 if(app.collections.officers == null ){
								app.collections.officers = new app.Collections.Officers();
							}
							app.collections.officers.fetch({
								 success: function(){
									if(app.collections.categoriesTasks == null ){
										app.collections.categoriesTasks = new app.Collections.CategoriesTasks();
									}				                   
									app.collections.categoriesTasks.fetch({
										success: function(){
											 if(app.collections.claimersServices == null ){
												app.collections.claimersServices = new app.Collections.ClaimersServices();
											}


											app.collections.claimersServices.fetch({
												success: function(){
													app.views.taskView = new app.Views.TaskView(self.task, false);
													self.render(app.views.taskView);
											   
												},
												complete: function(){
													app.loader('hide');
												}
											});
										}
								   });
								}
							});
						 }
					});
				}
			});
		}
		else{
			this.navigate('login', {trigger: true, replace: true});
		}
	},



	/** Places management
	*/
	places: function(page){      

		// Check if the user is connect //
		if(this.checkConnect()){
			var self = this;


			self.page = page ? parseInt(page, 10) : 1;

			// Check if the collections is instantiate //
			if(app.collections.places == null ){
				app.collections.places = new app.Collections.Places();
			}

		   
			app.collections.places.fetch({
				beforeSend: function(){
					app.loader('display');
				},
				success: function(){
					// Check if the collections is instantiate //
					if(app.collections.claimersServices == null ){
						app.collections.claimersServices = new app.Collections.ClaimersServices();
					}
	
					
					app.collections.claimersServices.fetch({
						success: function(){
							if(app.collections.placetypes == null ){
								app.collections.placetypes = new app.Collections.PlaceTypes();
							}
							app.collections.placetypes.fetch({	
								success: function(){
									app.views.placesListView = new app.Views.PlacesListView({page: self.page});
									self.render(app.views.placesListView);
								},
								complete: function(){
									app.loader('hide');
								}
							});
						 }

					 });
				 }
			});
		}
		else{
			this.navigate('login', {trigger: true, replace: true});
		}
	},

	/** Places management
			*/
//    detailsPlace: function(id){      
//
//        // Check if the user is connect //
//        if(this.checkConnect()){
//            var self = this;
//
//            // Check if the collections is instantiate //
//            if(app.collections.places == null ){
//                app.collections.places = new app.Collections.Places();
//            }
//
//            if (id)
//	        	self.place = app.collections.places.get(id);
//	        else
//	        	self.place = app.models.place;
//           
//            app.collections.places.fetch({
//                beforeSend: function(){
//                	app.loader('display');
//            	},
//            	success: function(){
//	                // Check if the collections is instantiate //
//	                if(app.collections.claimersServices == null ){
//	                    app.collections.claimersServices = new app.Collections.ClaimersServices();
//	                }
//	
//	                
//	                app.collections.claimersServices.fetch({
//	                	success: function(){
//		                	if(app.collections.placetypes == null ){
//		                        app.collections.placetypes = new app.Collections.PlaceTypes();
//		                    }
//		                	app.collections.placetypes.fetch({	
//				                success: function(){
//				                    app.views.placeView = new app.Views.PlaceView(self.place);
//				                    self.render(app.views.placeView);
//				                },
//				                complete: function(){
//				                    app.loader('hide');
//				                }
//					        });
//					     }
//		                
//		             });
//		         }
//            });
//        }
//        else{
//            this.navigate('login', {trigger: true, replace: true});
//        }
//    },


	/** Services management
	*/
	services: function(page){      

		// Check if the user is connect //
		if(this.checkConnect()){
			var self = this;


			self.page = page ? parseInt(page, 10) : 1;

			// Check if the collections is instantiate //
			if(app.collections.claimersServices == null ){
				app.collections.claimersServices = new app.Collections.ClaimersServices();
			}


			app.collections.claimersServices.fetch({
				beforeSend: function(){
					app.loader('display');
				},
				success: function(){
					if(app.collections.officers == null ){
						app.collections.officers = new app.Collections.Officers();
					}
					app.collections.officers.fetch({
						success: function(){
							if(app.collections.groups == null ){
								app.collections.groups = new app.Collections.Groups();
							}
							app.collections.groups.fetch({
								success: function(){
									app.views.servicesListView = new app.Views.ServicesListView({page: self.page});
									self.render(app.views.servicesListView);
								}
							});
						 }
					});
				},
				complete: function(){
					app.loader('hide');
				}
			});
		}
		else{
			this.navigate('login', {trigger: true, replace: true});
		}
	},
	
	

	/** Services management
	*/
	detailsService: function(id){      

		// Check if the user is connect //
		if(this.checkConnect()){
			var self = this;



			// Check if the collections is instantiate //
			if(app.collections.claimersServices == null ){
				app.collections.claimersServices = new app.Collections.ClaimersServices();
			}
			
			if (id)
				self.service = app.collections.claimersServices.get(id);
			else
				self.service = app.models.service;

			app.collections.claimersServices.fetch({
				beforeSend: function(){
					app.loader('display');
				},                
				success: function(){
					if(app.collections.officers == null ){
						app.collections.officers = new app.Collections.Officers();
					}
					app.collections.officers.fetch({
						success: function(){
							app.views.serviceView = new app.Views.ServiceView(self.service);
							self.render(app.views.serviceView);
						},
						complete: function(){
							app.loader('hide');
						}
					});
				}
			});
		}
		else{
			this.navigate('login', {trigger: true, replace: true});
		}
	},



	/** Categories Tasks management
	*/
	categoriesTasks: function(page){      

		// Check if the user is connect //
		if(this.checkConnect()){
			var self = this;


			self.page = page ? parseInt(page, 10) : 1;

			// Check if the collections is instantiate //
			if(app.collections.categoriesTasks == null ){
				app.collections.categoriesTasks = new app.Collections.CategoriesTasks();
			}


			app.collections.categoriesTasks.fetch({
				beforeSend: function(){
					app.loader('display');
				},
				success: function(){
					if(app.collections.claimersServices == null ){
						app.collections.claimersServices = new app.Collections.ClaimersServices();
					}
					app.collections.claimersServices.fetch({
						success: function(){
							app.views.categoriesTasksListView = new app.Views.CategoriesTasksListView({page: self.page});
							self.render(app.views.categoriesTasksListView);
						}
					});
				},
				complete: function(){
					app.loader('hide');
				}
			});
		}
		else{
			this.navigate('login', {trigger: true, replace: true});
		}
	},



	/** Categories Interventions management
	*/
	categoriesInterventions: function(page){      

		// Check if the user is connect //
		if(this.checkConnect()){
			var self = this;


			self.page = page ? parseInt(page, 10) : 1;

			// Check if the collections is instantiate //
			if(app.collections.categoriesInterventions == null ){
				app.collections.categoriesInterventions = new app.Collections.CategoriesInterventions();
			}


			app.collections.categoriesInterventions.fetch({
				beforeSend: function(){
					app.loader('display');
				},
				success: function(){
					app.views.categoriesInterventionsListView = new app.Views.CategoriesInterventionsListView({page: self.page});
					self.render(app.views.categoriesInterventionsListView);
				},
				complete: function(){
					app.loader('hide');
				}
			});
		}
		else{
			this.navigate('login', {trigger: true, replace: true});
		}
	},



	/** Teams management
	*/
	teams: function(page){      

		// Check if the user is connect //
		if(this.checkConnect()){
			var self = this;


			self.page = page ? parseInt(page, 10) : 1;

			// Check if the collections is instantiate //
			if(app.collections.teams == null ){
				app.collections.teams = new app.Collections.Teams();
			}

			// Check if the collections is instantiate //
			if(app.collections.claimersServices == null ){
				app.collections.claimersServices = new app.Collections.ClaimersServices();
			}

			if(app.collections.officers == null ){
				app.collections.officers = new app.Collections.Officers();
			}

				
			app.collections.teams.fetch({
				beforeSend: function(){
					app.loader('display');
				},
				success: function(){

					app.collections.claimersServices.fetch({
						success: function(){

							app.collections.officers.fetch({
								success: function(){
									if(app.collections.groups == null ){
										app.collections.groups = new app.Collections.Groups();
									}
									app.collections.groups.fetch({
										success: function(){
											app.views.teamsListView = new app.Views.TeamsListView({page: self.page});
											self.render(app.views.teamsListView);
										}
									});
								}
							});
						}
					});
				},
				complete: function(){
					app.loader('hide');
				}
			});
		}
		else{
			this.navigate('login', {trigger: true, replace: true});
		}
	},



	/** Claimers management
	*/
	claimers: function(page){      

		// Check if the user is connect //
		if(this.checkConnect()){
			var self = this;


			self.page = page ? parseInt(page, 10) : 1;

			// Check if the collections is instantiate //
			if(app.collections.claimers == null ){
				app.collections.claimers = new app.Collections.Claimers();
			}

			app.collections.claimers.fetch({
				beforeSend: function(){
					app.loader('display');
				},
				success: function(){
					if(app.collections.claimersTypes == null ){
						app.collections.claimersTypes = new app.Collections.ClaimersTypes();
					}

					app.collections.claimersTypes.fetch({
						success: function() {
							if(app.collections.claimersServices == null ){
								app.collections.claimersServices = new app.Collections.ClaimersServices();
							}

							app.collections.claimersServices.fetch({
								success: function() {
									if(app.collections.places == null ){
										app.collections.places = new app.Collections.Places();
									}

									app.collections.places.fetch({
										success: function() {
											if(app.collections.claimersContacts == null ){
												app.collections.claimersContacts = new app.Collections.ClaimersContacts();
											}
										   
											app.collections.claimersContacts.fetch({
												success: function(){
													if(app.collections.officers == null ){
														app.collections.officers = new app.Collections.Officers();
													}
													
													app.collections.officers.fetch({
														success: function() {
														   app.views.claimersListView = new app.Views.ClaimersListView({page: self.page});
														   self.render(app.views.claimersListView);
														},
													   complete: function(){
														   app.loader('hide');
													   }
													});
												}
											});
										},
									});
								}
							});
						},
					});
				}
			});
		}
		else{
			this.navigate('login', {trigger: true, replace: true});
		}
	},



	/** Types management
	*/
	types: function(page){      

		// Check if the user is connect //
		if(this.checkConnect()){
			var self = this;


			self.page = page ? parseInt(page, 10) : 1;

			// Check if the collections is instantiate //
			if(app.collections.claimersTypes == null ){
				app.collections.claimersTypes = new app.Collections.ClaimersTypes();
			}


			app.collections.claimersTypes.fetch({
				beforeSend: function(){
					app.loader('display');
				},
				success: function(){
					app.views.claimersTypesView = new app.Views.ClaimersTypesView({page: self.page});
					self.render(app.views.claimersTypesView);
				},
				complete: function(){
					app.loader('hide');
				}
			});
		}
		else{
			this.navigate('login', {trigger: true, replace: true});
		}
	},
	
	
	
	/** Abstent types
	*/
	absentTypes: function(page){      

		// Check if the user is connect //
		if(this.checkConnect()){
			var self = this;


			self.page = page ? parseInt(page, 10) : 1;

			// Check if the collections is instantiate //
			if(app.collections.absentTypes == null ){
				app.collections.absentTypes = new app.Collections.AbsentTypes();
			}


			app.collections.absentTypes.fetch({
				beforeSend: function(){
					app.loader('display');
				},
				success: function(){
					app.views.absentTypesListView = new app.Views.AbsentTypesListView({page: self.page});
					self.render(app.views.absentTypesListView);
				},
				complete: function(){
					app.loader('hide');
				}
			});
		}
		else{
			this.navigate('login', {trigger: true, replace: true});
		}
	},
	


	/** equipments
	*/
	equipments: function(page){      

		// Check if the user is connect //
		if(this.checkConnect()){
			var self = this;


			self.page = page ? parseInt(page, 10) : 1;

			// Check if the collections is instantiate //
			if(app.collections.equipments == null ){
				app.collections.equipments = new app.Collections.Equipments();
			}

		   
			app.collections.equipments.fetch({
				beforeSend: function(){
					app.loader('display');
				},
				success: function(){
					if(app.collections.claimersServices == null ){
						app.collections.claimersServices = new app.Collections.ClaimersServices();
					}

					app.collections.claimersServices.fetch({
						success: function() {
							app.views.equipmentsListView = new app.Views.EquipmentsListView({page: self.page});
							self.render(app.views.equipmentsListView);
						},
						complete: function(){
							app.loader('hide');
						}
					});
				}
			});
		}
		else{
			this.navigate('login', {trigger: true, replace: true});
		}
	},
	
});
