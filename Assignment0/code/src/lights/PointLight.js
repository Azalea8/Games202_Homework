
class PointLight {
    /**
     * Creates an instance of PointLight.
     * @param {float} lightIntensity  The intensity of the PointLight.
     * @param {vec3f} lightColor The color of the PointLight.
     * @memberof PointLight
     */
    constructor(lightIntensity, lightColor) {
        // 类里面的静态方法是指附加在类本身上而不是类的实例上的方法。这意味着你可以直接通过类来调用这些方法，而不需要创建类的实例。
        this.mesh = Mesh.cube();
        // 实例化光源材质信息
        this.mat = new EmissiveMaterial(lightIntensity, lightColor);
    }
}