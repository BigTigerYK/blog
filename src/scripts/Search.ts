// Pagefind 搜索引擎（运行时通过 script 标签加载）
let pagefind: any = null;
let pagefindLoaded = false;

const loadPagefind = async (): Promise<any> => {
  if (pagefindLoaded) return pagefind;
  pagefindLoaded = true;
  try {
    // 动态创建 script 标签加载 pagefind
    const script = document.createElement('script');
    script.src = '/pagefind/pagefind.js';
    document.head.appendChild(script);
    await new Promise<void>((resolve, reject) => {
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Pagefind not available'));
    });
    pagefind = (window as any).pagefind;
    if (pagefind) await pagefind.init();
    return pagefind;
  } catch {
    return null;
  }
}

// 搜索
const searchFn = async (value: string) => {
  if (!value.trim()) {
    renderSearch([]);
    return;
  }
  const pf = await loadPagefind();
  if (!pf) {
    renderSearch([]);
    return;
  }
  const result = await pf.search(value);
  const items = await Promise.all(
    result.results.slice(0, 10).map(async (r: any) => {
      const data = await r.data();
      return {
        url: data.url,
        title: data.meta?.title || 'Untitled',
        content: data.excerpt,
      };
    })
  );
  renderSearch(items);
}

// 渲染页面
const renderSearch = (arr: any[]) => {
  const container = document.querySelector('.vh-header>.main>.vh-search>main>.vh-search-list');
  if (!container) return;
  const searchHTML = !arr.length
    ? '<em></em>'
    : arr.map(i => `<a class="vh-search-item" href="${i.url}"><span class="vh-ellipsis">${i.title}</span><p class="vh-ellipsis line-3">${i.content}</p></a>`).join('');
  container.innerHTML = searchHTML;
}

// 截流
let fnTimer: any = null;
const searchInputChange = (v: any) => {
  const value = v.target.value;
  if (fnTimer) clearTimeout(fnTimer);
  fnTimer = setTimeout(() => searchFn(value), 266);
}

// 初始化搜索框
const vhSearchInit = () => {
  const searchDOM: any = document.querySelector(".vh-header>.main>nav>span.search-btn");
  const searchMainDOM: any = document.querySelector(".vh-header>.main>.vh-search>main");
  const searchListDOM: any = document.querySelector(".vh-header>.main>.vh-search");
  const searchInput: any = searchListDOM?.querySelector(".search-input>input");
  const addActive = () => setTimeout(() => {
    searchListDOM.classList.add("active");
    searchInput?.focus();
  });
  const removeActive = () => setTimeout(() => searchListDOM.classList.remove("active"));
  // 禁止默认事件
  searchMainDOM?.addEventListener("click", (e: Event) => e.stopPropagation());
  searchDOM?.addEventListener("click", addActive);
  searchListDOM?.addEventListener("click", removeActive);
  // 搜索框初内容变化
  searchInput?.addEventListener("input", searchInputChange);

  // Command+K / Ctrl+K 全局快捷键
  let selectedIndex = -1;
  document.addEventListener("keydown", (e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault();
      const isActive = searchListDOM?.classList.contains("active");
      if (isActive) {
        removeActive();
      } else {
        addActive();
      }
    }
    // Escape 关闭
    if (e.key === "Escape") {
      removeActive();
    }
  });

  // 搜索结果键盘导航
  searchListDOM?.addEventListener("keydown", (e: KeyboardEvent) => {
    const items = searchListDOM.querySelectorAll('.vh-search-item');
    if (!items.length) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      selectedIndex = Math.min(selectedIndex + 1, items.length - 1);
      updateSelection(items, selectedIndex);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      selectedIndex = Math.max(selectedIndex - 1, 0);
      updateSelection(items, selectedIndex);
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      e.preventDefault();
      const link = items[selectedIndex] as HTMLAnchorElement;
      if (link?.href) window.location.href = link.href;
    }
  });

  // 输入时重置选中索引
  searchInput?.addEventListener("input", () => { selectedIndex = -1; });
};

// 更新搜索结果选中状态
const updateSelection = (items: NodeListOf<Element>, index: number) => {
  items.forEach((item, i) => {
    (item as HTMLElement).style.backgroundColor = i === index ? 'var(--vh-font-16)' : '';
  });
  // 滚动到可见区域
  items[index]?.scrollIntoView({ block: 'nearest' });
};

export { searchFn, searchInputChange, vhSearchInit };
