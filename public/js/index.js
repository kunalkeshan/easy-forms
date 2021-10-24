const signInForm = document.getElementById("index__signin") || null;
const signUpForm = document.getElementById("index__signup") || null;

const signUpLink = document.getElementById("signup") || null;
const signInLink = document.getElementById("signin") || null;

const track = document.querySelector(".carousel__track");
const slides = Array.from(track.children);
const nextButton = document.querySelector(".carousel__button--right");
const prevButton = document.querySelector(".carousel__button--left");
const dotsNav = document.querySelector(".carousel__nav");
const dots = Array.from(dotsNav.children);

const updateFormStyles = (singInFormStyle = "", signUpFormStyle = "") => {
    signInForm.style.display = singInFormStyle;
    signUpForm.style.display = signUpFormStyle;
}


//get width of the first slide
const slideWidth = slides[0].getBoundingClientRect().width;

//Arrange the slides next to one another
const setSlidePosition = (slide, index) => {
    slide.style.left = slideWidth * index + "px";
}
slides.forEach(setSlidePosition);

//When right button is clicked, next button, move to the next slide
//vice versa for left button

const moveToSlide = (track, currentSlide, targetSlide) => {
    track.style.transform = `translateX(-${targetSlide.style.left})`;
    currentSlide.classList.remove("currentSlide");
    targetSlide.classList.add("currentSlide");
}

nextButton.addEventListener("click", (e) => {
    const currentSlide = track.querySelector(".currentSlide");
    const nextSlide = currentSlide.nextElementSibling;
    const currentDot = dotsNav.querySelector(".current-slide");
    const nextDot = currentDot.nextElementSibling;
    const nextIndex = slides.findIndex(slide => slide === nextSlide);
    moveToSlide(track, currentSlide, nextSlide);
    updateDots(currentDot, nextDot);
    hideShowArrows(slides, prevButton, nextButton, nextIndex);

})

prevButton.addEventListener("click", (e) => {
    const currentSlide = track.querySelector(".currentSlide");
    const prevSlide = currentSlide.previousElementSibling;
    const currentDot = dotsNav.querySelector(".current-slide");
    const prevDot = currentDot.previousElementSibling;
    const prevIndex = slides.findIndex(slide => slide === prevSlide)
    moveToSlide(track, currentSlide, prevSlide);
    updateDots(currentDot, prevDot);
    hideShowArrows(slides, prevButton, nextButton, prevIndex);

})

//dots nav fuctionality

const updateDots = (currentDot, targetDot) => {
    currentDot.classList.remove("current-slide");
    targetDot.classList.add("current-slide");
}

const hideShowArrows = (slides, prevButton, nextButton, targetIndex) => {
    if(targetIndex === 0){
        prevButton.classList.add("is-hidden");
        nextButton.classList.remove("is-hidden")
    } else if(targetIndex === slides.length - 1) {
        prevButton.classList.remove("is-hidden");
        nextButton.classList.add("is-hidden");
    } else {
        prevButton.classList.remove("is-hidden");
        nextButton.classList.remove("is-hidden")
    }
}

dotsNav.addEventListener("click", (e) => {
    const targetDot = e.target.closest("button");
    if(!targetDot) return;
    const currentSlide = track.querySelector(".currentSlide");
    const currentDot = dotsNav.querySelector(".current-slide")

    const targetIndex = dots.findIndex(dot => dot === targetDot);
    const targetSlide = slides[targetIndex];

    moveToSlide(track, currentSlide, targetSlide);
    updateDots(currentDot, targetDot);
    hideShowArrows(slides, prevButton, nextButton, targetIndex);
})


if(signUpLink || signInLink) {
    signUpLink.onclick = () => updateFormStyles("none", "flex");
    signInLink.onclick = () => updateFormStyles("flex", "none");
}


if(signInForm){
    signInForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const user = document.getElementById("signin__user") || null;
        const password = document.getElementById("signin__password") || null;

        if(user || password){
            const body = {
                user: user.value,
                password: password.value,
                type: null
            }
            
            if(user.value === "") {
                alert("Username or Email cannot be empty");
                return;
            }
            if(password.value === ""){
                alert("Password Cannot be empty");
                return;
            }
            const checkEmail = user.value.includes("@");
            
            if(checkEmail) body.type = 0;
            else body.type = 1;

            try {
                
                const signin = await axios.post("/signin", body)
                console.log(signin)
                if(signin.status = 200){
                    window.location.replace("/home")
                }
                
            } catch (error) {
                console.log(error);
            }
        }

    })
}

if(signUpForm){
    const usernameInput = document.getElementById("signup__username");
    const emailInput = document.getElementById("signup__email");

    let body = {
        name: "", 
        username: "", 
        email: "", 
        password: "",  
        isSaved: false
    }

    signUpForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const name = document.getElementById("signup__name");
        const username = document.getElementById("signup__username");
        const email = document.getElementById("signup__email");
        const password = document.getElementById("signup__password");
        const confirmPassword = document.getElementById("confirm__password");
        
        body = {
            name: name.value, 
            username: username.value, 
            email: email.value, 
            password: password.value,  
            isSaved: true
        }

        if(password.value !== confirmPassword.value) {
            alert("Passwords do not match");
            return;
        }

        if(name.value === "" || username.value === "" || email.value === "" || password.value === ""){
            alert("Input fields cannot be empty");
            return;
        }

        try {
            const signup = await axios.post("/signup", body);
            if(signup.status === 201){
                alert(signup.data.message);
                window.location.replace("/home")
            }
        } catch (error) {
            console.log(error)
        }
    });
    let timeout = null
    usernameInput.addEventListener("keyup", () => {
        body.username = usernameInput.value;
        clearTimeout(timeout)
        timeout = setTimeout(async () => {
            try {
                const checkUsername = await axios.post("/signup", body);
                if(checkUsername.status === 200 && checkUsername.data.check.username){
                    alert(checkUsername.data.message);
                }
            } catch (error) {
                console.log(error)
            }
        }, 800);
    })
    emailInput.addEventListener("keyup", () => {
        body.email = emailInput.value;
        clearTimeout(timeout)
        timeout = setTimeout(async () => {
            try {
                const checkUsername = await axios.post("/signup", body);
                if(checkUsername.status === 200 && checkUsername.data.check.email){
                    alert(checkUsername.data.message);
                }
            } catch (error) {
                console.log(error)
            }
        }, 800);
    })


    
}


document.addEventListener("DOMContentLoaded", () => {
    updateFormStyles("flex", "none");
})