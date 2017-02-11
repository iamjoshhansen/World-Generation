module.exports = UI;

var extendJQueryEvents = require('../util/extend-jquery-events.js'),
	properties = require('../util/properties.js');


/*	Constructor
------------------------------------------*/

	function UI (params) {

		var self = this;

		extendJQueryEvents(self);

		self.$container = params.$container;

		self.background_mode = ('skybox' in params) ? 'skybox' : 'fog';


		/*	scene
		------------------------------------------*/
			self.scene = new THREE.Scene();
			self.scene.background = new THREE.Color('#fff');

			if (self.background_mode == 'fog') {
				self.scene.fog = new THREE.FogExp2( self.scene.background, 0.001 );
			}


		/*	camera
		------------------------------------------*/
			self.camera = new THREE.PerspectiveCamera(
					75,
					self.$container.width() / self.$container.height(),
					0.1,
					1000
				);

			self.camera.position.z = 300;



		/*	renderer
		------------------------------------------*/
			self.renderer = new THREE.WebGLRenderer();
			self.renderer.setSize(self.$container.width(), self.$container.height());

			if (self.background_mode == 'fog') {
				self.renderer.setClearColor( self.scene.fog.color );
			}
			self.renderer.setPixelRatio( window.devicePixelRatio );

			self.$container.append(self.renderer.domElement);



		/*	Raycaster
		------------------------------------------*/
			self.raycaster = new THREE.Raycaster();
			self.mouse = new THREE.Vector2();

			$(window)
				.on('mousemove', function (ev) {
					// calculate mouse position in normalized device coordinates
					// (-1 to +1) for both components

					self.mouse.x = ( ev.clientX / self.$container.width() ) * 2 - 1;
					self.mouse.y = - ( ev.clientY / self.$container.height() ) * 2 + 1;
				});



		/*	Window Resize
		------------------------------------------*/
			$(window)
				.on('resize', function () {
					self.camera.aspect = self.$container.width() / self.$container.height();
					self.camera.updateProjectionMatrix();
					self.renderer.setSize( self.$container.width(), self.$container.height() );
				});


		/*	Controlling the Camera
		------------------------------------------*/

			self.controls = new THREE.OrbitControls( self.camera, self.renderer.domElement );
			// enable animation loop when using damping or autorotation
			//controls.enableDamping = true;
			//controls.dampingFactor = 0.25;
			self.controls.enableZoom = true;



		/*	lights
		------------------------------------------*/

			/*	ambient light
			------------------------------------------*/
				self.ambient_light = new THREE.AmbientLight( 0xffffff, 0.75 );
				self.scene.add( self.ambient_light );

			/*	directional light
			------------------------------------------*/
				self.directional_light = new THREE.DirectionalLight( 0xffffff, 0.5 );
				self.directional_light.position.x = 1;
				self.directional_light.position.y = 1;
				self.directional_light.position.z = 1;
				self.directional_light.position.normalize();
				self.scene.add( self.directional_light );





		/*	SkyBox
		------------------------------------------*/
			if (self.background_mode == 'skybox') {
				self.skybox = self.addSkyBox(params.skybox);
			}


		/*	Get it going!
		------------------------------------------*/
			self.render();

	}




/*	Static Methods
------------------------------------------*/
	_.extend(UI, {

		makeTextSprite : require('./util/make-text-sprite.js'),
		gamepad        : require('./xbox-controller/'),

		__: {

			//Ship: require('./__/ship/')

		}

	});



/*	Prototype Methods
------------------------------------------*/
	_.extend(UI.prototype, {

		render: function () {
			var self = this;

			/*	Render the scene!
			------------------------------------------*/

				/*	Camera Control
				------------------------------------------*/



					UI.gamepad.update();

					var controller = UI.gamepad.controllers[0];
					if (controller && controller.is_active) {

						/*	Gamepads
						------------------------------------------*/
							self.camera.translateZ((controller.left_trigger + 1) - (controller.right_trigger + 1));

							if (Math.abs(controller.right_x) > 0.05) {
								self.camera.rotateY(controller.right_x / -40);
							}
							if (Math.abs(controller.right_y) > 0.05) {
								self.camera.rotateX(controller.right_y / -40);
							}

							if (Math.abs(controller.left_x) > 0.05) {
								self.camera.translateX(controller.left_x);
							}
							if (Math.abs(controller.left_y) > 0.05) {
								self.camera.translateY(-controller.left_y);
							}

							if (controller.bumper_right) {
								self.camera.rotateZ(0.01);
							}

							if (controller.bumper_left) {
								self.camera.rotateZ(-0.01);
							}

					} else {

						/*	Mouse
						------------------------------------------*/
							if (self.target && self.target in self.fg.nodes) {
								_.extend(self.controls.target, self.fg.nodes[self.target]);
							}
							self.controls.update();

					}


				if (self.background_mode == 'skybox') {
					_.extend(self.skybox.position, self.camera.position);
				}


				/*	Raycaster
				------------------------------------------*/
					// update the picking ray with the camera and mouse position
					self.raycaster.setFromCamera( self.mouse, self.camera );

					// calculate objects intersecting the picking ray
					/*var intersects = self.raycaster.intersectObjects( self.scene.children );

					_.each(intersects, function (item) {
						console.log(item.object.fg_node.id);
					});*/


				self.triggerHandler('frame');

				// Do it!
				self.renderer.render( self.scene, self.camera );

			/*	Do it again!
			------------------------------------------*/
				requestAnimationFrame(function () {
					self.render();
				});
		},

		addCube     : require('./things/cube.js'),
		addSphere   : require('./things/sphere.js'),
		addParticle : require('./things/particle.js'),
		addLabel    : require('./things/label.js'),
		addPipe     : require('./things/pipe.js'),
		addSkyBox   : require('./things/sky-box.js')

	});
