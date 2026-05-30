// TOC 动态高亮（进度条已迁移到 CSS scroll-driven animation）
let tocObserver: IntersectionObserver | null = null;

export function tocInit() {
  const tocLinks = document.querySelectorAll('.vh-toc-link');
  const article = document.querySelector('.vh-article-main');

  // TOC 高亮
  if (!tocLinks.length || !article) return;

  const headings = article.querySelectorAll('h2[id], h3[id]');
  if (!headings.length) return;

  // 清除之前的 observer
  if (tocObserver) {
    tocObserver.disconnect();
  }

  let currentActiveId = '';

  function setActive(id: string) {
    if (id === currentActiveId) return;
    currentActiveId = id;
    tocLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('data-heading-id') === id);
    });
  }

  tocObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          setActive(entry.target.id);
        }
      }
    },
    {
      rootMargin: '-80px 0px -80% 0px',
      threshold: 0
    }
  );

  headings.forEach(heading => {
    tocObserver!.observe(heading);
  });

  // 平滑滚动点击
  tocLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const id = link.getAttribute('data-heading-id');
      const target = document.getElementById(id!);
      if (target) {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        target.scrollIntoView({
          behavior: prefersReducedMotion ? 'auto' : 'smooth',
          block: 'start'
        });
        setActive(id!);
      }
    });
  });
}

export function tocDestroy() {
  if (tocObserver) {
    tocObserver.disconnect();
    tocObserver = null;
  }
}
