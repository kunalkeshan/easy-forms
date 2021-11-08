import {loadLoader} from "./common.js"

const sidebar = document.getElementById("sidebar")
const sidebarItems = document.querySelectorAll(".sidebar__box") || null;
const sidebarToggle = document.querySelector(".sidebar__toggle");
const sidebarPara = document.querySelectorAll(".sidebar__para");

const editProfileBtn = document.getElementById("profile-edit") || null;
const editProfileCta = document.querySelector(".profile-cta") || null;
const editProfile = document.querySelector(".profile-cta button") || null;

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

    editProfileBtn.onclick = () => {
        editProfileCta.classList.toggle("visible");
    }
    editProfile.onclick = () => {
        loadLoader.showLoader();
        setTimeout(() => {
            window.location.replace("/profile");
            loadLoader.hideLoader();
        }, 500)
    }

}


