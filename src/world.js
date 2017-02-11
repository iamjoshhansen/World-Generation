require('./world.scss');

console.log('Welcome to World Generation');

var UI = require('./components/ui/'),
	World = require('./components/world.js');

window.UI = UI;

(function () {

	var $container = $('#container'),
		ui = new UI({
			$container: $container,
			
			/*
			skybox: [					
					'./images/skyboxes/storm/nx.jpg',
					'./images/skyboxes/storm/px.jpg',
					'./images/skyboxes/storm/ny.jpg',
					'./images/skyboxes/storm/py.jpg',
					'./images/skyboxes/storm/pz.jpg',
					'./images/skyboxes/storm/nz.jpg'
				]
				/**/
		});

	window.ui = ui;



	var world = new World(6),
		world_width = 20,
		world_height = 20;

	for (var y=0; y<world_height; y++) {
		for (var x=0; x<world_width; x++) {
			world.getGrid(x,y);
		}
	}


	var scale = 5;

	
	/*	Dots
	------------------------------------------*
		var stars_geometry = new THREE.Geometry();

		_.each(world.grids, function (grid) {

			_.each(grid.squares, function (square) {

				var star = new THREE.Vector3();
				star.x = (grid.x * grid.size) + square.x;
				star.y = (grid.y * grid.size) + square.y;
				star.z = square.value;
				stars_geometry.vertices.push( star )

			});

		});

		var stars_material = new THREE.PointsMaterial( { color: '#333' } ),
			star_field = new THREE.Points( stars_geometry, stars_material );

		star_field.rotateX(Math.PI / 2);

		star_field.scale.x = scale;
		star_field.scale.y = scale;
		star_field.scale.z = scale;

		ui.scene.add( star_field );

		window.star_field = star_field;
	/**/



	/*	Ground
	------------------------------------------*/
		var geometry = new THREE.PlaneGeometry(
				world_width * world.size,
				world_height * world.size,
				(world_width * world.size) - 1,
				(world_height * world.size) - 1
			);

		/*	Texture
		------------------------------------------*/
			var texture = new THREE.TextureLoader().load( "./images/grass-hd.jpg" );
			texture.wrapS = THREE.RepeatWrapping;
			texture.wrapT = THREE.RepeatWrapping;
			texture.repeat.set( world_width * world.size, world_height * world.size );

			

		/*	Material
		------------------------------------------*/
			var material = new THREE.MeshStandardMaterial({
					color: '#090',
					map: texture,
					bumpMap: texture,
					bumpScale: -0.3,
					metalness: 0,
					roughness: 1,
					wireframe: false
				});

		_.each(geometry.vertices, function (vertice, i) {

			var world_x = i % (world_width * world.size),
				world_y = Math.floor(i / (world_width * world.size)),

				grid_x = Math.floor(world_x / world.size) % world_width,
				grid_y = Math.floor(world_y / world.size),

				square_x = world_x - (world.size * grid_x),
				square_y = world_y - (world.size * grid_y),

				value = world.getGrid(grid_x,grid_y).getSquare(square_x,square_y).value;

			// vertice.x = star_field.geometry.vertices[i].x;
			// vertice.y = star_field.geometry.vertices[i].y;
			vertice.z = value;

		});




		// Make it low-poly
		geometry = new THREE.BufferGeometry().fromGeometry(geometry);

		var ground = new THREE.Mesh( geometry, material );

		ground.rotateX(Math.PI / -2);

		function setUpBarycentricCoordinates(geometry) {
  
		    var positions = geometry.attributes.position.array;
		    var normals = geometry.attributes.normal.array;

		    // Build new attribute storing barycentric coordinates
		    // for each vertex
		    var centers = new THREE.BufferAttribute(new Float32Array(positions.length), 3);
		    // start with all edges disabled
		    for (var f = 0; f < positions.length; f++) { centers.array[f] = 1; }
		    geometry.addAttribute( 'center', centers );

		    // Hash all the edges and remember which face they're associated with
		    // (Adapted from THREE.EdgesHelper)
		    function sortFunction ( a, b ) { 
		        if (a[0] - b[0] != 0) {
		            return (a[0] - b[0]);
		        } else if (a[1] - b[1] != 0) { 
		            return (a[1] - b[1]);
		        } else { 
		            return (a[2] - b[2]);
		        }
		    }
		    var edge = [ 0, 0 ];
		    var hash = {};
		    var face;
		    var numEdges = 0;

		    for (var i = 0; i < positions.length/9; i++) {
		        var a = i * 9 
		        face = [ [ positions[a+0], positions[a+1], positions[a+2] ] ,
		                 [ positions[a+3], positions[a+4], positions[a+5] ] ,
		                 [ positions[a+6], positions[a+7], positions[a+8] ] ];
		        for (var j = 0; j < 3; j++) {
		            var k = (j + 1) % 3;
		            var b = j * 3;
		            var c = k * 3;
		            edge[ 0 ] = face[ j ];
		            edge[ 1 ] = face[ k ];
		            edge.sort( sortFunction );
		            key = edge[0] + ' | ' + edge[1];
		            if ( hash[ key ] == undefined ) {
		                hash[ key ] = {
		                  face1: a,
		                  face1vert1: a + b,
		                  face1vert2: a + c,
		                  face2: undefined,
		                  face2vert1: undefined,
		                  face2vert2: undefined
		                };
		                numEdges++;
		            } else { 
		                hash[ key ].face2 = a;
		                hash[ key ].face2vert1 = a + b;
		                hash[ key ].face2vert2 = a + c;
		            }
		        }
		    }

		    var index = 0;
		    for (key in hash) {
		        h = hash[key];
		        
		        // ditch any edges that are bordered by two coplanar faces
		        var normal1, normal2;
		        if ( h.face2 !== undefined ) {
		            normal1 = new THREE.Vector3(normals[h.face1+0], normals[h.face1+1], normals[h.face1+2]);
		            normal2 = new THREE.Vector3(normals[h.face2+0], normals[h.face2+1], normals[h.face2+2]);
		            if ( normal1.dot( normal2 ) >= 0.9999 ) { continue; }
		        }

		        // mark edge vertices as such by altering barycentric coordinates
		        var otherVert;
		        otherVert = 3 - (h.face1vert1 / 3) % 3 - (h.face1vert2 / 3) % 3;
		        centers.array[h.face1vert1 + otherVert] = 0;
		        centers.array[h.face1vert2 + otherVert] = 0;
		        
		        otherVert = 3 - (h.face2vert1 / 3) % 3 - (h.face2vert2 / 3) % 3;
		        centers.array[h.face2vert1 + otherVert] = 0;
		        centers.array[h.face2vert2 + otherVert] = 0;
		    }
		}




		ground.geometry.computeFaceNormals();
		ground.geometry.computeVertexNormals();


		ground.scale.x = scale;
		ground.scale.y = scale;
		ground.scale.z = scale;

		ground.position.x += (scale * world_width * world.size) / 2;
		ground.position.z += (scale * world_height * world.size) / 2;

		ui.scene.add( ground );

		window.ground = ground;

	/**/





	/*	Water
	------------------------------------------*/
		(function () {

			/*	geometry
			------------------------------------------*/
				var geometry = new THREE.PlaneGeometry(
						world_width * world.size,
						world_height * world.size
					);

			/*	Texture
			------------------------------------------*/
				var texture = new THREE.TextureLoader().load( "./images/water.jpg" );
				texture.wrapS = THREE.RepeatWrapping;
				texture.wrapT = THREE.RepeatWrapping;
				texture.repeat.set( world_width * world.size, world_height * world.size );

			/*	Material
			------------------------------------------*/
				var material = new THREE.MeshStandardMaterial({
					color: '#09f',
					map: texture,
					bumpMap: texture,
					bumpScale: -0.3,
					roughness: 0.65,
					metalness: 0.25,
					wireframe: false,
					transparent: true,
					opacity: 0.85,
					side: THREE.DoubleSide
				});


			/*	Mesh
			------------------------------------------*/
				var water = new THREE.Mesh( geometry, material );


			/*	Positioning
			------------------------------------------*/
				water.rotateX(Math.PI / -2);
				water.position.y = 1.99 * scale;

				water.scale.x = scale;
				water.scale.y = scale;
				water.scale.z = scale;

				water.position.x += (scale * world_width * world.size) / 2;
				water.position.z += (scale * world_height * world.size) / 2;

			/*	Add it!
			------------------------------------------*/
				ui.scene.add( water );

				window.water = water;

		})();

	/**/






	/*	Boxes
	------------------------------------------*
		_.each(world.grids, function (grid) {

		_.each(grid.squares, function (square) {

			var geometry = new THREE.PlaneBufferGeometry(1,1),
				color = ({

					0: '#039',
					1: '#09f',
					2: '#ff9',
					3: '#3f3',
					4: '#990',
					5: '#eef'

				})[square.value];


			var material = new THREE.MeshStandardMaterial( { color:color } ),
				cube = new THREE.Mesh( geometry, material );

			cube.rotateX(Math.PI / -2);
			cube.position.x = scale * ((grid.x * grid.size) + square.x);
			cube.position.y = scale * ({

					0: 0.9,
					1: 0.9,
					2: 1,
					3: 2,
					4: 3,
					5: 4

				})[square.value];
			cube.position.z = scale * ((grid.y * grid.size) + square.y);

			cube.scale.x = scale;
			cube.scale.y = scale;
			cube.scale.z = scale;

			ui.scene.add( cube );

		});

	});

	/**/





	ui.ambient_light.intensity = 0.25;
	ui.directional_light.intensity = 0.75;


	/*	Hemisphere Light
	------------------------------------------*/
		var hl = new THREE.HemisphereLight('#9ff','#090',0.5);
		ui.scene.add(hl);


	_.extend(ui.directional_light.position, {x: -1, y: 0.7, z: -1});

	_.extend(ui.camera.position,  {x: 238, y: 76, z: 264});
	ui.camera.lookAt(ground.position);

	if (ui.scene.fog) {
		_.extend(ui.scene.fog.color, {r: 0.5, g: 0.75, b: 0.75});
		ui.scene.fog.density = 0.003;
	}


	window.fog_d_w = 0.05;
	window.fog_d_a = 0.005;

	window.background = {};

	_.extend(background, new THREE.Color('#cff'));

	ui.on('frame', function () {

		_.extend(ui.scene.background, window.background);

		if (ui.camera.position.y < water.position.y) {
			// water
			ui.scene.fog.density = window.fog_d_w;

			_.extend(ui.scene.fog.color, {
				r: 0.1,
				g: 0.7,
				b: 0.9
			});
		} else {
			// air
			ui.scene.fog.density = window.fog_d_a;

			_.extend(ui.scene.fog.color, window.background);
	    }
	});



	window.world = world;

})();
