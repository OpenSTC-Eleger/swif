/******************************************
* Application Router
*/
app.Router = Backbone.Router.extend({


    homePage : 'demandes-dinterventions',

    routes: {
        ''                                      : 'requestsList',
        'login'                                 : 'login',
        'logout'                                : 'logout',
        'about'                                 : 'about',
        'interventions'                         : 'interventions',
        'interventions/add'           			: 'detailsIntervention',
        'interventions/:id'    					: 'detailsIntervention',
        
        'planning'                         		: 'planning',
        'planning/agents/:id'					: 'planning',

        'demandes-dinterventions'               : 'requestsList',
        'demandes-dinterventions/page:page'     : 'requestsList',
        'demandes-dinterventions/add'           : 'addRequest',
        'demandes-dinterventions/:id'           : 'detailsRequest',

        'taches'               					: 'tasksCheck',
        'taches/:year/:week'                    : 'tasksCheck',
        'taches/add'           					: 'addTask',
        'taches/:id'           					: 'detailsTask',

        'sites'                                 : 'places',
        'sites/page:page'                       : 'places',
        'sites/add'           					: 'detailsPlace',
        'sites/:id'    							: 'detailsPlace',

        'services'                              : 'services',
        'services/page:page'                    : 'services',
        'services/add'           				: 'detailsService',
        'services/:id'    						: 'detailsService',

        'categories'                            : 'categories',
        'categories/page:page'                  : 'categories',

        'employes-municipaux'                   : 'officers',
        'employes-municipaux/page:page'         : 'officers',

        'equipes'                               : 'teams',
        'equipes/page:page'                     : 'teams',

        'demandeurs'                            : 'claimers',
        'demandeurs/page:page'                  : 'claimers',
        
        'types'                            		: 'types',
        'types/page:page'                  		: 'types',
        
		'types-dabscence'                       : 'absentTypes',
		'types-dabscence/page:page'             : 'absentTypes',
    },

    
    mainMenus: {
        manageInterventions        : 'gestion-des-interventions',
        reporting                  : 'reporting',
        configuration              : 'configuration'
    },


    /** Router Initialization
    */
    initialize: function () {    	
    	
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
            this.navigate(this.homePage, {trigger: true, replace: true});
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
	            	if(app.collections.assignements == null ){
	            		app.collections.assignements = new app.Collections.Assignements();
					}
		            app.collections.assignements.fetch({
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
        	var request = app.collections.requests.get(id);

            if(app.collections.places == null){
                app.collections.places = new app.Collections.Places();
            }
            //load details after places list loaded
            self.request = request;            
           
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
						                            //if(app.views.requestsDetailsView == null) {
						                                app.views.requestsDetailsView = new app.Views.RequestDetailsView(self.request, false);
						                                self.render(app.views.requestsDetailsView);
//						                            } 
//						                            else {
//						                                app.views.requestsDetailsView.initialize(self.request, false);             
//						                            }
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
    

    /** Add Request
    */
    addRequest: function() {
        
        // Check if the user is connect //
        if(this.checkConnect()){
        	
        	var self = this;
           

            if(app.collections.places == null ){
                app.collections.places = new app.Collections.Places();
            }

            self.request = app.models.request;

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

            			if(app.collections.claimers == null ){
						  app.collections.claimers = new app.Collections.Claimers();
				        }
				    
                    app.collections.claimers.fetch({

					   success: function(){

                            if(app.collections.claimersContacts == null ){
						      app.collections.claimersContacts = new app.Collections.ClaimersContacts();
				            }
				            
                            app.collections.claimersContacts.fetch({

                                success: function(){

                                    if(app.collections.claimersTypes == null ){
                                        app.collections.claimersTypes = new app.Collections.ClaimersTypes();
                                    }
				                    
                                    app.collections.claimersTypes.fetch({

					                   success: function(){
	
//								if(app.views.requestView != null) {          
//	            	                app.views.requestView = null  
//	            	            }
								            app.views.requestView = new app.Views.RequestDetailsView( self.request, true);
							                self.render(app.views.requestView);

//	            	            if(app.views.requestView == null) {          
//	            	                app.views.requestView = new app.Views.RequestDetailsView( request, true);  
//	            	            }
//	            	            else{
//	            	                app.views.requestView.model = request;
//	            	                app.views.requestView.initialize(request,true);
//	            	            }
	
                        	           },
                        	           complete: function(){
                        	               app.loader('hide');
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
    interventions: function(){
    	
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
		            	
					            	if(app.collections.categories == null ){
					            		app.collections.categories = new app.Collections.Categories();
									}
						            app.collections.categories.fetch({
						            	success: function(){
						                    // If the view exist we reuse it //
//							                    if(app.views.interventionsView){
//							                        app.views.interventionsView.render();
//							                    }
//							                    else{
//							                        app.views.interventionsView = new app.Views.InterventionsView();
//							                    }
						                    app.views.interventionsView = new app.Views.InterventionsView();
						                    self.render(app.views.interventionsView);
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
	        	self.intervention = app.models.intervention;
	
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
							app.views.interventionDetailsView = new app.Views.InterventionDetailsView( self.intervention, true);
							self.render(app.views.interventionDetailsView);
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
											            	if(app.collections.categories == null ){
											            		app.collections.categories = new app.Collections.Categories();
															}
												            app.collections.categories.fetch({
												            	success: function(){
													                if(app.collections.absentTypes == null ){
													                    app.collections.absentTypes = new app.Collections.AbsentTypes();
													                }
	
													               
													                app.collections.absentTypes.fetch({
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
		        	
		        	app.loader('display');
		        	app.collections.tasks.fetch({
		        		success: function(){
		        			app.views.taskDetailsView = new app.Views.TaskDetailsView(self.task, false);
		        			self.render(app.views.taskDetailsView);
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
				                    app.views.placesView = new app.Views.PlacesView({page: self.page});
				                    self.render(app.views.placesView);
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
    detailsPlace: function(id){      

        // Check if the user is connect //
        if(this.checkConnect()){
            var self = this;

            // Check if the collections is instantiate //
            if(app.collections.places == null ){
                app.collections.places = new app.Collections.Places();
            }

            if (id)
	        	self.place = app.collections.places.get(id);
	        else
	        	self.place = app.models.place;
           
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
				                    app.views.placeDetailsView = new app.Views.PlaceDetailsView(self.place);
				                    self.render(app.views.placeDetailsView);
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
                    app.views.servicesView = new app.Views.ServicesView({page: self.page});
                    self.render(app.views.servicesView);
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
		                    app.views.serviceDetailsView = new app.Views.ServiceDetailsView(self.service);
		                    self.render(app.views.serviceDetailsView);
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



    /** Categories management
    */
    categories: function(page){      

        // Check if the user is connect //
        if(this.checkConnect()){
            var self = this;


            self.page = page ? parseInt(page, 10) : 1;

            // Check if the collections is instantiate //
            if(app.collections.categories == null ){
                app.collections.categories = new app.Collections.Categories();
            }

           
            app.collections.categories.fetch({
                beforeSend: function(){
                    app.loader('display');
                },
                success: function(){
                    app.views.categoriesView = new app.Views.CategoriesView({page: self.page});
                    self.render(app.views.categoriesView);
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



    /** Officers management
    */
    officers: function(page){

        // Check if the user is connect //
        if(this.checkConnect()){
            var self = this;


            self.page = page ? parseInt(page, 10) : 1;

            // Check if the collections is instantiate //
            if(app.collections.officers == null ){
                app.collections.officers = new app.Collections.Officers();
            }

            if(app.collections.groups == null ){
                app.collections.groups = new app.Collections.Groups();
            }

            app.collections.officers.fetch({
                beforeSend: function(){
                    app.loader('display');
                },
                success: function(){
                    
                    app.collections.groups.fetch({
                        success: function(){
                            app.views.officersView = new app.Views.OfficersView({page: self.page});
                            self.render(app.views.officersView);
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
                                    app.views.teamsView = new app.Views.TeamsView({page: self.page});
                                    self.render(app.views.teamsView);
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
		    	                            	success: function() {
			    		                            app.views.claimersView = new app.Views.ClaimersView({page: self.page});
			    		                            self.render(app.views.claimersView);
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
                    app.views.absentTypesView = new app.Views.AbsentTypesView({page: self.page});
                    self.render(app.views.absentTypesView);
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
    
});
