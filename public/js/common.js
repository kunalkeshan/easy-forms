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
    // const formCard = `
    // <div class="card flex items-center w-3/5 rounded p-2 m-2">
    //     <i class="fas fa-sticky-note form-icon text-xl md:text-2xl mx-2 md:mx-5"></i>
    //     <div class="card__text w-2/5 md:w-3/5 mx-auto">
    //         <p class="card__title overflow-ellipsis overflow-hidden whitespace-nowrap">${title}</p>
    //         <p class="card__description overflow-ellipsis overflow-hidden whitespace-nowrap">${description}</p>
    //     </div>
    //     <div class="card__container ml-auto">
    //         <div class="card__cta text-xl md:text-2xl flex justify-center">
    //             <a href="/form/edit?formid=${formid}" title="Edit Form"><i class="fas fa-edit edit-icon mr-2 md:mr-5"></i></a>
    //             <a href="#" title="View Responses"><i class="fas fa-chart-line response-icon mr-2 md:mr-5"></i></a>
    //             <a href="#" title="Delete Form"><i class="fas fa-trash-alt delete-icon"></i></a>
    //         </div>
    //         <p class="card__created text-sm"><strong class="min-w-max">Created at: </strong><p class="text-xs min-w-max">${created_at}</p></p>
    //     </div>
    // </div>`;

    const formCard = document.createElement("div");
    const formIcon = document.createElement("i");
    const cardText = document.createElement("div");
    const cardTitle = document.createElement("p");
    const cardDescription = document.createElement("p");
    const cardContainer = document.createElement("div");
    const cardCta = document.createElement("div");
    const editLink = document.createElement("a");
    const responseLink = document.createElement("a");
    const deleteLink = document.createElement("a");
    const editIcon = document.createElement("i");
    const responseIcon = document.createElement("i");
    const deleteIcon = document.createElement("i");
    const cardCreated = document.createElement("p");
    const strongCreated = document.createElement("strong");
    const createdContainer = document.createElement("p");

    createdContainer.innerHTML = created_at;
    createdContainer.className = "text-xs min-w-max";
    strongCreated.innerHTML = "Created at:";
    strongCreated.className = "min-w-max";

    cardCreated.append(strongCreated, createdContainer);

    editIcon.className = "fas fa-edit edit-icon mr-2 md:mr-5";
    responseIcon.className = "fas fa-chart-line response-icon mr-2 md:mr-5";
    deleteIcon.className = "fas fa-trash-alt delete-icon";

    editLink.href = `/form/edit?formid=${formid}`;
    editLink.title = "Edit Form";
    responseLink.onclick = () => {console.log("yet to be implemented")}
    responseLink.title = "View Responses";
    deleteLink.onclick = () => {doDelete(formid)}
    deleteLink.title = "Delete Form";

    editLink.append(editIcon);
    responseLink.append(responseIcon);
    deleteLink.append(deleteIcon);

    cardCta.className = "card__cta text-xl md:text-2xl flex justify-center";
    cardCta.append(editLink, responseLink, deleteLink);

    cardContainer.className = "card__container ml-auto";
    cardContainer.append(cardCta, cardCreated);

    cardTitle.className = "card__title overflow-ellipsis overflow-hidden whitespace-nowrap";
    cardDescription.className = "card__description overflow-ellipsis overflow-hidden whitespace-nowrap"
    cardTitle.innerHTML = title;
    cardDescription.innerHTML = description;

    cardText.className = "card__text w-2/5 md:w-3/5 mx-auto";
    cardText.append(cardTitle, cardDescription);

    formIcon.className = "fas fa-sticky-note form-icon text-xl md:text-2xl mx-2 md:mx-5";
    formCard.className = "card flex items-center w-3/5 rounded p-2 m-2";
    formCard.id = formid

    formCard.append(formIcon, cardText, cardContainer);

    const doDelete = async (id) => {
        loadLoader.showLoader();
        try {
            const response = await axios.delete(`form/delete?formid=${id}`);
            if(response.status === 200){
                loadLoader.hideLoader();
                callMessageModal("modal-success", "Success", `${title} deleted successfully`)
                setTimeout(() => {
                    const card = document.getElementById(formid);
                    card.style.display = "none";
                    card.remove();
                }, durationTime * 1000);
            }
        } catch (error) {
            loadLoader.hideLoader();
            callMessageModal("modal-error", "Error", "something wrong has happened")
            console.log(error)
        }
    }

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






