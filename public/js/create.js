import {loadLoader, callMessageModal} from "./common.js";
import {sectionCard} from "./formFunctions.js";

let timeout = null;
const formTitle = document.getElementById("form__title") || null;
const formDescription = document.getElementById("form__description") || null;
const formBody = document.querySelector(".form__body")

const addSectionBtn = document.getElementById("add-section-btn") || null;
const deleteSectionBtns = document.querySelectorAll(".delete-section-btn") || null;
const updateFormDetails = () => {
    const title = formTitle.value;
    const description = formDescription.value;
    const body = {title, description}
    try {
        clearTimeout(timeout);
        timeout = setTimeout(async () => {
            await axios.post(`/form/edit/${formId}`, body);
        }, 800);
    } catch (error) {
        console.log(error);
    }
}

const createSection = async () => {
    try {
        const newSection = await axios.post(`/form/create/section/${formId}`);
        if(newSection.status === 200){
            formBody.append(sectionCard(newSection.data.Section));
            addSectionBtn.style.display = "none";
            addSectionBtn.remove();
            const allSections = document.querySelectorAll(".form__section");
            allSections.forEach((section, index) => {
                section.classList.remove("last-section");
                if(index === allSections.length - 1){
                    section.classList.add("last-section");
                    section.append(addSectionBtn);
                    addSectionBtn.style.display = "block";
                }
            });
        }
    } catch (error) {
        console.log(error);
    }
}

const deleteSection = async (e) => {
    const section = e.target.parentElement.parentElement;
    const sectionid = section.id;

    try {
        
        const deleteSection = await axios.delete(`/form/delete/section/${sectionid}/${formId}`);
        if(deleteSection.status === 200){
            callMessageModal("modal-success", "Success", "Section deleted successfully");
            section.style.display = "none";
            section.remove();
        }

    } catch (error) {
        callMessageModal("modal-error", "Error", "Some error has Occured");
        console.log(error);
    }
}

const createQuestion = () => {

}



document.addEventListener("DOMContentLoaded", () => {
    formTitle.addEventListener("keyup", updateFormDetails);
    formDescription.addEventListener("keyup", updateFormDetails);

    addSectionBtn.addEventListener("click", createSection);
    deleteSectionBtns.forEach((deleteBtn, index) => {
        deleteBtn.addEventListener("click", (e) => deleteSection(e))
    });
})