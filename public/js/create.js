import {loadLoader, loadMiniLoader,  callMessageModal, loadOverlay} from "./common.js";
import {sectionCard,  createNewOption} from "./formFunctions.js";

let timeout = null;
const formTitle = document.getElementById("form__title") || null;
const formDescription = document.getElementById("form__description") || null;
const formBody = document.querySelector(".form__body")

const allSections = document.querySelectorAll(".form__section") || null;
const sectionTitles = document.querySelectorAll(".section-title") || null;
const sectionDescriptions = document.querySelectorAll(".section-description") || null;
const addSectionBtn = document.getElementById("add-section-btn") || null;
const deleteSectionBtns = document.querySelectorAll(".delete-section-btn") || null;

const newQuestionBtns = document.querySelectorAll(".new-question-btn") || null;
const deleteQuestionBtns = document.querySelectorAll(".delete-question-btn") || null;
const questionsModal = document.getElementById("questions__modal") || null;
const closeQuestionModalBtn = document.getElementById("add-question-close-btn") || null;
const createQuestionModal = document.getElementById("question-cta") || null;
const closeCreateQuestionModal = document.getElementById("close-new-question") || null;

const createOptionBtn = document.getElementById("add-option") || null;
const optionsContainer = document.getElementById("options-container") || null;


const updateFormDetails = () => {
    loadMiniLoader.showLoader();
    const title = formTitle.value;
    const description = formDescription.value;
    const body = {title, description}
    try {
        clearTimeout(timeout);
        timeout = setTimeout(async () => {
            await axios.patch(`/form/edit/${formId}`, body);
            loadMiniLoader.hideLoader();
        }, 800);
    } catch (error) {
        loadMiniLoader.hideLoader();
        console.log(error);
    }
}

const updateSectionDetails = (section, index)  => {
    loadMiniLoader.showLoader();
    const sectionid = section.parentElement.id;
    const title = allSections[index].children[0].value;
    const description = allSections[index].children[1].value;
    const body = {title, description}
    try {
        clearTimeout(timeout);
        timeout = setTimeout(async () => {
            await axios.patch(`/form/edit/section/${sectionid}/${formId}`, body);
            loadMiniLoader.hideLoader();
        }, 800);
    } catch (error) {
        loadMiniLoader.hideLoader();
        console.log(error);
    }
}

const createSection = async () => {
    try {
        const newSection = await axios.post(`/form/create/section/${formId}`);
        if(newSection.status === 200){
            formBody.append(sectionCard(newSection.data.Section, createQuestion));
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

const deleteSection = (e) => {
    loadMiniLoader.showLoader();
    const section = e.target.parentElement.parentElement;
    const sectionid = section.id;

    try {
        
        setTimeout(async () => {
            const deleteSection = await axios.delete(`/form/delete/section/${sectionid}/${formId}`);
            if(deleteSection.status === 200){
                const allSections = document.querySelectorAll(".form__section");
                    const  lastId = allSections[allSections.length - 1].id;
                    if(lastId === sectionid){
                        const addSectionBtn = document.getElementById("add-section-btn") || null;
                        addSectionBtn.style.display = "none";
                        addSectionBtn.remove();
                        allSections.forEach((sec, index) => {
                            sec.classList.remove("last-section");
                            if(index === allSections.length - 2){
                                sec.classList.add("last-section");
                                sec.append(addSectionBtn);
                                addSectionBtn.style.display = "block";
                            }
                        });
                    }
                section.style.display = "none";
                section.remove();
                loadMiniLoader.hideLoader();
            }
        }, 800)

    } catch (error) {
        loadMiniLoader.hideLoader();
        callMessageModal("modal-error", "Error", "Some error has Occured");
        console.log(error);
    }
}

const handleQuestionsModal = (method, container) => {
    if(method === "open"){
            questionsModal.classList.remove("slide-left")
            questionsModal.classList.add("slide-right")
            const questionsBtns = document.querySelectorAll(".questions__card") || null;
            questionsBtns.forEach((btn, index) => {
                let type = null;
                
                switch (index) {
                    case 0:
                        type = "text"
                        break;
                    case 1:
                        type = "descriptive"
                        break;
                    case 2:
                        type = "mcq"
                        break;
                    case 3:
                        type = "box"
                        break;
                    case 4: 
                        type = "image"
                        break;
                    default:
                        break;
                }
                btn.addEventListener("click", () => {
                    createQuestion(container, type);
                    questionsModal.classList.remove("slide-right")
                    questionsModal.classList.add("slide-left");
                    optionsContainer.innerHTML = "";
                })
            })
        } else {
            questionsModal.classList.remove("slide-right");
            questionsModal.classList.add("slide-left");
            loadLoader.hideLoader();
            createQuestionModal.style.display="none";
        }
}

const createQuestion = (container, type) => {
    createQuestionModal.style.display = "flex";
    const sectionid = container.id;
    const createQuestionBtn = document.getElementById("create-new-question") || null;
    const question_description = document.getElementById("qcta__description") || null;
    const is_required = document.getElementById("is_required");
    const typeDivs = Array.from(createQuestionModal.getElementsByTagName("div"));
    loadOverlay.addClick(createQuestionModal)

    const hideAll = () => {
        typeDivs.forEach((div) => {
            div.style.display = "none"
        })
    }

    const finishCreateQuestion = () => {
        questionsModal.classList.remove("slide-right");
        questionsModal.classList.add("slide-left");
        createQuestionModal.style.display = "none";
        optionsContainer.innerHTML = "";
        loadOverlay.hideOverlay();
    }

    hideAll();
    question_description.value = ""
    is_required.checked = false;
    question_description.focus();

    typeDivs.forEach((div) => {
        if(Array.from(div.classList).includes(type)){
            div.style.display = "flex";
        }
    });
    loadOverlay.showOverlay();
    if(type === "box" || type === "mcq"){
        createOptionBtn.addEventListener("click", () => createOption(type));
    }
    createQuestionBtn.addEventListener("click", async () => {
        loadMiniLoader.showLoader();
        if(question_description.value.length > 0){
            let body = {
                question_description: question_description.value,
                is_required: is_required.checked,
                type,
            }

            const optionValues = Array.from(document.querySelectorAll(".option__value-new")) || null;
            if(optionValues.length){
                const options = optionValues.map(option => option.value);
                console.log(JSON.stringify(options))
                body.options = options;
            } else {
                callMessageModal("modal-error", "Options Required", "Atleast one option is required for an mcq type.")
                return;
            }

            try {
                const newQuestion = await axios.post(`/form/create/question/${sectionid}/${formId}`, body);
                if(newQuestion.status === 200){
                    clearTimeout(timeout)
                    timeout = setTimeout( () => {
                        loadMiniLoader.hideLoader();
                        finishCreateQuestion();
                        return;
                    }, 800)
                } else throw new Error("Something went wrong")
            } catch (error) {
                callMessageModal("modal-error", "error", error.message)
                loadMiniLoader.hideLoader();
            }
        } else {
            loadMiniLoader.hideLoader();
            callMessageModal("modal-error", "Question Required", "A question description is requied!");
            question_description.value = "";
            question_description.focus();
        }
    })
}

const deleteQuestion = (questionCard) => {
    loadMiniLoader.showLoader();
    const questionid = questionCard.id;

    try {
        
        setTimeout(async () => {
            const deleteQuestion = await axios.delete(`/form/delete/question/${questionid}/${formId}`);
            if(deleteQuestion.status === 200){
                questionCard.style.display = "none";
                questionCard.remove();
                loadMiniLoader.hideLoader();
            }
        }, 800);

    } catch (error) {
        loadMiniLoader.hideLoader();
        callMessageModal("modal-error", "Error", "Some error has Occured");
        console.log(error);
    }
}

const createOption = (type) => {
    let optionType = null;
    if(type === "box"){
        optionType = "checkbox";
    } else {
        optionType = "radio";
    }
    optionsContainer.append(createNewOption(optionType))
}

const deleteOption = () => {

}


document.addEventListener("DOMContentLoaded", () => {
    formTitle.addEventListener("keyup", updateFormDetails);
    formDescription.addEventListener("keyup", updateFormDetails);
    
    addSectionBtn.addEventListener("click", createSection);
    sectionTitles.forEach((section, index) => {
        section.addEventListener("keyup", () => updateSectionDetails(section, index));
    });
    sectionDescriptions.forEach((section, index) => {
        section.addEventListener("keyup", () => updateSectionDetails(section, index));
    });
    deleteSectionBtns.forEach((deleteBtn) => {
        deleteBtn.addEventListener("click", (e) => deleteSection(e))
    });
    newQuestionBtns.forEach((newBtn, index) => {
        const container = newBtn.parentElement.parentElement;
        newBtn.addEventListener("click", () => {
            handleQuestionsModal("open", container);
        });
    });
    deleteQuestionBtns.forEach((deleteBtn) => {
        deleteBtn.addEventListener("click", () => {
            const questionCard = deleteBtn.parentElement.parentElement;
            deleteQuestion(questionCard);
        })
    })
    closeQuestionModalBtn.addEventListener("click", () => handleQuestionsModal());
    closeCreateQuestionModal.addEventListener("click", () => handleQuestionsModal());
})