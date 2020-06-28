// this file is for CSS purpouses only 
// the name is a subject to change

var sideMenuButtons: Array<Element> = Array.from(document.getElementsByClassName("nav-wrapper"));
var sheetSections: Array<Element> = Array.from(document.getElementsByClassName("sheet-section"));
var displaySheetSections: Array<Element> = Array.from(document.getElementsByClassName("display-sheet-section"));
var editSheetSections: Array<Element> = Array.from(document.getElementsByClassName("edit-sheet-section"));
var clickedElement: number = 0;
initializeSideMenu()

// indexes 0-8 are for infomations about a character, 9-11 are for save, return and edit

function initializeSideMenu(): void {
    sideMenuButtons.forEach(element => {
        element.addEventListener("click", changeSelectedInformations, false)
    });
    sheetSections.forEach(element => {
        element.setAttribute("style", "display: block");
    });
    
    sheetSections[0].setAttribute("style", "display: block");
    sideMenuButtons[0].setAttribute("style", "background: rgb(105, 105, 105)")
}

function changeSelectedInformations(): void {
    // this returns an anonymous type, Element needed
    switch (sideMenuButtons.findIndex(this)) {
        case 0:
            console.log("0")
        case 1:
            console.log("1")
        default:
            console.log("def")
    }
}