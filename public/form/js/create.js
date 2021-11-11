import {loadLoader, callMessageModal} from "./common.js";

const formTitle = document.getElementById("form__title") || null;
const formDescription = document.getElementById("form__description") || null;

const updateFormDetails = async () => {
    const title = formTitle.value;
    const description = formDescription.value;

    const body = {title, description}
    try {
        await axios.post(`/form/edit/${formId}`, body);
    } catch (error) {
        console.log(error);
    }
}
document.addEventListener("DOMContentLoaded", () => {
    
    formTitle.addEventListener("keyup", updateFormDetails);
    formDescription.addEventListener("keyup", updateFormDetails);
})