import SITE_INFO from "@/config";

const STORAGE_KEY = "giscus_comment_timestamps";
const VERSION_KEY = "giscus_version";
const CURRENT_VERSION = "4";
const LIMITS = { perHour: 1, perDay: 10, perWeek: 30 };

let countdownInterval: ReturnType<typeof setInterval> | null = null;
let messageHandler: ((event: MessageEvent) => void) | null = null;
let lastHeight = 0;

// ========== localStorage ==========

function getTimestamps(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function saveTimestamps(ts: string[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ts));
}

function cleanupOld(ts: string[]): string[] {
  const cutoff = Date.now() - 7 * 24 * 3600_000;
  return ts.filter((t) => new Date(t).getTime() > cutoff);
}

function recordComment() {
  const ts = cleanupOld(getTimestamps());
  ts.push(new Date().toISOString());
  saveTimestamps(ts);
}

// ========== 频率限制 ==========

function checkLimits(ts: string[]) {
  const now = Date.now();
  const inHour = ts.filter((t) => now - new Date(t).getTime() < 3_600_000);
  const inDay = ts.filter((t) => now - new Date(t).getTime() < 86_400_000);

  if (inHour.length >= LIMITS.perHour) {
    const oldest = Math.min(...inHour.map((t) => new Date(t).getTime()));
    return { blocked: true, resetIn: oldest + 3_600_000 - now, reason: "每小时限评 1 条", remaining: { hour: 0, day: LIMITS.perDay - inDay.length, week: LIMITS.perWeek - ts.length } };
  }
  if (inDay.length >= LIMITS.perDay) {
    const oldest = Math.min(...inDay.map((t) => new Date(t).getTime()));
    return { blocked: true, resetIn: oldest + 86_400_000 - now, reason: "每日限评 10 条", remaining: { hour: LIMITS.perHour - inHour.length, day: 0, week: LIMITS.perWeek - ts.length } };
  }
  if (ts.length >= LIMITS.perWeek) {
    const oldest = Math.min(...ts.map((t) => new Date(t).getTime()));
    return { blocked: true, resetIn: oldest + 604_800_000 - now, reason: "每周限评 30 条", remaining: { hour: LIMITS.perHour - inHour.length, day: LIMITS.perDay - inDay.length, week: 0 } };
  }

  return {
    blocked: false, resetIn: 0, reason: "",
    remaining: { hour: LIMITS.perHour - inHour.length, day: LIMITS.perDay - inDay.length, week: LIMITS.perWeek - ts.length },
  };
}

function formatCountdown(ms: number): string {
  const s = Math.ceil(ms / 1000);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) return `${h} 小时 ${m} 分 ${sec} 秒`;
  if (m > 0) return `${m} 分 ${sec} 秒`;
  return `${sec} 秒`;
}

// ========== UI ==========

function updateQuota(remaining: { hour: number; day: number; week: number }) {
  const el = document.getElementById("commentQuota");
  if (el) el.textContent = `本小时 ${remaining.hour} 次 | 今日 ${remaining.day} 次 | 本周 ${remaining.week} 次`;
}

function hideLoading() {
  const el = document.getElementById("commentLoading");
  if (el) el.style.display = "none";
}

function showRateLimit(reason: string, resetIn: number) {
  const wrapper = document.getElementById("commentRateLimit");
  const msg = document.getElementById("rateLimitMessage");
  const countdown = document.getElementById("commentCountdown");
  if (!wrapper || !msg || !countdown) return;
  msg.textContent = `评论频率限制：${reason}`;
  wrapper.style.display = "";
  hideLoading();

  const endTime = Date.now() + resetIn;
  countdownInterval = setInterval(() => {
    const left = endTime - Date.now();
    if (left <= 0) {
      clearInterval(countdownInterval!);
      countdownInterval = null;
      wrapper.style.display = "none";
      return;
    }
    countdown.textContent = `${formatCountdown(left)} 后可再次评论`;
  }, 1000);
}

// ========== 评论检测 ==========

function setupCommentDetection() {
  let initialHeightSet = false;
  let lastRecordedTime = 0;

  messageHandler = (event: MessageEvent) => {
    if (event.origin !== "https://giscus.app") return;
    const data = event.data;
    if (typeof data !== "object" || !data.giscus) return;

    const newHeight = data.giscus.resizeHeight;
    if (!newHeight) return;

    if (!initialHeightSet) {
      initialHeightSet = true;
      lastHeight = newHeight;
      // 隐藏加载动画和登录提示
      hideLoading();
      const hint = document.querySelector(".vh-comment-login") as HTMLElement;
      if (hint) hint.style.display = "none";
      return;
    }

    const now = Date.now();
    // 高度增长 >400px 且冷却 60s 才判定为新评论（排除展开折叠等小幅度变化）
    if (newHeight - lastHeight > 400 && now - lastRecordedTime > 60_000) {
      lastRecordedTime = now;
      lastHeight = newHeight;
      recordComment();
      const ts = cleanupOld(getTimestamps());
      saveTimestamps(ts);
      const status = checkLimits(ts);
      updateQuota(status.remaining);
      if (status.blocked) {
        showRateLimit(status.reason, status.resetIn);
        const container = document.getElementById("commentContainer");
        if (container) {
          const iframe = container.querySelector("iframe");
          if (iframe) iframe.remove();
          const script = container.querySelector("script[src*='giscus']");
          if (script) script.remove();
        }
      }
    } else {
      lastHeight = Math.max(lastHeight, newHeight);
    }
  };
  window.addEventListener("message", messageHandler);
}

// ========== 销毁 ==========

export function commentDestroy() {
  if (countdownInterval) { clearInterval(countdownInterval); countdownInterval = null; }
  if (messageHandler) { window.removeEventListener("message", messageHandler); messageHandler = null; }
  lastHeight = 0;
}

// ========== 初始化 ==========

export default function CommentInit() {
  const container = document.getElementById("commentContainer");
  if (!container) return;
  if (!SITE_INFO.Giscus.enable || !SITE_INFO.Giscus.repo) return;

  // 版本检查：清理旧脏数据
  const storedVersion = localStorage.getItem(VERSION_KEY);
  if (storedVersion !== CURRENT_VERSION) {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.setItem(VERSION_KEY, CURRENT_VERSION);
  }

  const ts = cleanupOld(getTimestamps());
  saveTimestamps(ts);
  const status = checkLimits(ts);
  updateQuota(status.remaining);

  if (status.blocked) {
    showRateLimit(status.reason, status.resetIn);
    // 限频时移除 Giscus 脚本和 iframe
    const iframe = container.querySelector("iframe");
    if (iframe) iframe.remove();
    const script = container.querySelector("script[src*='giscus']");
    if (script) script.remove();
  } else {
    setupCommentDetection();
  }
}
