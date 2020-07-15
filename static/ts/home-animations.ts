initializeModals()

function initializeModals(): void {
    let loginModal = document.getElementById("login-modal");
    let registerModal = document.getElementById("register-modal");
    
    let loginBtn = document.getElementById("login-button");
    let registerBtn = document.getElementById("register-button");

    let header = document.getElementsByClassName('header')[0]
    let footer = document.getElementsByClassName('footer')[0]
    let mainContent = document.getElementsByClassName('main-content-wrapper')[0]

    loginBtn.addEventListener('click', function() {
        loginModal.style.display = "block";
        enableBlur();
    })

    registerBtn.addEventListener('click', function() {
        registerModal.style.display = "block";
        enableBlur();
    })

    window.onclick = function(event) {
        if (event.target == loginModal) {
            loginModal.style.display = "none";
            disableBlur();
        }
        if (event.target == registerModal) {
            registerModal.style.display = "none";
            disableBlur();
        }
    }

    function enableBlur(): void {
        header.classList.add('blurred-element');
        footer.classList.add('blurred-element');
        mainContent.classList.add('blurred-element');
    }

    function disableBlur(): void {
        header.classList.remove('blurred-element');
        footer.classList.remove('blurred-element');
        mainContent.classList.remove('blurred-element');
    }
}