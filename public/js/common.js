const modal = document.getElementById("modal");
const modalTitle = modal.querySelector(".modal__title");
const modalMessage = modal.querySelector(".modal__message");
const overlay = document.getElementById("overlay");
const loader = document.getElementById("loader")

const durationTime = 3;

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

const loadLoader = new Loader(loader, overlay);

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
    getAllForms
}



