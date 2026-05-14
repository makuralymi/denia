/**
 * 引擎核心基类 (WebGL Engine Core)
 * 负责：
 * 1. 统一的 requestAnimationFrame 循环控制，保证顺滑的游戏级帧率
 * 2. 屏幕尺寸适配 (ResizeObserver)，响应全屏无轨 UI 的布局变化
 * 3. 基础的时间步长 (Delta Time) 计算
 */

export abstract class BaseEngine {
  protected canvas: HTMLCanvasElement;
  private animationFrameId: number = 0;
  private lastTime: number = 0;
  private isRunning: boolean = false;
  private resizeObserver: ResizeObserver | null = null;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.initResizeObserver();
  }

  /**
   * 初始化自适应监听
   */
  private initResizeObserver() {
    // 监听容器尺寸变化，确保全屏沉浸式无边框体验，避免传统的 window.resize 带来的滞后感
    this.resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        this.onResize(width, height);
      }
    });

    // 默认监听 canvas 的父元素 (通常为长宽 100% 绝对定位的 Wrapper)
    if (this.canvas.parentElement) {
      this.resizeObserver.observe(this.canvas.parentElement);
    }
  }

  /**
   * 启动渲染循环
   */
  public start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastTime = performance.now();
    this.tick(this.lastTime);
  }

  /**
   * 停止渲染循环
   */
  public stop() {
    this.isRunning = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }

  /**
   * 核心动画循环 (Tick)
   * 复杂的特效（如粒子、流体参数等）依赖这里产出的 deltaTime 进行数学迭代
   * @param currentTime 当前时间(ms)
   */
  private tick = (currentTime: number) => {
    if (!this.isRunning) return;

    // 计算帧增量时间并转换为更易于物理与数学运算的秒数
    const deltaTime = (currentTime - this.lastTime) / 1000;
    this.lastTime = currentTime;

    // 将逻辑更新与画面绘制拆分，方便后续支持固定步长更新 (Fixed Update)
    this.update(deltaTime);
    this.render();

    this.animationFrameId = requestAnimationFrame(this.tick);
  };

  /**
   * 生命周期钩子：逻辑更新 (针对动画、物体变换等)
   * @param dt 帧间隔(秒)
   */
  protected abstract update(dt: number): void;

  /**
   * 生命周期钩子：画面渲染 (发出 WebGL 绘制指令)
   */
  protected abstract render(): void;

  /**
   * 生命周期钩子：尺寸变化响应 (用于更新相机 Aspect、Renderer 尺寸、后期流管线分辨率)
   */
  protected abstract onResize(width: number, height: number): void;

  /**
   * 生命末期：内存与事件清理，防止在前端路由切换时引发内存与性能泄漏
   */
  public dispose() {
    this.stop();
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    // TODO: 子类应在此方法中释放 Geometry, Material 与 Texture
  }
}
