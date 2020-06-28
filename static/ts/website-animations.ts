// this file is for CSS purpouses only 
// the name is a subject to change

var sideMenuButtons: Array<Element> = Array.from(document.getElementsByClassName("nav-wrapper"));
var sheetSections: Array<Element> = Array.from(document.getElementsByClassName("sheet-section"));
var displaySheetSections: Array<Element> = Array.from(document.getElementsByClassName("display-sheet-section"));
var editSheetSections: Array<Element> = Array.from(document.getElementsByClassName("edit-sheet-section"));
var previouslyClickedElement: number = 0;
initializeSideMenu()

// indexes 0-8 are for infomations about a character, 9-11 are for save, return and edit

function initializeSideMenu(): void {
    sideMenuButtons.forEach(element => {
        element.addEventListener("click", function() {changeSelectedInformations(element)}, false)
    });
    displaySheetSections.forEach(element => {
        element.setAttribute("style", "display: none");
    });
    
    sheetSections[0].setAttribute("style", "display: block");
    sideMenuButtons[0].setAttribute("style", "background: rgb(105, 105, 105)")
}

function changeSelectedInformations(element): void {
    let clickedElement: number = sideMenuButtons.indexOf(element);

    if (clickedElement < 9) {
        sideMenuButtons[previouslyClickedElement].setAttribute("style", "background: rgb(63, 63, 63)");
        sideMenuButtons[clickedElement].setAttribute("style", "background: rgb(105, 105, 105)");
        displaySheetSections[previouslyClickedElement].setAttribute("style", "display: none");
        displaySheetSections[clickedElement].setAttribute("style", "display: block");

        previouslyClickedElement = clickedElement;
    }

    // 9-11 are for save, return and edit not supported yet
}