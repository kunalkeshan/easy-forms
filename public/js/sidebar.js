import {loadLoader} from "./common.js"

const sidebar = document.getElementById("sidebar") || null;
const sidebarItems = document.querySelectorAll(".sidebar__box") || null;
const sidebarToggle = document.querySelector(".sidebar__toggle") || null;
const sidebarPara = document.querySelectorAll(".sidebar__para") || null;

const editProfileBtn = document.getElementById("profile-edit") || null;
const editProfileCta = document.querySelector(".profile-cta") || null;
const editProfile = document.querySelector(".profile-cta button") || null;

document.addEventListener("DOMContentLoaded", () => {
    if(!sidebar) return; //If sidebar element does not exist, then exit from the function.
    const CLASS = "active";

    /* 
    * When sidebar toggle is clicked, the width of sidebar is decreased
    * and the sidebar paras are hidden. 
    * Vice-versa when the sidebar toggle is clicked again.
    */

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

    /* 
    * For each sidebar option, when it is clicked, all the sidebars become inactive by default
    * Only then the actual sidebar item becomes active. 
    */

    sidebarItems.forEach((item, index) => {
        item.onclick = function() {
            let j = 0;
            while(j < sidebarItems.length){
                sidebarItems[j++].className = "sidebar__box";
            }
            item.className = "sidebar__box active"
        }
    });

    /* 
    * When the additional options are clicked, then the options are visible.
    * vice-versa when it is clicked again.
    */

    editProfileBtn.onclick = () => {
        editProfileCta.classList.toggle("visible");
    }

    /* 
    * When the edit profile option is clicked, the page is redirected to the profile page.
    */

    editProfile.onclick = () => {
        loadLoader.showLoader();
        setTimeout(() => {
            window.location.replace("/profile");
            loadLoader.hideLoader();
        }, 500)
    }
})

