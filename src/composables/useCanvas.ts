import { onMounted, onBeforeUnmount, ShallowRef, shallowRef } from 'vue';
import { ThreeEngine } from '../canvas/core/ThreeEngine';

/**
 * 链接 Vue 响应式生命周期与 Canvas WebGL 渲染引擎的桥梁
 * 确保视图与逻辑的硬隔离
 */
export function useCanvas() {
  // 保存引擎实例，使用 shallowRef 避免 Vue 对复杂的 Three.js 对象进行无意义的深度代理（这会导致严重的性能损耗）
  const engine: ShallowRef<ThreeEngine | null> = shallowRef(null);

  onMounted(() => {
    const canvas = document.querySelector<HTMLCanvasElement>('.webgl-canvas');
    if (!canvas) {
      console.warn('并未找到 Canvas DOM 节点，ThreeEngine 初始化失败');
      return;
    }

    // 实例化 ThreeEngine
    engine.value = new ThreeEngine(canvas);

    // 启动基于 requestAnimationFrame 的游戏循环
    engine.value.start();
  });

  onBeforeUnmount(() => {
    // 组件销毁前，安全地释放掉 WebGL 资源、监听器与定时器，贯彻严格的内存管理
    if (engine.value) {
      engine.value.dispose();
      engine.value = null;
    }
  });

  return {
    engine,
  };
}
