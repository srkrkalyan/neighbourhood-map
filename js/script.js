
      		"use strict";
      		var map;
      		var info_windows = [];
      		var my_neighbourhood = {lat: 39.5364820,lng: -104.8970680};
      		var locations = [];
      		//var placeNames = [];
	      	

	      	var placeMarker = function(name,marker){
	      		this.name = name;
	      		this.marker = marker;
	      	}

	      	var placeMarkersArray = [];
	      
	      	function initMap()
	      	{ 
	      		
	      		var self = this;
	      		
	      		

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

		        map = new google.maps.Map(document.getElementById('map'), {
		          center: my_neighbourhood,
		          zoom: 15,
		          styles: style_blue_essence
		        });

		        var request = {
							location: my_neighbourhood,
							radius: '80',
							query: 'food'
						};

				 
				
		        function myViewModel(){

		        	var self = this;
		        	//self.info_window = new google.maps.InfoWindow();
		        	self.searchString = ko.observable();
		        	self.placeNames = ko.observableArray();
		        	self.selectedPlace = ko.observable();
		        	self.infoWindowContent;
		        	self.placeNamesMaster = [];
		        	//self.placeIdsMaster = [];
		        	//self.placeIds = [];
		        	self.markers = [];
	      			//self.markersMaster = [];
	      			self.searchedMarkers = [];
	      			self.clientId = "?client_id=JIFHVGPY2VQFVY25TLXRVLN341QRR305QUUDXDPG33KKVG1I";
	      			self.clientSecret = "&client_secret=HGWH2DR2PEDMKOK3S4QXYVMDRQD13GCWMO3CERR0QCC211EN";
	      			self.places = [];
	      			self.venueId = [];
	      			self.placesMaster = [];

	      			self.locations = [];
	      			self.venueDetails = [];

		        	self.filterList = ko.computed(function(){
		        		if(typeof (self.searchString()) == "string")
		        		//filterPlaces(self.placeNames,self.searchString());
		        	    filterPlacesNew(self.searchString());
		        	}, this);

		        	/*self.selectListItem = ko.computed(function(){
		        		if (self.selectedPlace()){
		        			var index = self.placeNamesMaster.indexOf(self.selectedPlace()[0]);
		        			var geocoding_service = new google.maps.Geocoder();
							geocoding_service.geocode({'placeId': self.placeIdsMaster[index]},geoSelectedMarker);
				        }
		        	},this);*/

					self.selectListItem = ko.computed(function(){
						if(self.selectedPlace()){
							var index = self.placeNamesMaster.indexOf(self.selectedPlace()[0]);
							self.markers.forEach(function(item,index){
								item.setMap(null);
							});
							console.log(index);
							self.markers[index].setMap(map);
							self.markers[index].setAnimation(google.maps.Animation.BOUNCE);
							getVenueDetails(self.places[index].venueId);
						}
					});

		        	

		        	/*function geoSelectedMarker(geoResults,geoStatus){
		        		if (geoStatus == 'OK'){
		        				for(var j=0; j<self.markers.length;j++){
		        					if (self.markers[j].getPosition().equals(geoResults[0].geometry.location)){
		        						console.log('Matched');
		        						//self.markers[j].setAnimation(google.maps.Animation.BOUNCE);
		        						self.markers[j].setOptions()
		        						return;
		        					}
		        				}
	        			}

	        			else
	        				window.alert('Sorry ! Google did not place any marker for this location to highlight');

		        	}*/

		        	var service = new google.maps.places.PlacesService(map);
					service.textSearch(request,placesCallback);
				
					function placesCallback(results,status){
						if(status == 'OK')
						results.forEach(buildModel);
						self.placesMaster = self.places;
						
						//console.log(self.placesMaster);
						//console.log(self.venueDetails);	

						
					}
					

					//console.log(self.venueDetails);

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
						
						marker.addListener('click', function() {
							for(var i=0;i<self.places.length;i++){
								if(self.places[i].lat == marker.position.lat()){
									window.alert(self.venueId[i]);
									getVenueDetails(self.venueId[i]);
								}
							}
						});
						self.markers.push(marker);
					}

					

					function getVenueDetails(venueId,status){
						if(venueId){
								var url = "https://api.foursquare.com/v2/venues/"+venueId+self.clientId+self.clientSecret+"&v=20130815";
								$.ajax({
									type: "GET",
									dataType: 'json',
									cache: false,
									url: url,
									async: true,
									success: function(data,test) {
											window.alert(data.response.venue.description);
									}
								});
							}
						else
							window.alert("foursquare does not have any info about this place");
					}

					function getVenueDetailsNew(venue_id){
						if(venue_id){
							//console.log(venue_id);
							var url = "https://api.foursquare.com/v2/venues/"+venue_id+self.clientId+self.clientSecret+"&v=20130815";
							$.ajax({
								type: "GET",
								dataType: 'json',
								cache: false,
								url: url,
								async: true,
								success: function(data,test) {
									self.venueDetails.push({
										venue_id: venue_id,
										venue_description: data.response.venue.description});
								}
							});
						}
						else
							{
							self.venueDetails.push({
										venue_id: venue_id,
										venue_description: "foursquare does not have any info about this place"});
						}
							
					}
					

					function setInfoWindow(marker){
						var index = self.markers.indexOf(marker);
						var venueId = self.places[index].venueId;
						getVenueDetails(venueId,'1');
						this.info_window = new google.maps.InfoWindow();
						this.info_window.setContent(self.infoWindowContent);
		   				this.info_window.open(map, marker);
					}

					function filterPlacesNew(searchString){

		        		if (self.placeNamesMaster.indexOf(searchString) != -1)
							{	
								
								var index = self.placeNamesMaster.indexOf(searchString);
								self.placeNames.removeAll();
								
								self.placeNames.push(self.searchString);
								self.markers.forEach(function(item,index){
									item.setMap(null);
								});
								self.markers[index].setMap(map);
								self.markers[index].setAnimation(google.maps.Animation.DROP);

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
						}

		        	}

					function geoCallback(geoResults,geoStatus){
						
						if (geoStatus == 'OK')
						{
								var marker;
								marker = new google.maps.Marker(
								{
								position: geoResults[0].geometry.location,
		        				animation: google.maps.Animation.DROP
		        				});
		        				marker.addListener('click', toggleBounce);
		        				self.locations.push({
		        					lat: geoResults[0].geometry.location.lat(),
		        					lng: geoResults[0].geometry.location.lng()
								});
		        				

		        				function toggleBounce() {
								  if (marker.getAnimation() !== null) {
								    marker.setAnimation(null);
								  } else {
								    	marker.setAnimation(google.maps.Animation.BOUNCE);
									}
								}
								
		        				self.markers.push(marker);
		        				self.markersMaster.push(marker);
		        				marker.setMap(map);
		        				
	        			}
					}

					function geofilterMarker(geoResults,geoStatus){
						if (self.searchedMarkers.length > 0)
					        	{
						        	for(var i=0;i<self.searchedMarkers.length;i++)
						        	{
						        		self.searchedMarkers[i].setMap(null);
						        	}
						        }
						if (geoStatus == 'OK'){

								var marker;
								marker = new google.maps.Marker(
								{
								position: geoResults[0].geometry.location,
		        				animation: google.maps.Animation.DROP
		        				});
		        				marker.setMap(map);
		        				marker.addListener('click', toggleBounce);
		        				function toggleBounce() {
								  if (marker.getAnimation() !== null) {
								    marker.setAnimation(null);
								  } else {
								    	marker.setAnimation(google.maps.Animation.BOUNCE);
									}
								}
		        				self.searchedMarkers.push(marker);
	        			}

	        			else
	        				window.alert('Sorry ! Google did not place any marker for this location to highlight');
					}

					function filterPlaces(placeNames,searchString){
						if (self.placeNamesMaster.indexOf(searchString) != -1)
							{	
								
								var index = self.placeNamesMaster.indexOf(searchString);
								self.placeNames.removeAll();
								
								self.placeNames.push(self.searchString);
								var geocoding_service = new google.maps.Geocoder();
								geocoding_service.geocode({'placeId': self.placeIdsMaster[index]},geofilterMarker);
								for(var i=0;i<self.markers.length;i++)
					        	{
					        		self.markers[i].setMap(null);
					        	}


							}
						else
						{
							self.placeNames.removeAll();
							for(var k=0;k<self.placeNamesMaster.length;k++){
								self.placeNames.push(self.placeNamesMaster[k]);
							}
							for(var i=0;i<self.markers.length;i++)
					        	{
					        		self.markers[i].setMap(map);
					        	}
						}
					}

					

					function getVenueIds(placeResult){
						
							var name = placeResult.name;
							var lat = placeResult.geometry.location.lat();
							var lng = placeResult.geometry.location.lng();
							var url = "https://api.foursquare.com/v2/venues/search"+self.clientId+self.clientSecret+"&v=20130815&ll="+lat+","+lng
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
												if (match == 0)
													self.venueId.push(undefined);
													for(var i=0;i<self.places.length;i++){
															if(self.places[i].name == name)
															{
																self.places[i].venueId = undefined;
																
																break;
															}
														}
										}
										
						});


					}
	}
				ko.applyBindings(new myViewModel());
}
			


