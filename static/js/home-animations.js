initializeModals();
function initializeModals() {
    let loginModal = document.getElementById("login-modal");
    let registerModal = document.getElementById("register-modal");
    let loginBtn = document.getElementById("login-button");
    let registerBtn = document.getElementById("register-button");
    loginBtn.addEventListener('click', function () {
        loginModal.style.display = "block";
    });
    registerBtn.addEventListener('click', function () {
        registerModal.style.display = "block";
    });
    window.onclick = function (event) {
        if (event.target == loginModal) {
            loginModal.style.display = "none";
        }
        if (event.target == registerModal) {
            registerModal.style.display = "none";
        }
    };
}
