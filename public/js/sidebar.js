const sidebar = document.getElementById("sidebar")
const sidebarItems = document.querySelectorAll(".sidebar__box") || null;
const sidebarToggle = document.querySelector(".sidebar__toggle");
const sidebarPara = document.querySelectorAll(".sidebar__para");

console.log(sidebar)
if(sidebar){

    const CLASS = "active";

    sidebarToggle.onclick = function() {
        const isOpen = sidebarToggle.classList.toggle(CLASS);
        sidebarPara.forEach(para => {
            if(isOpen){
                para.style.display = "none";
            } else {
                para.style.display = "block";
            }
        })
        
        sidebar.classList.toggle(CLASS)
    }

    sidebarItems.forEach((item, index) => {
  
        item.onclick = function() {
            let j = 0;
            while(j < sidebarItems.length){
                sidebarItems[j++].className = "sidebar__box";
            }
            item.className = "sidebar__box active"
        }
    });
}


