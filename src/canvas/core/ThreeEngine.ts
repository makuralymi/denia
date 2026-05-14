import * as THREE from 'three';
import { BaseEngine } from './BaseEngine';

/**
 * Three.js 渲染引擎实例
 * 负责场景(Scene)、相机(Camera)、渲染器(Renderer)的初始化与基础编排
 */
export class ThreeEngine extends BaseEngine {
  public scene: THREE.Scene;
  public camera: THREE.PerspectiveCamera;
  public renderer: THREE.WebGLRenderer;

  constructor(canvas: HTMLCanvasElement) {
    super(canvas);

    // 1. 初始化场景
    this.scene = new THREE.Scene();
    // 使用全透明背景，以便透出底层的 public/image/denia.png 静态壁纸
    this.scene.background = null; 
    // 渲染雾效也使用主色调里的浅粉/紫辉光 (#fabffd 代表 250,191,253)
    this.scene.fog = new THREE.FogExp2('#fabffd', 0.005);

    // 2. 初始化相机 (这里使用默认透视相机)
    // 宽高的实际值会在父类挂载 resizeObserver 后的 onResize 中首次触发并修正
    this.camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    this.camera.position.set(0, 0, 10);

    // 3. 初始化渲染器
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true, // 开启抗锯齿，追求极致视觉
      alpha: true,
      powerPreference: 'high-performance' // 倾向于独显，保证游戏级性能
    });
    
    // 物理正确的光照与色彩空间配置
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    // this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // 限制最大 dpr 为 2 优化性能

    // TODO: 后续在这里可以挂载后期处理管线 (Post-Processing) 如 Bloom、波纹 (Ripple) 等
  }

  protected update(_dt: number): void {
    // 之后实体(Entity)、粒子系统(Particles)、交互控制器的更新逻辑将在此调用
    // 例如: this.particleSystem.update(_dt);
  }

  protected render(): void {
    // 之后如果引入了后期管线，会替换成 this.composer.render()
    this.renderer.render(this.scene, this.camera);
  }

  protected onResize(width: number, height: number): void {
    // 更新相机宽高比
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    // 更新渲染器尺寸
    this.renderer.setSize(width, height, false);
    
    // 如果有后期 Composer，也需在此一并 resize
  }

  public dispose() {
    super.dispose();
    this.renderer.dispose();
    // 遍历场景内的材质与几何体进行销毁，防止 WebGL 内存泄漏
    this.scene.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        if (object.geometry) object.geometry.dispose();
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach((m) => m.dispose());
          } else {
            object.material.dispose();
          }
        }
      }
    });
  }
}
