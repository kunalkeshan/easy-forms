const profileDetailsToggle = document.querySelector(".profile__details") || null;
const profilePasswordToggle = document.querySelector(".profile__password") || null;

const profileDetailsActive = document.querySelector(".profile__details .profile__active") || null;
const profilePasswordActive = document.querySelector(".profile__password .profile__active") || null;

const profileDetailsForm = document.getElementById("profile__details-form") || null;
const profilePasswordForm = document.getElementById("profile__password-form") || null;

const hideAllForms = () => {
    profileDetailsForm.style.display = "none";
    profilePasswordForm.style.display = "none";
}

const addAnimation = (type) => {
    if(type === "rise") return "rise 500ms ease-in-out forwards";
    else if(type === "sink") return "sink 500ms ease-in-out forwards";
    else return "";
}

const showForm = (form) => {
    hideAllForms();
    if(form === "details"){
        profileDetailsForm.style.display = "block";
        profileDetailsActive.style.animation = addAnimation("rise");
        profilePasswordActive.style.animation = addAnimation("sink");
    }
    else {
        profilePasswordForm.style.display = "block";
        profileDetailsActive.style.animation = addAnimation("sink");
        profilePasswordActive.style.animation = addAnimation("rise");
    }
}

profileDetailsToggle.onclick = () => showForm("details");


profilePasswordToggle.onclick = () => showForm();

document.addEventListener("DOMContentLoaded", () => {
    showForm("details");
})

