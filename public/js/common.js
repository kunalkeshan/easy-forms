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

/* 
* Create a card function for the dashboard
* @params {string} formid
* @params {string} title
* @params {string} description
* @params {string} created_at
*/

const createFormCard = ({formid, title, description, created_at}) => {
    const formCard = `
        <a class="form__card flex items-center mx-auto w-3/5 text-sm rounded p-1 m-3" href="/form/edit?formid=${formid}">
            <i class="fas fa-sticky-note text-xl mx-5 form-icon block"></i>
            <div class="card-details flex items-center justify-between w-full">
                <div class="card__text">
                    <p class="card__title text-lg overflow-ellipsis overflow-hidden whitespace-nowrap">${title}</p>
                    <p class="card__description overflow-ellipsis overflow-hidden whitespace-nowrap">${description}</p>
                </div>
                <p class="card__created text-xs"><strong>Created on: </strong>${created_at}</p>
            </div>
        </a>
    `;

    return formCard;
}

/* 
* Gets all forms of that specific user.
*/
const getAllForms = async () => {

    try {
        let userForms = await axios.get("/forms");
        userForms = userForms.data;
        return userForms;

    } catch (error) {
        console.log(error);
    }
}


export {
    callMessageModal, 
    loadLoader, 
    durationTime, 
    getAllForms,
    createFormCard,
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






