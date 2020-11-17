let loginModal = document.getElementById('login-modal');
let registerModal = document.getElementById('register-modal');
let loginBtn = document.getElementById('login-button');
let registerBtn = document.getElementById('register-button');
let loginCloseBtn = document.getElementById('login-close-btn');
let registerCloseBtn = document.getElementById('register-close-btn');
let header = document.getElementsByClassName('header')[0];
let footer = document.getElementsByClassName('footer')[0];
let mainContent = document.getElementsByClassName('main-content-wrapper')[0];
initializeModals();
function initializeModals() {
    loginBtn.addEventListener('click', function () {
        loginModal.style.display = 'block';
        enableBlur();
    });
    registerBtn.addEventListener('click', function () {
        registerModal.style.display = 'block';
        enableBlur();
    });
    window.onclick = function (event) {
        if (event.target == loginModal || event.target == loginCloseBtn) {
            loginModal.style.display = 'none';
            disableBlur();
        }
        if (event.target == registerModal || event.target == registerCloseBtn) {
            registerModal.style.display = 'none';
            disableBlur();
        }
    };
}
export function enableBlur() {
    header.classList.add('blurred-element');
    footer.classList.add('blurred-element');
    mainContent.classList.add('blurred-element');
}
function disableBlur() {
    header.classList.remove('blurred-element');
    footer.classList.remove('blurred-element');
    mainContent.classList.remove('blurred-element');
}
