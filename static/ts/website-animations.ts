// this file is for CSS purpouses only 
// the name is a subject to change

let sideMenuButtons: Array<Element> = Array.from(document.getElementsByClassName("nav-wrapper"));
let sheetSections: Array<Element> = Array.from(document.getElementsByClassName("sheet-section"));
let displaySheetSections: Array<Element> = Array.from(document.getElementsByClassName("display-sheet-section"));
let editSheetSections: Array<Element> = Array.from(document.getElementsByClassName("edit-sheet-section"));
let previouslyClickedElement: number = 0;
let isEditModeActive: Boolean = false;
initializeSideMenu()

// indexes 0-8 are for infomations about a character, 9-11 are for save, return and edit

function initializeSideMenu(): void {
    sideMenuButtons.forEach(element => {
        element.addEventListener("click", function() {changeSelectedInformations(element)}, false)
    });
    disableSection(displaySheetSections);
    disableSection(editSheetSections);
    
    sheetSections[0].setAttribute("style", "display: block");
    sideMenuButtons[0].setAttribute("style", "background: rgb(105, 105, 105)")
}

function disableSection(section: Array<Element>) {
    section.forEach(element => {
        element.setAttribute("style", "display: none");
    });
}

function changeSelectedInformations(element): void {
    let clickedElement: number = sideMenuButtons.indexOf(element);

    if (clickedElement < 9) {
        if (isEditModeActive) {
            //FIXME the skills section is creating some troubles to disable and enable it
            sideMenuButtons[previouslyClickedElement].setAttribute("style", "background: rgb(63, 63, 63)");
            sideMenuButtons[clickedElement].setAttribute("style", "background: rgb(105, 105, 105)");
            
            if (clickedElement == 2) {
                editSheetSections[previouslyClickedElement].setAttribute("style", "display: none");
                displaySheetSections[clickedElement].setAttribute("style", "display: block");
            } else if (clickedElement < 2) {
                editSheetSections[previouslyClickedElement].setAttribute("style", "display: none");
                editSheetSections[clickedElement].setAttribute("style", "display: block");
            } else if(clickedElement > 2) {
                editSheetSections[previouslyClickedElement + 1].setAttribute("style", "display: none");
                editSheetSections[clickedElement + 1].setAttribute("style", "display: block");
            }

            if (clickedElement < 9) {
                previouslyClickedElement = clickedElement;
            }
        } else {
            sideMenuButtons[previouslyClickedElement].setAttribute("style", "background: rgb(63, 63, 63)");
            sideMenuButtons[clickedElement].setAttribute("style", "background: rgb(105, 105, 105)");
            displaySheetSections[previouslyClickedElement].setAttribute("style", "display: none");
            displaySheetSections[clickedElement].setAttribute("style", "display: block");

            if (clickedElement < 9) {
                previouslyClickedElement = clickedElement;
            }
        }
    }

    if (clickedElement == 11) {
        if (isEditModeActive) {
            disableSection(editSheetSections);
            sideMenuButtons[8].setAttribute("style", "display: block");
            sideMenuButtons[clickedElement].setAttribute("style", "background: rgb(63, 63, 63)");
            isEditModeActive = false;
        } else {
            isEditModeActive = true;
            disableSection(displaySheetSections);
            sideMenuButtons[clickedElement].setAttribute("style", "background: rgb(105, 105, 105)");
            sideMenuButtons[8].setAttribute("style", "display: none");
        }
    }

    // 9-11 are for save, return (not supported yet) and edit 
    // this function can be propably more generic
}