

window.onload = function(){
	//------------------Variables-----------------//


	const canvas = document.createElement("canvas");
	const WIDTH = 500, HEIGHT = 500;
	const ctx = canvas.getContext("2d");

	var fondo;
	var nave = { 
		width: 50,
		height: 50,
		x:WIDTH/2 -25,
		y:HEIGHT - 60,
		count: 0
	}
	var enemigos = [];

	var juego = {
		estado: 'iniciado'
	};

	var teclado = {};

	var textoJuego = {
		count: -1,
		titulo: "",
		subtitulo: ""
	}

	var disparos = [];

	var disparosEnemigos = [];
	//--------Inicio funciones ---------//
	function main(){
		canvas.width = WIDTH;
		canvas.height = HEIGHT;
		document.body.appendChild(canvas);

		agregarEventoTeclado();

		loadMedia();
		console.log("slajhs");
	}
	main();
	function loadMedia(){
		fondo = new Image();
		fondo.src = "img/fondo.jpg"
		fondo.onload = function(){
			var intervalo = window.setInterval(actualizarJuego,20);
		}
	}

	function pintarFondo(){
		ctx.drawImage(fondo,0,0);
	}

	function pintarNave(){
		ctx.save();
		ctx.fillStyle = "white";
		ctx.fillRect(nave.x,nave.y,nave.width,nave.height,"img/nave.png");
		ctx.restore();
	}

	function pintarEnemigos(){
		for(var i in enemigos){
			var enemigo = enemigos[i];
			ctx.save();
			if (enemigo.estado == "vivo") {
				ctx.fillStyle = "red";
			}
			if (enemigo.estado == "muerto") {
				ctx.fillStyle = "black";
			}
			ctx.fillRect(enemigo.x,enemigo.y,enemigo.width,enemigo.height);
		}
	}

	function actualizarJuego(){
		
		
		moverNave();
		actualizaEnemigos();
		pintarFondo();
		pintarNave();
		pintarDisparos();
		moverDisparos();
		moverDisparosEnemigos();
		pintarEnemigos();
		pintarDisparosEnemigos();
		verificarImpacto();
		actualizarEstadoJuego();
		pintarTexto();
	}
	function verificarImpacto(){
		for (var i in disparos) {
			var disparo = disparos[i];
			for (j in enemigos) {
				var enemigo = enemigos[j];

				if (impactoEnemigo(disparo,enemigo)) {
					enemigo.estado="golpeado";
					enemigo.contador=0;
				}
			}
		}
		
		// if (!nave.estado == "hit" || !nave.estado == "muerto") return;
		for (var i in disparosEnemigos){
			var disparo = disparosEnemigos[i];
			if (impactoEnemigo(disparo,nave)) {
				nave.estado = "golpeada";
				//console.log("golpeada l;a ");
			}
		}
		
	}
	function pintarTexto(){

		
		if (textoJuego.count == -1) return;
		var apl = textoJuego.count/50.0;
		if (apl>1) {
			for(var i in enemigos){
				delete enemigos[i];
			}
			for(var j in disparosEnemigos){
				delete disparosEnemigos[j];
			}
		}
		ctx.save();
		ctx.globalAlpha = apl;
		
		if (juego.estado=="perdido") {
			
			ctx.fillStyle = "white";
			ctx.font = "Bold 40pt Arial";
			ctx.fillText(textoJuego.titulo, 100,200);
			ctx.font = "14pt Arial";
			ctx.fillText(textoJuego.subtitulo,140,250);
		}
		
		if (juego.estado == "victoria") {
			ctx.fillStyle = "white";
			ctx.font = "Bold 40pt Arial";
			ctx.fillText(textoJuego.titulo, 100,200);
			ctx.font = "14pt Arial";
			ctx.fillText(textoJuego.subtitulo,200,250);
		}
		ctx.restore();
	}

	function actualizarEstadoJuego(){
		if (juego.estado == "jugando" && enemigos.length == 0) {
			juego.estado = "victoria";
			textoJuego.titulo = "Has ganado ";
			textoJuego.subtitulo = "Pulsa la tecla R";
			textoJuego.count = 0;
		}
		if (textoJuego.count >= 0) {
			textoJuego.count++;
		}
		if ((juego.estado == "victoria" || juego.estado == "perdido") && teclado[82]) {
			juego.estado = "iniciado";
			nave.estado = "vivo";
			textoJuego.count = -1;
		}
	}
	function agregarEventoTeclado(){ 
		agregarEvento(document,"keydown",function(e){ 
			//True tecla presionada 
			teclado[e.keyCode] = true; 
		}); 
		agregarEvento(document,"keyup",function(e){ 
			//Falso tecla que no esta presionada 
			teclado[e.keyCode] = false; 
		}); 
		
		function agregarEvento(elemento,nombreEvento,funcion){ 
			if(elemento.addEventListener){ 
				elemento.addEventListener(nombreEvento, funcion, false); 
			} 
		} 	
	}﻿
	function impactoEnemigo(a,b){
		var impactoEnemigo = false;
		//Coliciones
		if (b.x + b.width >= a.x && b.x < a.x + a.width) {
			if (b.y + b.height >= a.y && b.y < a.y + a.height) {
				impactoEnemigo = true;
			}
		}

		if (b.x <= a.x && b.x + b.width >= a.x + a.width) {
			if (b.y <= a.y && b.x + b.height >= a.y + a.height) {
				impactoEnemigo = true;
			}
		}

		if (a.x <= b.x && a.x + a.width >= b.x + b.width) {
			if (a.y <= b.y && a.x + a.height >= b.y + b.height) {
				impactoEnemigo = true;
			}
		}
		return impactoEnemigo;
	}

	function pintarDisparosEnemigos(){
		for(var i in disparosEnemigos){
			var disparo = disparosEnemigos[i];
			ctx.save();
			ctx.fillStyle = "yellow";
			ctx.fillRect(disparo.x,disparo.y,disparo.width,disparo.height);
			ctx.restore();
		}
	}

	function moverDisparosEnemigos(){
		for(var i in disparosEnemigos){
			var disparo = disparosEnemigos[i];
			disparo.y +=3;
		}
		disparosEnemigos =disparosEnemigos.filter(function(disparo){
			return disparo.y < canvas.height;
		});
	}

	function actualizaEnemigos(){
		function agregarDisparosEnemigos(enemigo){
			return {
				x: enemigo.x,
				y: enemigo.y,
				width: 2,
				height:1,
				contador:0
			}
		}


		if (juego.estado=="iniciado") {
			for (var i = 0; i < 5; i++) {
				enemigos.push({
					x: 10 + ( i * 50),
					y: 10 + (50),
					height: 30,
					width: 30,
					estado : "vivo",
					contador : 0,
					velocidad : 0.5
				});
				
			}
			juego.estado = "jugando";
		}

		for(var i in enemigos){
			
			var enemigo = enemigos[i];
			
			if (enemigo && enemigo.estado == "vivo") {
				enemigo.contador++;
				enemigo.x += Math.sin(enemigo.contador * Math.E / 90)*3.8;

				if (aletorio(0,enemigos.length*10)==4) {
					disparosEnemigos.push(agregarDisparosEnemigos(enemigo));
				}
			}

			if (enemigo && enemigo.estado == "golpeado") {
				enemigo.contador++;
				if (enemigo.contador >= 20) {
					enemigo.estado = "muerto";
					enemigo.contador = 0;
				}
			}
		}

		enemigos = enemigos.filter(function(enemigo){
			if (enemigo && enemigo.estado != "muerto") {
				return true;
			}else{
				return false;
			}
		})
	}

	function aletorio(inferior,superior){
		var num = superior -inferior;
		var a = Math.random() * num;
		a = Math.floor(a);
		return parseInt(inferior) + a;
	}

	function moverNave() {
		if (teclado[37]) {
			//Mover a la izquierda
			nave.x-=6;
			if (nave.x < 0) {
				nave.x = 0;
			}
		}
		if (teclado[39]) {
			//Mover a la derecha
			var limite = canvas.width - nave.width;
			nave.x+=6;
			if (nave.x > limite) {
				nave.x = limite;
			}
		}

		if (teclado[32]) {
			//Condicion para que los disparos salgan de uno en uno
			if (!teclado.disparar) {
				disparar();
				teclado.disparar = true;
			}
		}else{
			teclado.disparar = false;
		}

		if (nave.estado=="golpeada") {
			nave.count++;
			console.log(nave.count);
			if (nave.count>=20) {
				nave.count = 0;
				nave.estado = "muerto";
				juego.estado = "perdido";
				textoJuego.titulo = "Game Over";
				textoJuego.subtitulo = "Pulsa R para volver a jugar";
				textoJuego.count = 0;
			}
		}

	}

	function moverDisparos() {
		for(var i in disparos){
			var disparo = disparos[i];
			disparo.y-=5;
		}
		//Eliminar los disparos que has salido de la pantalla
		disparos = disparos.filter(function(disparo){
			return disparo.y > 0;
		});
	}

	function pintarDisparos(){
		ctx.save();
		ctx.fillStyle = "white";
		for(var i in disparos){
			var disparo = disparos[i];
			ctx.fillRect(disparo.x,disparo.y,disparo.width,disparo.height);
		}
		ctx.restore();
	}
	function disparar() {
		disparos.push({
			x:nave.x + 20,
			y:nave.y -10,
			width: 2,
			height:5
		});
	}


}
