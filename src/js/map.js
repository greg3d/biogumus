(function () {

	$(document).ready(function () {

		var city = [];
		$('.cities li').each(function (i) {
			
			
			if(typeof $(this).attr('target') === "undefined"){
				city[i] = $(this).html();
			} else {
				city[i] = $(this).attr('target');
			}
			//console.log(city[i]);

			
		});

		var ulcities = document.querySelector("ul.cities");
		if (!(ulcities === null)) {
			ymaps.ready(init);
		}
		

		function init() {

			var myMap = new ymaps.Map('cont_map', {
				center: [55.753994, 37.622093],
				zoom: 9,
				controls: ['smallMapDefaultSet']
			});

			var goroda = ymaps.geoQuery();

			city.forEach(function (item) {
				goroda = goroda.add(ymaps.geocode(item, {
					results: 1,
					kind: 'locality'
				}));
			});

			goroda = goroda.applyBoundsToMap(myMap).addToMap(myMap);
			goroda.then(function (res) {

				var selectedTable = $('#selectedTable');

				boundz = myMap.getBounds();
				//console.log(boundz);
				// 

				$('#return').click(function () {
					myMap.setBounds(boundz);
					myMap.geoObjects.removeAll();
					selectedTable.html(' ');
					goroda.addToMap(myMap);
					$('ul.cities>li').removeClass('active');


				});



				// 
				$('ul.cities>li').click(function () {

					// 
					//console.log(selectedTable.html());
					selectedTable.html(' ');
					//console.log(selectedTable.html());

					// 
					myMap.geoObjects.removeAll();

					// 
					$('ul.cities>li').removeClass('active');
					$(this).addClass('active');

					// 
					var cityName = '';
					if(typeof $(this).attr('target') === "undefined"){
						cityName = $(this).html();
					} else {
						cityName = $(this).attr('target');
					}

					siteLib.closeModals();

					/*tehotdel spektor*/
					if (cityName == 'Москва') {
						cityName = 'Московская область';
					}
					goroda.removeFromMap(myMap);

					// 
					var c = $(this).html();
					var gc = ymaps.geocode(c, {
						results: 1,
						kind: 'locality'
					});
					gc.then(function (res) {
						// 
						var coords = res.geoObjects.get(0).geometry.getCoordinates();
						var bounds = res.geoObjects.get(0).properties.get('boundedBy');
						myMap.setBounds(bounds, {
							checkZoomRange: true
						});
					});

					var placeTr = $("#fullList>tbody>tr[city='" + cityName + "']");
					
					var curTr = [];

					placeTr.each(function (j) {
						

						curTr[j] = $(this);
						
						// console.log(selectedTable.html());
						selectedTable.append('<tr class="listed" id="num_' + j + '"><td>' + (j + 1) + '</td>' + curTr[j].html() + '</tr>');
						// console.log(selectedTable.html());
						// console.log('<tr class="listed" id="num_'+j+'"><td>'+(j+1)+'</td>'+curTr[j].html()+'</tr>');
						var nn = [];
						var gcc = $(this).find('td[geo_code]').attr("geo_code").split(',').reverse();

						$(this).find('td').each(function (i) {
							nn[i] = $(this).html();
							//console.log($(this).html());
						});

						//
						var plMark = new ymaps.Placemark(gcc, {
								iconContent: j + 1
							}
							/*
													,balloonContentHeader: nn[0]
													,balloonContentBody: nn[1]+','+nn[3]
													,balloonContentFooter: nn[2]}*/
							, {
								preset: 'islands#icon'
							});

						// 
						selectedTable.find('tr#num_' + j).click(function () {

							selectedTable.html(curTr[j].html());
							myMap.setCenter(gcc);
							myMap.setZoom('15');
						});

						// 
						plMark.events.add('click', function () {
							selectedTable.html(curTr[j].html());
							myMap.setCenter(gcc);
							myMap.setZoom('15');
							//curTr[j].addClass('active');
						});

						function centerAndZoom() {
							selectedTable.html(curTr[j].html());
							myMap.setCenter(gcc);
							myMap.setZoom('15');
						}
						// 
						myMap.geoObjects.add(plMark);

					});
				});
			});
		}
	});

}());