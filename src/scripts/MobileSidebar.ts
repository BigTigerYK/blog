// 初始化侧边栏
export default () => {
  const menuDOM: any = document.querySelector(".vh-header>.main>nav>span.menu-btn");
  const mobileSidebarDOM: any = document.querySelector("body>.vh-mobilesidebar");
  const addActive = () => setTimeout(() => {
    mobileSidebarDOM.classList.add("active");
    document.body.style.overflow = "hidden";
  });
  const removeActive = () => setTimeout(() => {
    mobileSidebarDOM.classList.remove("active");
    document.body.style.overflow = "";
  });
  menuDOM.addEventListener("click", addActive);
  mobileSidebarDOM.addEventListener("click", removeActive);
};