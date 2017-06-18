
      		//global variable 'map'
      		var map;

      		//global object to store my neighbourhood location
      		var my_neighbourhood = {lat: 39.5654000,lng: -104.8760460};

	      	//app starts here

	      	function initMap()
	      	{ 	
	      		//styling for my map
	      		var style_blue_essence = 
				[{"featureType":"landscape.natural",
				"elementType":"geometry.fill","stylers":[{"visibility":"on"},
				{"color":"#e0efef"}]},{"featureType":"poi",
				"elementType":"geometry.fill","stylers":[{"visibility":"on"},
				{"hue":"#1900ff"},{"color":"#c0e8e8"}]},
				{"featureType":"road","elementType":"geometry",
				"stylers":[{"lightness":100},{"visibility":"simplified"}]},
				{"featureType":"road","elementType":"labels",
				"stylers":[{"visibility":"off"}]},
				{"featureType":"transit.line","elementType":"geometry",
				"stylers":[{"visibility":"on"},{"lightness":700}]},
				{"featureType":"water","elementType":"all",
				"stylers":[{"color":"#7dcdcd"}]}];

		        //creating the map instance
		        map = new google.maps.Map(document.getElementById('map'), {
		          center: my_neighbourhood,
		          zoom: 16,
		          styles: style_blue_essence
		        });

		        //request object for google places service api
		        var request = {
							location: my_neighbourhood,
							radius: '80',
							query: 'food'
						};

				 
				
		        //ViewModel for the app
		        function myViewModel(){

		        	var self = this;

		        	//Objects binded to View using Knockout
		        	self.searchString = ko.observable();
		        	self.placeNames = ko.observableArray();
		        	self.selectedPlace = ko.observable();
		        	self.fourSquareData = ko.observable();
		        	
		        	self.placeNamesMaster = [];
		        	self.markers = [];
	      			
	      			//FourSquar authetication details
	      			self.clientId = 
	      			"?client_id=JIFHVGPY2VQFVY25TLXRVLN341QRR305QUUDXDPG33KKVG1I";
	      			self.clientSecret = 
	      			"&client_secret=HGWH2DR2PEDMKOK3S4QXYVMDRQD13GCWMO3CERR0QCC211EN";
	      			
	      			self.places = [];
	      			self.venueId = [];
	      			self.placesMaster = [];

	      			self.locations = [];

	      			//function triggered when a search string is provided

		        	self.filterList = ko.computed(function(){
		        		if(typeof (self.searchString()) == "string")
		        	    filterPlacesNew(self.searchString());
		        	}, this);


		        	//function triggered when a list item is selected
					self.selectListItem = ko.computed(function(){
						if(self.selectedPlace()){
							var index = 
							self.placeNamesMaster.indexOf(
								self.selectedPlace()[0]);
							self.markers.forEach(function(item,index){
								item.setMap(null);
							});
							map.setCenter(self.markers[index].getPosition());
							self.markers[index].setMap(map);
							self.markers[index].setAnimation(
								google.maps.Animation.BOUNCE);
							setTimeout(function(){ 
								self.markers[index].setAnimation(null);}, 1000);
								getVenueDetails(self.places[index].venueId);
						}
					});

		        	var service = new google.maps.places.PlacesService(map);
					service.textSearch(request,placesCallback);
				
					function placesCallback(results,status){
						if(status == 'OK')
						results.forEach(buildModel);
						self.placesMaster = self.places;
						
					}
					
					//Dynamically building the model for this app

					function buildModel(placeResult, index){
						self.places.push({
							name: placeResult.name,
							address: placeResult.formatted_address,
							lat: placeResult.geometry.location.lat(),
							lng: placeResult.geometry.location.lng(),
							placeId: placeResult.place_id
						});
						getVenueIds(placeResult);
						self.placeNames.push(placeResult.name);
						self.placeNamesMaster.push(placeResult.name);
						var marker = new google.maps.Marker({
									position: placeResult.geometry.location,
									animation: google.maps.Animation.DROP,
									map: map});
						
						marker.addListener('click', function(){
							alertVenueDescription(marker);
							marker.setAnimation(google.maps.Animation.BOUNCE);
							setTimeout(function(){ 
								marker.setAnimation(null);}, 1000);
						});

						self.markers.push(marker);

					}

					//function to display four square info on clicking a marker

					function alertVenueDescription(marker){
						for(var i=0;i<self.places.length;i++){
							if((self.places[i].lat == marker.position.lat())&&
								(self.places[i].lng == marker.position.lng())){
								var info_window = new google.maps.InfoWindow();
								getVenueDetails(self.places[i].venueId);
							}
						}

					}

					//logic to filter places and markers based on search string

					function filterPlacesNew(searchString){

		        		if (self.placeNamesMaster.indexOf(searchString) != -1)
							{	
								
								var index = self.placeNamesMaster.indexOf(
									searchString);
								self.placeNames.removeAll();
								
								self.placeNames.push(self.searchString);
								self.markers.forEach(function(item,index){
									item.setMap(null);
								});
								map.setCenter(self.markers[index].getPosition());
								self.markers[index].setMap(map);
								self.markers[index].setAnimation(
									google.maps.Animation.DROP);
								alertVenueDescription(self.markers[index]);

							}
						else
						{
							self.placeNames.removeAll();
							for(var k=0;k<self.placeNamesMaster.length;k++){
								self.placeNames.push(self.placeNamesMaster[k]);
							}
							self.markers.forEach(function(item,index){
								item.setMap(map);
								item.setAnimation(null);
							});
							document.getElementById(
								'venue_description').innerHTML = 
							'See more info about your selection here'+
							'(Sourced from Foursquare**)<br><br>';
						}

		        	}

					//call foursquare API venues service to fetch description of a venu
					//input: venueId
					//output: updates DOM element with venue description retrieved using foursquare venues API

					function getVenueDetails(venueId,status){
						if(venueId){
								var url = "https://api.foursquare.com/v2/venues/"+
								venueId+self.clientId+self.clientSecret+"&v=20130815";
								$.ajax({
									type: "GET",
									dataType: 'json',
									cache: false,
									url: url,
									async: true,
									success: 
									    function(data,test) 
										{
										if(data.response.venue.description)
										document.getElementById(
										'venue_description').innerHTML =
										'See more info about your selection here ('+
											'Sourced from Foursquare**)<br><br>'+
										data.response.venue.description;
										else
										document.getElementById('venue_description').innerHTML = 
										'See more info about your selection here ('+
											'Sourced from Foursquare**)<br><br>'+
										'No Foursquare info found';
											},

									error: function(data){
										alert('Could not load Foursquare data');
									}
									});
									
							}
						else
							document.getElementById('venue_description').innerHTML = 
							'See more info about your selection here'+
							'(Sourced from Foursquare**)<br><br>'+
							'Foursquare do not have any valid description';
					}

					function updateFourSquareData(data){
						self.fourSquareData = data;
					}

					

					function filterPlaces(placeNames,searchString){
						if (self.placeNamesMaster.indexOf(searchString) != -1)
							{	
								var index = self.placeNamesMaster.indexOf(searchString);
								self.placeNames.removeAll();
								self.placeNames.push(self.searchString);
								for(var i=0;i<self.markers.length;i++)
					        	{
					        		self.markers[i].setMap(null);
					        	}
					        	self.markers[index].setMap(map);
							}
						else
						{
							window.alert('No match found!!!');
							self.placeNames.removeAll();
							for(var k=0;k<self.placeNamesMaster.length;k++){
								self.placeNames.push(self.placeNamesMaster[k]);
							}
							for(var m=0;m<self.markers.length;m++)
					        	{
					        		self.markers[m].setMap(map);
					        	}
						}
					}

					function getVenueIds(placeResult){
						
							var name = placeResult.name;
							var lat = placeResult.geometry.location.lat();
							var lng = placeResult.geometry.location.lng();
							var url = 
							"https://api.foursquare.com/v2/venues/search"+
							self.clientId+self.clientSecret+"&v=20130815&ll="+
							lat+","+lng;
							$.ajax({
								type: "GET",
								dataType: 'json',
								cache: false,
								url: url,
								async: true,
								success: function(data) {
										var match = 0;
										for(var k=0;k<data.response.venues.length;k++)
										{
											if(data.response.venues[k].name == name){
												for(var i=0;i<self.places.length;i++){
													if(self.places[i].name == name)
													{
														self.places[i].venueId = data.response.venues[k].id;

														match = 1;
														break;
													}
												}
												self.venueId.push(data.response.venues[k].id);
												return;

											}
										}
										if (match === 0)
											self.venueId.push(undefined);
											for(var c=0;c<self.places.length;c++){
													if(self.places[c].name == name)
													{
														self.places[c].venueId = undefined;
														break;
													}
												}
								}
						});
					}
	}
				ko.applyBindings(new myViewModel());
}
			


