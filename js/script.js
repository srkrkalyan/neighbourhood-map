
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
	      		self.test = 1;
	      		

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
		        	self.searchString = ko.observable();
		        	self.placeNames = ko.observableArray();
		        	self.selectedPlace = ko.observable();
		        	self.placeNamesMaster = [];
		        	self.placeIdsMaster = [];
		        	self.placeIds = [];
		        	self.markers = [];
	      			self.markersMaster = [];
	      			self.searchedMarkers = [];

		        	self.filterList = ko.computed(function(){
		        		if(typeof (self.searchString()) == "string")
		        		filterPlaces(self.placeNames,self.searchString());
		        	}, this);

		        	self.selectListItem = ko.computed(function(){
		        		if (self.selectedPlace()){
		        			var index = self.placeNamesMaster.indexOf(self.selectedPlace()[0]);
		        			var geocoding_service = new google.maps.Geocoder();
							geocoding_service.geocode({'placeId': self.placeIdsMaster[index]},geoSelectedMarker);
				        }
		        	},this);

		        	function geoSelectedMarker(geoResults,geoStatus){
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

		        	}

		        	var service = new google.maps.places.PlacesService(map);
					service.textSearch(request,placesCallback);
				
					function placesCallback(results,status){
						if(status == 'OK')
						results.forEach(buildModel);
					}
					
					function buildModel(placeResult, index){
						self.placeNames.push(placeResult.name);
						self.placeIdsMaster.push(placeResult.place_id);
						self.placeIds.push(placeResult.place_id);
						self.placeNamesMaster.push(placeResult.name);
						var geocoding_service = new google.maps.Geocoder();
						geocoding_service.geocode({'placeId': placeResult.place_id},geoCallback);
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
			
				}
				ko.applyBindings(new myViewModel());
}
			


