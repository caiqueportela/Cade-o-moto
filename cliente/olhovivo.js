var mapa;
var G_API = "http://api.olhovivo.sptrans.com.br/v2.1";
var G_TOKEN = "ae5b1f0982c41ee7e35efe8684f1b4bf5ac498d0f19067415f5d7a1d2069c812";
var cores = ["#FF0000", "#2F4F4F", "#00FFFF", "#FFD700", "#6A5ACD", "#FFA500", "#8B4513", "#808000", "#32CD32", "#00008B", "#20B2AA", "#FF1493", "#FA8072", "#F0E68C", "#F5DEB3", "#87CEFA", "#006400", "#800000", "#708090"];
var coresUtilizadas = 0;
var markers = [];
var linhas = [];

$(document).ready(function () {
    $("#trajetos").hide();	
	$("#map").addClass("map");
    $("#map").removeAttr("style");
	$("#busca_linhas").mask('A00A-00');
	
	$('.sidenav').sidenav();
});

function enviarDados() {
	var temp, cor;
	
    $(".selected").each(function (i) {
		temp = $(this).attr("idlinha").split('-');
		cor = criaRota(temp[0]+"-"+temp[1], temp[2]);
		criarPosicoes(temp[0]+"-"+temp[1], temp[2], cor);
    });
	
	limpar();
	trajetosM();
}

$( "#btnBuscar" ).click(function() {
	limpar();
	buscarLinhas($( "#busca_linhas" ).val());
});

//OK
function limpar() {
    $(".selected").each(function () {
        $(this).attr("selecionado", "false");
        $(this).removeClass("selected");
    });
}

//OK
function linhasM() {
	$( "#listaDeLinhas" ).html("");
    $("#trajetos").hide();
    $("#linhas").show();
}

//OK
function trajetosM() {
    $("#linhas").hide();
    $("#trajetos").show();
}

$('#listaDeLinhas').on('click', 'div.card', function() {
	if ($(this).attr("selecionado") == "true") {
		$(this).removeClass("selected");
		$(this).attr("selecionado", "false");
	} else {
		$(this).addClass("selected");
        $(this).attr("selecionado", "true");
    }
});

function getCor(){
	var cor = cores[coresUtilizadas];
	coresUtilizadas = coresUtilizadas + 1;
	return cor;
}

function iniciaAPI() {
	$.ajax({
		type: 'POST',
		url: G_API + "/Login/Autenticar?token=" + G_TOKEN,
		success: function(data) {
			console.log(data);
		},
		error: function (error) {
			console.log(error);
		}
	});
}
		
function buscarLinhas(item) {
	var linha = "";
	var sentido = "";
	var letreiro = "";
	var html = "";
	
	$.ajax({
		type: 'GET',
		url: G_API + "/Linha/Buscar?termosBusca=" + item,
		success: function(data) {
			$.each(data, function( index, value ) {
				linha = value['lt'] + "-" + value['tl'];
				sentido = value['sl'];
				if(sentido == 1) letreiro = value['ts'] + " - " + value['tp'];
				else letreiro = value['tp'] + " - " + value['ts'];
				
				html = 	"<div class=\"row\">"+
							"<div class=\"col s12\">" +
								"<div class=\"card card-effect waves-light\" selecionado=\"false\" idlinha=\""+linha+"-"+sentido+"\">" +
									"<div class=\"card-content\">" +
										"<span class=\"card-title\">"+linha+"</span>" +
										"<p>"+letreiro+"</p>" +
									"</div>" +
								"</div>" +
							"</div>" +
						"</div>";
			
				$( "#listaDeLinhas" ).append(html);
			});
		},
		error: function (error) {
			console.log(error);
		}
	});
}
	
function criaRota(linha, sentido) {
	var inicio;
	var fim;
	var coordenadas = [];
	var cor = getCor();
	
	$.ajax({
		url: "https://cdn.cp0.ovh/olhoVivo/rota/" + linha + "/" + sentido,
		success: function(data) {
			for (i = 0; i < data["data"].length; i++) {
				coordenadas.push(new google.maps.LatLng(parseFloat(data["data"][i].shape_pt_lat), parseFloat(data["data"][i].shape_pt_lon)));
				if(i == 0) inicio = new google.maps.LatLng(parseFloat(data["data"][i].shape_pt_lat), parseFloat(data["data"][i].shape_pt_lon));
				if(i == data["data"].length-1) fim = new google.maps.LatLng(parseFloat(data["data"][i].shape_pt_lat), parseFloat(data["data"][i].shape_pt_lon));
			}
			
			linhas.push({linha: linha, sentido: sentido, cor: cor});
			
			var polyLines = new google.maps.Polyline({
				path: coordenadas,
				geodesic: true,
				strokeColor: cor,
				strokeOpacity: 1,
				strokeWeight: 3
			});
			polyLines.setMap(mapa);
			
			var infowindow = new google.maps.InfoWindow({
				content: linha
			});
			
			google.maps.event.addListener(polyLines, 'click', function(event) {
				infowindow.open(mapa);
				infowindow.setPosition(event.latLng);
			});
			
			var marcaInicio = new google.maps.Marker({
				position: inicio,
				map: mapa,
				icon: "start48.png",
				title: linha + " - Inicio"
			});
			
			var infowindowInicio = new google.maps.InfoWindow({
				content: linha + " - Inicio"
			});
			
			google.maps.event.addListener(marcaInicio, 'click', function(event) {
				infowindowInicio.open(mapa);
				infowindowInicio.setPosition(event.latLng);
			});
			
			var marcaFim = new google.maps.Marker({
				position: fim,
				map: mapa,
				icon: "finish48.png",
				title: linha + " - Fim"
			});
			
			var infowindowFim = new google.maps.InfoWindow({
				content: linha + " - Fim"
			});

			google.maps.event.addListener(marcaFim, 'click', function(event) {
				infowindowFim.open(mapa);
				infowindowFim.setPosition(event.latLng);
			});
		}
	});
	
	return cor;
}

function criarPosicoes(linha, sentido, cor) {
	var cl;
	var coordenada;
	
	$.ajax({
		type: 'GET',
		url: G_API + "/Linha/BuscarLinhaSentido?termosBusca=" + linha + "&sentido=" + sentido,
		success: function(data) {
			$.each(data, function( index, value ) {
				if(value['sl'] == sentido) {
					cl = value['cl'];
					
					$.ajax({
						url: G_API + "/Posicao/Linha?codigoLinha=" + cl,
						success: function(data) {
							for (i = 0; i < data["vs"].length; i++) {
								coordenada = new google.maps.LatLng(parseFloat(data["vs"][i].py), parseFloat(data["vs"][i].px));
								
								var marca = new google.maps.Marker({
									position: coordenada,
									map: mapa,
									//icon: "bus48.png",
									icon: pinSymbol(cor),
									title: linha + " :: " + data["vs"][i].p,
									animation: google.maps.Animation.DROP
								});
								markers.push(marca);
								
								var infowindow = new google.maps.InfoWindow({
									content: linha + "-" + sentido + " :: " + data["vs"][i].p
								});
								
								google.maps.event.addListener(marca, 'click', function(event) {
									infowindow.open(mapa);
									infowindow.setPosition(event.latLng);
								});
							}
						},
						error: function (error) {
							console.log(error);
						}
					});
				}
			});
		},
		error: function (error) {
			console.log(error);
		}
	});
}

function pinSymbol(color) {
    return {
        path: 'M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z M -2,-30 a 2,2 0 1,1 4,0 2,2 0 1,1 -4,0',
        fillColor: color,
        fillOpacity: 1,
        strokeColor: '#000',
        strokeWeight: 2,
        scale: 1,
   };
}


window.setInterval(function(){
	atualizarMapa();
}, 30000);

function atualizarMapa() {
	clearMarkers();
	for(var x=0; x<linhas.length; x++) {
		criarPosicoes(linhas[x]['linha'], linhas[x]['sentido'], linhas[x]['cor']);
	}
}

 function clearMarkers() {
	for (var i = 0; i < markers.length; i++) {
		markers[i].setMap(null);
	}
	markers = [];
 }
 
function iniciaMapa() {
	mapa = new google.maps.Map(document.getElementById('mapa'), {
		zoom: 11,
		center: {lat: -23.713658, lng: -46.657054}
	});
}
	
function iniciaTudo(){
	iniciaMapa();
	iniciaAPI();
}