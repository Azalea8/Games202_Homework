var cameraPosition = [-20, 180, 250];

GAMES202Main();

function GAMES202Main() {
	const canvas = document.querySelector('#glcanvas');
	canvas.width = window.screen.width;
	canvas.height = window.screen.height;

	// gl常量将保存对 WebGL上下文的引用。然后，可以使用 gl对象发出 WebGL命令并执行各种操作，例如设置视口、创建和操作缓冲区、编译和执行着色器以及渲染图元。
	const gl = canvas.getContext('webgl');
	if (!gl) {
		alert('Unable to initialize WebGL. Your browser or machine may not support it.');
		return;
	}

	// 创建一个具有透视投影的相机，它可以用于渲染三维场景。
	const camera = new THREE.PerspectiveCamera(75, gl.canvas.clientWidth / gl.canvas.clientHeight, 0.1, 1000);

	// 这行代码创建了一个 OrbitControls 对象，用于控制相机在场景中的移动。它接受两个参数：
	//
	// camera：这是你之前创建的相机对象，它是轨道控制器将要控制的相机。
	// canvas：这是用于渲染场景的 <canvas> 元素。轨道控制器将监听鼠标和触摸事件，以便用户可以与场景交互。因此，它需要知道在哪里监听这些事件，这就是为什么需要传递 <canvas> 元素作为参数的原因。
	// 通过使用轨道控制器，用户可以通过鼠标或触摸手势来旋转、缩放和平移相机，从而在场景中浏览三维模型。
	const cameraControls = new THREE.OrbitControls(camera, canvas);

	cameraControls.enableZoom = true; // 允许用户使用鼠标滚轮或触摸手势来缩放场景。
	cameraControls.enableRotate = true; // 允许用户通过鼠标拖动或触摸手势来旋转相机。
	cameraControls.enablePan = true; // 允许用户通过鼠标拖动或触摸手势来平移相机。
	cameraControls.rotateSpeed = 0.3; // 设置了相机控制器旋转的速度
	cameraControls.zoomSpeed = 1.0; // 设置了相机控制器缩放的速度
	cameraControls.panSpeed = 2.0; // 设置了相机控制器平移的速度

	// 回调函数，在窗口大小发生变化时也能及时设置相机的宽高比
	function setSize(width, height) {
		camera.aspect = width / height;
		camera.updateProjectionMatrix();
	}
	setSize(canvas.clientWidth, canvas.clientHeight);
	window.addEventListener('resize', () => setSize(canvas.clientWidth, canvas.clientHeight));

	// 设置相机的位置
	camera.position.set(cameraPosition[0], cameraPosition[1], cameraPosition[2]);

	// 这是轨道控制器的目标位置属性。它表示相机的焦点位置，也就是相机在场景中围绕旋转的中心点。
	cameraControls.target.set(0, 1, 0);

	/*
		从这里开始，代码变得复杂
	*/

	const pointLight = new PointLight(250, [1, 1, 1]);

	const renderer = new WebGLRenderer(gl, camera);
	renderer.addLight(pointLight);
	loadOBJ(renderer, 'assets/mary/', 'Marry');

	var guiParams = {
		modelTransX: 0,
		modelTransY: 0,
		modelTransZ: 0,
		modelScaleX: 52,
		modelScaleY: 52,
		modelScaleZ: 52,
	}
	function createGUI() {
		const gui = new dat.gui.GUI();
		const panelModel = gui.addFolder('Model properties');
		const panelModelTrans = panelModel.addFolder('Translation');
		const panelModelScale = panelModel.addFolder('Scale');
		panelModelTrans.add(guiParams, 'modelTransX').name('X');
		panelModelTrans.add(guiParams, 'modelTransY').name('Y');
		panelModelTrans.add(guiParams, 'modelTransZ').name('Z');
		panelModelScale.add(guiParams, 'modelScaleX').name('X');
		panelModelScale.add(guiParams, 'modelScaleY').name('Y');
		panelModelScale.add(guiParams, 'modelScaleZ').name('Z');
		panelModel.open();
		panelModelTrans.open();
		panelModelScale.open();
	}

	createGUI();

	function mainLoop(now) {
		cameraControls.update();

		renderer.render(guiParams);
		requestAnimationFrame(mainLoop);
	}
	requestAnimationFrame(mainLoop);
}
