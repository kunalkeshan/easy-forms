const modal = document.getElementById("modal");
const modalTitle = modal.querySelector(".modal__title");
const modalMessage = modal.querySelector(".modal__message");
const overlay = document.getElementById("overlay");
const loader = document.getElementById("loader");

const durationTime = 3;


/* 
* Class to create loader
*/
class Loader{
    constructor(loaderElement, overlayElement){
        this.loader = loaderElement;
        this.overlay = overlayElement;
    }

    showLoader(){
        this.loader.style.display = "block";
        this.overlay.style.display = "block";
    }

    hideLoader(){
        this.loader.style.display = "none";
        this.overlay.style.display = "none";
    }
}

// Loader created from class and exported
const loadLoader = new Loader(loader, overlay);


/* 
* Global common message modal.
* @params{string} type
* @params{string} title
* @params{string} message
*/
const callMessageModal = (type, title, message) => {

    loadLoader.showLoader();

    const removeAllClass = () => {
        modal.classList.remove("modal-error");
        modal.classList.remove("modal-success");
    }
    removeAllClass();

    modal.classList.add(type);
    modalTitle.innerHTML = title;
    modalMessage.innerHTML = message;


    setTimeout(() => {
        modal.style.animation = `modal-animation ${durationTime}s ease 1 backwards`;
        loadLoader.hideLoader();
    }, 500);


    setTimeout(() => {
        modal.style.animation = "";
    }, durationTime * 1000);


}

export {
    callMessageModal, 
    loadLoader, 
    durationTime, 
}

// Common Functions that are not exported.

const callLoader = (destination) => {
    loadLoader.showLoader();
    setTimeout(() => {
        window.location.replace(`/${destination}`)
        loadLoader.hideLoader();
    }, 500);    
    
}

const destinations = ["home", "dashboard", "profile", "signout"]
const navLinks = document.querySelectorAll(".nav__link") || null;
navLinks.forEach((link, index) => {
    link.onclick = function(){
        callLoader(destinations[index]);
    }
});






