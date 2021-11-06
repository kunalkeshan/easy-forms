
const modal = document.getElementById("modal");
const modalTitle = modal.querySelector(".modal__title");
const modalMessage = modal.querySelector(".modal__message");
const overlay = document.getElementById("overlay");
const loader = document.getElementById("loader")

const durationTime = 4;

const callMessageModal = (type, title, message) => {
    const removeAllClass = () => {
        modal.classList.remove("modal-error");
        modal.classList.remove("modal-success");
    }
    removeAllClass();

    overlay.style.display = "block";
    loader.style.display = "block";

    setTimeout(() => {

        overlay.style.display = "none";
        loader.style.display = "none";

        modal.style.animation = `modal-animation ${durationTime}s ease 1 backwards`;
        modal.classList.add(type);
        modalTitle.innerHTML = title;
        modalMessage.innerHTML = message;
    }, 1000);


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
    callMessageModal, durationTime, getAllForms
}



