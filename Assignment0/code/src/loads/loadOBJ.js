
function loadOBJ(renderer, path, name) {

	// 管理加载过程
	const manager = new THREE.LoadingManager();

	// 加载进度的回调函数
	manager.onProgress = function (item, loaded, total) {
		console.log(item, loaded, total);
	};

	// 定义了一个局部函数，用于监视加载进度。这个函数在加载过程中被调用，它检查加载进度并输出日志。
	function onProgress(xhr) {
		if (xhr.lengthComputable) {
			const percentComplete = xhr.loaded / xhr.total * 100;
			console.log('model ' + Math.round(percentComplete, 2) + '% downloaded');
		}
	}

	// 定义了一个空的错误处理函数。如果在加载过程中出现错误，可以调用此函数进行处理。
	function onError() { }

	// 创建了一个 THREE.MTLLoader 实例，用于加载模型的材质文件（.mtl 文件）。
	new THREE.MTLLoader(manager)
		.setPath(path)
		.load(name + '.mtl', function (materials) {
			materials.preload();

			// 创建了一个 THREE.OBJLoader 实例，用于加载模型文件（.obj 文件）。
			new THREE.OBJLoader(manager)
				.setMaterials(materials)
				.setPath(path)

				// 加载模型文件。加载完成后调用回调函数，参数 object 是加载的模型对象。
				.load(name + '.obj', function (object) {
					// 遍历模型对象的子元素，这里主要针对每个子网格进行处理。
					object.traverse(function (child) {
						// 检查子元素是否为网格。
						if (child.isMesh) {
							// 这里模型有两个 Mesh
							// 一个对应模型主体；
							// 一个为裙摆的 '202' 字体

							// 获取子网格的几何体（geometry）
							let geo = child.geometry;

							// 获取子网格的材质。
							let mat;
							if (Array.isArray(child.material)) mat = child.material[0];
							else mat = child.material;

							// 创建顶点索引数组。
							var indices = Array.from({ length: geo.attributes.position.count }, (v, k) => k);

							// 实例化 Mesh 对象，用于描述网格的顶点、法线、纹理坐标和顶点索引等属性。
							let mesh = new Mesh({ name: 'aVertexPosition', array: geo.attributes.position.array },
								{ name: 'aNormalPosition', array: geo.attributes.normal.array },
								{ name: 'aTextureCoord', array: geo.attributes.uv.array },
								indices);

							// 检查材质是否有贴图（map），若有则创建纹理对象 colorMap。
							let colorMap = null;
							if (mat.map != null) colorMap = new Texture(renderer.gl, mat.map.image);

							/*// MARK: You can change the myMaterial object to your own Material instance

							let textureSample = 0;
							let myMaterial;
							if (colorMap != null) {
								textureSample = 1;
								myMaterial = new Material({
									'uSampler': { type: 'texture', value: colorMap },
									'uTextureSample': { type: '1i', value: textureSample },
									'uKd': { type: '3fv', value: mat.color.toArray() }
								},[],VertexShader, FragmentShader);
							}else{
								myMaterial = new Material({
									'uTextureSample': { type: '1i', value: textureSample },
									'uKd': { type: '3fv', value: mat.color.toArray() }
								},[],VertexShader, FragmentShader);
							}*/

							// 此处的 mat.color是指材质的基本颜色，Marry.mtl有两个材质，其中的 Kd即为这里的颜色
							let myMaterial = new PhongMaterial(mat.color.toArray(), colorMap , mat.specular.toArray(),
								renderer.lights[0].entity.mat.intensity);

							let meshRender = new MeshRender(renderer.gl, mesh, myMaterial);

							// 模型加载完后，renderer的 meshes元素数量应该为 2
							renderer.addMesh(meshRender);

							// console.log("Meshes: " + renderer.meshes.length);
						}
					});
				}, onProgress, onError);
		});
}
