// Referencia Canvas
var canvas = document.getElementById('canvas');

// Referencia Canvas Context
var context = canvas.getContext('2d');

// Pantalla de carga
var loading_screen = document.getElementById('loading');

// Cargar variables
var loaded = false;
var load_counter = 0;

// Lista de imágenes para las capas
var fondo = new Image();
var florfondo = new Image();
var florarriba = new Image();
var sombrachica = new Image();
var chica = new Image();
var sombraflorabajo = new Image();
var florabajo = new Image();
var sombrabotella = new Image();
var botella = new Image();
var brillos = new Image();
var brillos2 = new Image();
var firma = new Image();

// Lista de capas
var layer_list = [
{
'image': fondo,
'src': 'https://github.com/cinthalvarez/testingparallax/raw/master/images/fondo.png',
'z_index': -3,
'position': {x: 0, y: 0},
'blend': null,
'opacity': 1
},
{
'image': florfondo,
'src': 'https://github.com/cinthalvarez/testingparallax/raw/master/images/florfondo.png',
'z_index': -2.5,
'position': {x: 0, y: 0},
'blend': null,
'opacity': 1
},
{
'image': florarriba,
'src': 'https://github.com/cinthalvarez/testingparallax/raw/master/images/florarriba.png',
'z_index': -2,
'position': {x: 0, y: 0},
'blend': null,
'opacity': 1
},
{
'image': sombrachica,
'src': 'https://github.com/cinthalvarez/testingparallax/raw/master/images/sombrachica.png',
'z_index': -1.5,
'position': {x: 0, y: 0},
'blend': 'multiply',
'opacity': 1
},
{
'image': chica,
'src': 'https://github.com/cinthalvarez/testingparallax/raw/master/images/chica.png',
'z_index': -1,
'position': {x: 0, y: 0},
'blend': null,
'opacity': 1
},
{
'image': brillos2,
'src': 'https://github.com/cinthalvarez/testingparallax/raw/master/images/brillos2.png',
'z_index': 0,
'position': {x: 0, y: 0},
'blend': null,
'opacity': 1
	},
{
'image': sombraflorabajo,
'src': 'https://github.com/cinthalvarez/testingparallax/raw/master/images/sombraflorabajo.png',
'z_index': 0,
'position': {x: 0, y: 0},
'blend': 'multiply',
'opacity': 1
},

{
'image': florabajo,
'src': 'https://github.com/cinthalvarez/testingparallax/raw/master/images/florabajo.png',
'z_index': 0,
'position': {x: 0, y: 0},
'blend': null,
'opacity': 1
},
{
'image': sombrabotella,
'src': 'https://github.com/cinthalvarez/testingparallax/raw/master/images/sombrabotella.png',
'z_index': 0.5,
'position': {x: 0, y: 0},
'blend': 'multiply',
'opacity': 1
},

{
'image': botella,
'src': 'https://github.com/cinthalvarez/testingparallax/raw/master/images/botella.png',
'z_index': 1,
'position': {x: 0, y: 0},
'blend': null,
'opacity': 1
},
{
'image': brillos,
'src': 'https://github.com/cinthalvarez/testingparallax/raw/master/images/brillos.png',
'z_index': 2,
'position': {x: 0, y: 0},
'blend': null,
'opacity': 1
	},
{
'image': firma,
'src': 'https://github.com/cinthalvarez/testingparallax/raw/master/images/firma.png',
'z_index': 2,
'position': {x: 0, y: 0},
'blend': null,
'opacity': 1
}
];

// Repasar por la lista de capas y cargar las imágenes.
layer_list.forEach(function(layer, index) {
	layer.image.onload = function() {
		load_counter += 1;
		// Comprobar si están cargadas todas las imágenes.
		if (load_counter >= layer_list.length) {
			
			hideLoading();
			requestAnimationFrame(drawCanvas);
		}
	};
	layer.image.src = layer.src;
});

// Quitar pantalla de carga.
function hideLoading() {
	loading_screen.classList.add('hidden');
}

// Dibujar las capas en Canvas.
function drawCanvas() {
	context.clearRect(0, 0, canvas.width, canvas.height);
	
	// Para que la animación vuelva al centro.
	TWEEN.update();
	
	// Calcular rotación de Canvas.
	var rotate_x = (pointer.y * -0.15) + (motion.y * 1.2);
	var rotate_y = (pointer.x * 0.15) + (motion.x * 1.2);
	
	// Rotar Canvas.
	canvas.style.transform = "rotateX(" + rotate_x + "deg) rotateY(" + rotate_y + "deg)";
		
	// Loop cada capa y dibujarla en Canvas.
	layer_list.forEach(function(layer, index) {
		
		// Calcular la posición de las capas.
		layer.position = getOffset(layer);
		
		// Usar modos de transparencia/fundido.
		if (layer.blend) {
			context.globalCompositeOperation = layer.blend;
		} else {
			context.globalCompositeOperation = 'normal';
		}
		// Opacidad de la capa.
		context.globalAlpha = layer.opacity;
		// Dibujar la capa en Canvas.
		context.drawImage(layer.image, layer.position.x, layer.position.y);
	});
	
	// Loop.
	requestAnimationFrame(drawCanvas);
}

// Calcular offset de capa.
function getOffset(layer) {
	var touch_multiplier = 0.3;
	var touch_offset_x = pointer.x * layer.z_index * touch_multiplier;
	var touch_offset_y = pointer.y * layer.z_index * touch_multiplier;
	var motion_multiplier = 2.5;
	var motion_offset_x = motion.x * layer.z_index * motion_multiplier;
	var motion_offset_y = motion.y * layer.z_index * motion_multiplier;
	var offset = {
		x: touch_offset_x + motion_offset_x,
		y: touch_offset_y + motion_offset_y
	};
	return offset;
}




//// TOQUE Y MOUSE ////

var moving = false;

// Posición inicial del mouse/toque.
var pointer_initial = {
	x: 0,
	y: 0
};
var pointer = {
	x: 0,
	y: 0
};

canvas.addEventListener('touchstart', pointerStart);
canvas.addEventListener('mousedown', pointerStart);

function pointerStart(event) {
	// Has tocado/clicado la campaña y ahora las cosas se mueven hasta que pares.
	moving = true;
	if (event.type === 'touchstart') {
		pointer_initial.x = event.touches[0].clientX;
		pointer_initial.y = event.touches[0].clientY;
	} else if (event.type === 'mousedown') {
		pointer_initial.x = event.clientX;
		pointer_initial.y = event.clientY;
	}
}

window.addEventListener('mousemove', pointerMove);
window.addEventListener('touchmove', pointerMove);

function pointerMove(event) {
	event.preventDefault();
	if (moving === true) {
		var current_x = 0;
		var current_y = 0;
		if (event.type === 'touchmove') {
			current_x = event.touches[0].clientX;
			current_y = event.touches[0].clientY;
		} else if (event.type === 'mousemove') {
			current_x = event.clientX;
			current_y = event.clientY;
		}
		pointer.x = current_x - pointer_initial.x;
		pointer.y = current_y - pointer_initial.y; 
	}
};

canvas.addEventListener('touchmove', function(event) {
	// Don't scroll the screen
	event.preventDefault();
});
canvas.addEventListener('mousemove', function(event) {
	event.preventDefault();
});

window.addEventListener('touchend', function(event) {
	endGesture();
});
window.addEventListener('mouseup', function(event) {
	endGesture();
});


function endGesture() {
	moving = false;
	
	TWEEN.removeAll();
	var pointer_tween = new TWEEN.Tween(pointer).to({x: 0, y: 0}, 300).easing(TWEEN.Easing.Back.Out).start();	
}


//// CONTROLES DE MOVIMIENTO ///

// Iniciar variables de Parallax.
var motion_initial = {
	x: null,
	y: null
};
var motion = {
	x: 0,
	y: 0
};

window.addEventListener('deviceorientation', function(event) {
	if (!motion_initial.x && !motion_initial.y) {
		motion_initial.x = event.beta;
		motion_initial.y = event.gamma;
	}
    if (window.orientation === 0) {
    	motion.x = event.gamma - motion_initial.y;
    	motion.y = event.beta - motion_initial.x;
    } else if (window.orientation === 90) {
    	motion.x = event.beta - motion_initial.x;
    	motion.y = -event.gamma + motion_initial.y;
    } else if (window.orientation === -90) {
    	motion.x = -event.beta + motion_initial.x;
    	motion.y = event.gamma - motion_initial.y;
    } else {
		motion.x = -event.gamma + motion_initial.y;
		motion.y = -event.beta + motion_initial.x;
    }

	var max_offset = 23;
    
    if (Math.abs(motion.x) > max_offset) {
    	if (motion.x < 0) {
    		motion.x = -max_offset;
    	} else {
    		motion.x = max_offset;
    	}
    }
    if (Math.abs(motion.y) > max_offset) {
    	if (motion.y < 0) {
    		motion.y = -max_offset;
    	} else {
    		motion.y = max_offset;
    	}
    }
});

window.addEventListener('orientationchange', function(event) {
	motion_initial.x = 0;
	motion_initial.y = 0;
});