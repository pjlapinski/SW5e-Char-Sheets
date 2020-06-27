// this file is for CSS purpouses only 
// the name is a subject to change

var sideMenuButtons: Array<Element> = Array.from(document.getElementsByClassName("nav-wrapper"));
var sheetSections: Array<Element> = Array.from(document.getElementsByClassName("sheet-section"));
initializeSideMenu()

// indexes 0-7 are for infomations about a character, 8,9 are for save and return

function initializeSideMenu(): void {
    sideMenuButtons.forEach(element => {
        element.addEventListener("click", changeSelectedInformations, false)
    });
    sheetSections.forEach(element => {
        element.setAttribute("style", "display: block");
    });
    
    sheetSections[0].setAttribute("style", "display: block");
}

function changeSelectedInformations(): void {
    console.log("test")
}