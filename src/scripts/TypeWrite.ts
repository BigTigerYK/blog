import SITE_INFO from '@/config';

// 存储当前动画的 timer ID，用于取消
let typeWriteTimers: ReturnType<typeof setTimeout>[] = [];
let lastWriteDom: Element | null = null;

// 取消正在进行的动画
const cancelTypeWrite = () => {
  typeWriteTimers.forEach(t => clearTimeout(t));
  typeWriteTimers = [];
};

export default () => {
  const writeDom = document.querySelector('.header-main>.desc');
  if (!writeDom) return;
  // DOM 发生变化（ViewTransitions 替换了节点），需要重新启动
  if (lastWriteDom !== writeDom) {
    cancelTypeWrite();
    lastWriteDom = writeDom;
  } else if (typeWriteTimers.length > 0) {
    // 同一个 DOM，动画正在运行，不重复启动
    return;
  }
  const TypeWriteList: any = SITE_INFO.TypeWriteList;
  if (!Array.isArray(TypeWriteList) || !TypeWriteList.length) {
    writeDom.textContent = '';
    return;
  }
  let TypeWriteListIndex = 0;
  let index = 0;
  let isDeleting = false;
  // 主动画函数
  const run = () => {
    writeDom.innerHTML = TypeWriteList[TypeWriteListIndex].substring(0, index);
    // 正常打字阶段
    if (!isDeleting) {
      if (index < TypeWriteList[TypeWriteListIndex].length) {
        index++;
        typeWriteTimers.push(setTimeout(run, 188));
      } else {
        typeWriteTimers.push(setTimeout(() => {
          isDeleting = true;
          run();
        }, 2888));
      }
    } else {
      if (index > 0) {
        index--;
        typeWriteTimers.push(setTimeout(run, 88));
      } else {
        isDeleting = false;
        TypeWriteListIndex++;
        TypeWriteListIndex = TypeWriteListIndex % TypeWriteList.length;
        typeWriteTimers.push(setTimeout(run, 500));
      }
    }
  }
  // 启动动画
  run();
}