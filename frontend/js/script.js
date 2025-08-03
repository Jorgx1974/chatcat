// Login elements
const login = document.querySelector(".login");
const loginForm = login.querySelector(".login__form");
const loginInput = login.querySelector(".login__input");

// Register elements
const registerForm = document.getElementById("registerForm");
const profilePictureInput = document.getElementById("profile-picture");
const profilePicturePreview = document.getElementById("profile-picture-preview");
const registerButton = document.getElementById("registerButton");
const termsCheckbox = document.getElementById("termsCheckbox");

// Miscellaneous elements
const showRegisterButton = document.getElementById("showRegister");
const showLoginButton = document.getElementById("showLogin");
const loginSection = document.getElementById("login-section");
const registerSection = document.getElementById("register-section");
const termsLink = document.getElementById("termsLink");
const termsSection = document.getElementById("terms-section");
const backToRegisterButton = document.getElementById("backToRegister");
const errorSection = document.getElementById("error-section");
const themeToggleButtons = document.querySelectorAll("#toggle-theme");

// Store registered users
const users = {};
let user = { id: "", name: "", color: "", profilePicture: "" };

// Change theme
themeToggleButtons.forEach(button => {
    button.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
        themeToggleButtons.forEach(btn => {
            btn.textContent = document.body.classList.contains("dark-mode") ? "☀️" : "🌙";
        });
    });
});

// Register logic
registerForm.addEventListener("submit", (event) => {
    event.preventDefault();
    
    const username = registerForm.querySelector(".register__input_name").value;
    const email = registerForm.querySelector(".register__input_email").value;
    const password = registerForm.querySelector(".register__input").value;
    const dob = new Date(registerForm.querySelector("#dob").value);
    const age = calculateAge(dob);

    if (age < 15) {
        registerSection.style.display = "none";
        errorSection.style.display = "block";
    } else {
        const profilePictureFile = profilePictureInput.files[0];
        let profilePictureUrl = "";

        if (profilePictureFile) {
            // Convert image file to a data URL
            const reader = new FileReader();
            reader.onload = function (e) {
                profilePictureUrl = e.target.result;
                saveUser(username, email, password, dob, profilePictureUrl);
            };
            reader.readAsDataURL(profilePictureFile);
        } else {
            saveUser(username, email, password, dob, profilePictureUrl);
        }
    }
});

function saveUser(username, email, password, dob, profilePictureUrl) {
    users[username] = { email, password, dob, profilePictureUrl };
    localStorage.setItem("userName", username);
    localStorage.setItem("userEmail", email);
    localStorage.setItem("userProfilePicture", profilePictureUrl);

    alert("Registro bem-sucedido! Faça login.");
    registerSection.style.display = "none";
    window.location.href = "chat.html";
}
profilePictureInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            profilePicturePreview.src = e.target.result;
            profilePicturePreview.style.display = "block"; // Mostra a imagem de pré-visualização
        };
        reader.readAsDataURL(file);
    }
});
// Calculate age
function calculateAge(birthDate) {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

document.getElementById("home-button").addEventListener("click", function() {
    window.location.href = "pagin.html";
});

// Login logic
loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const username = loginForm.querySelector(".login__input_name").value;
    const password = loginForm.querySelector(".login__input_password").value;

    if (users[username] && users[username].password === password) {
        user = { ...users[username], name: username };
        localStorage.setItem("userProfilePicture", users[username].profilePictureUrl);
        window.location.href = "chat.html";
    } else {
        alert("Nome de usuário ou senha inválidos.");
    }
});

// Show register section
showRegisterButton.addEventListener("click", () => {
    loginSection.style.display = "none";
    registerSection.style.display = "block";
});

// Show login section
showLoginButton.addEventListener("click", () => {
    registerSection.style.display = "none";
    loginSection.style.display = "block";
});

// Show terms of service
termsLink.addEventListener("click", (event) => {
    event.preventDefault();
    registerSection.style.display = "none";
    termsSection.style.display = "block";
});

// Go back to register
backToRegisterButton.addEventListener("click", () => {
    termsSection.style.display = "none";
    registerSection.style.display = "block";
});

// Enable register button based on terms checkbox
termsCheckbox.addEventListener("change", () => {
    registerButton.disabled = !termsCheckbox.checked;
});

// Random color for users
const getRandomColor = () => {
    const colors = [
        "cadetblue",
        "darkgoldenrod",
        "cornflowerblue",
        "darkkhaki",
        "hotpink",
        "gold",
        "green",
        "red"
    ];
    return colors[Math.floor(Math.random() * colors.length)];
};
