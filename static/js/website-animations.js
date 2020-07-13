// this file is for CSS purpouses only
// the name is a subject to change
let sideMenuButtons = Array.from(document.getElementsByClassName('nav-wrapper'));
let sheetSections = Array.from(document.getElementsByClassName('sheet-section'));
let displaySheetSections = Array.from(document.getElementsByClassName('display-sheet-section'));
let editSheetSections = Array.from(document.getElementsByClassName('edit-sheet-section'));
let previouslyClickedElement = 0;
let isEditModeActive = false;
initializeSideMenu();
initializeAccordion();
// indexes 0-8 are for infomations about a character, 11-13 are for save, return and edit
function openMenu() {
    document.getElementById('menu-toggle').style.display = 'none';
    document.getElementById('sheet-side-menu').style.width = '45%';
}
export function closeMenu() {
    document.getElementById('menu-toggle').style.display = 'block';
    document.getElementById('sheet-side-menu').style.width = '0';
}
function initializeSideMenu() {
    let sideMenu = document.getElementsByClassName('side-menu')[0];
    let menuToggle = document.getElementById('menu-toggle');
    let closeMenuBtn = document.getElementById('sheet-close-btn');
    menuToggle.addEventListener('click', openMenu, false);
    closeMenuBtn.addEventListener('click', closeMenu, false);
    sideMenuButtons.forEach(element => {
        element.addEventListener('click', function () {
            changeSelectedInformations(element);
        }, false);
    });
    window.onmouseup = function (event) {
        if (!event.target.closest('.side-menu') &&
            document.getElementById('sheet-side-menu').offsetWidth > 0 &&
            !event.target.closest('.nav-wrapper')) {
            closeMenu();
        }
    };
    disableSection(displaySheetSections);
    disableSection(editSheetSections);
    sheetSections[0].setAttribute('style', 'display: block');
    sideMenuButtons[0].setAttribute('style', 'background: rgb(105, 105, 105)');
}
function initializeAccordion() {
    let accordions = document.getElementsByClassName('skills-toggle');
    let i;
    for (i = 0; i < accordions.length; i++) {
        accordions[i].addEventListener('click', function () {
            this.classList.toggle('skills-toggle-active');
            let panel = this.nextElementSibling;
            if (panel.style.maxHeight) {
                panel.style.maxHeight = null;
            }
            else {
                panel.style.maxHeight = panel.scrollHeight + 'vh';
            }
        });
    }
}
function disableSection(section) {
    section.forEach(element => {
        element.setAttribute('style', 'display: none');
    });
}
function changeSelectedInformations(element) {
    let clickedElement = sideMenuButtons.indexOf(element);
    if (clickedElement < 9) {
        if (isEditModeActive) {
            sideMenuButtons[previouslyClickedElement].setAttribute('style', 'background-color: #111');
            sideMenuButtons[clickedElement].setAttribute('style', 'background: rgb(105, 105, 105)');
            editSheetSections[previouslyClickedElement].setAttribute('style', 'display: none');
            editSheetSections[clickedElement].setAttribute('style', 'display: block');
            if (clickedElement < 9) {
                previouslyClickedElement = clickedElement;
            }
        }
        else {
            sideMenuButtons[previouslyClickedElement].setAttribute('style', 'background-color: #111');
            sideMenuButtons[clickedElement].setAttribute('style', 'background: rgb(105, 105, 105)');
            displaySheetSections[previouslyClickedElement].setAttribute('style', 'display: none');
            displaySheetSections[clickedElement].setAttribute('style', 'display: block');
            if (clickedElement < 9) {
                previouslyClickedElement = clickedElement;
            }
        }
    }
    if (clickedElement == 13) {
        if (isEditModeActive) {
            disableSection(editSheetSections);
            sideMenuButtons[clickedElement].setAttribute('style', 'background-color: #111');
            displaySheetSections[previouslyClickedElement].setAttribute('style', 'display: block');
            isEditModeActive = false;
        }
        else {
            isEditModeActive = true;
            disableSection(displaySheetSections);
            editSheetSections[previouslyClickedElement].setAttribute('style', 'display: block');
            sideMenuButtons[clickedElement].setAttribute('style', 'background: rgb(105, 105, 105)');
        }
    }
    closeMenu();
    // 11-13 are for save, return (not supported yet) and edit
    // this function can be propably more generic
}
