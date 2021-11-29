const modal = document.getElementById("modal") || null;
const modalTitle = modal.querySelector(".modal__title") || null;
const modalMessage = modal.querySelector(".modal__message") || null;
const overlay = document.getElementById("overlay") || null;
const loader = document.getElementById("loader") || null;
const miniLoader = document.getElementById("mini-loader") || null;

const durationTime = 3;

/* 
* Class to create loader component with show and hide functionality.
* @params (element) loaderElement - a loader gif or image.
* @params (element) overlayElement - a overlay box.
* @returns (object) (Loader) - can call the loader with {showLoader()} and hide the loader with {hideLoader()} methods.
*/
class Loader{
    constructor(loaderElement, overlayElement){
        this.loader = loaderElement;
        this.overlay = overlayElement;
    }

    showLoader(){
        this.loader.style.display = "block";
        if(this.overlay) this.overlay.style.display = "block";
    }

    hideLoader(){
        this.loader.style.display = "none";
        if(this.overlay) this.overlay.style.display = "none";
    }
}

/* 
* Class to create an Overlay component, with show and hide functionality.
* @params (element) overlayElement.
* @returns (object) (Overlay) with three functionalities, {showOverlay()} to display the overlay.
*                                                         {hideOverlay()} to hide the overlay.
*                                                         {addClick()} to hide/display the overlay and any element associated with the element.
*/
class Overlay{
    constructor(overlayElement){
        this.overlay = overlayElement;
    }

    showOverlay(){
        this.overlay.style.display = "block";
    }

    hideOverlay(){
        this.overlay.style.display = "none";
    }

    addClick(siblingElement){
        if(siblingElement) return;
        this.overlay.addEventListener("click", () => {
            const display = this.overlay.style.display;
            if(display === "block"){
                this.hideOverlay();
                if(siblingElement) siblingElement.style.display = "none";
            } else {
                this.showOverlay();
                if(siblingElement) siblingElement.style.display = "flex";
            }
        })
    }

}

// Loader created from class and exported
const loadLoader = new Loader(loader, overlay);
const loadMiniLoader = new Loader(miniLoader);

const loadOverlay = new Overlay(overlay);

/* 
* Global common message modal component.
* @params{string} type - type of modal - modal-error, modal-success.
* @params{string} title - title of modal.
* @params{string} message - message content of modal.
* @params{boolean} noLoader - checks whether to call loader along with modal, true - loader is not called, false/no argument - loader is called.
*/
const callMessageModal = (type, title, message, noLoader) => {

    if(!noLoader) loadLoader.showLoader();

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
        if(!noLoader) loadLoader.hideLoader();
    }, 500);

    setTimeout(() => {
        modal.style.animation = "";
    }, durationTime * 1000);
}

export {
    callMessageModal, 
    loadLoader,
    loadMiniLoader,
    loadOverlay, 
    durationTime, 
}

// => Common Functions that are not exported.

/* 
* Function to redirect to a different page, while calling the loader.
* @params (string) destination - location of where the website should be directed to.
*/

const callLoader = (destination) => {
    loadLoader.showLoader();
    setTimeout(() => {
        window.location.replace(`/${destination}`)
        loadLoader.hideLoader();
    }, 500);    
    
}

const destinations = ["home", "dashboard", "profile", "signout"] //Collection all pages to redirect to. 
const navLinks = document.querySelectorAll(".nav__link") || null;
navLinks.forEach((link, index) => {
    link.onclick = function(){
        callLoader(destinations[index]); //Calling @function callLoader for each destination collection in reference to their placements
    }
});






