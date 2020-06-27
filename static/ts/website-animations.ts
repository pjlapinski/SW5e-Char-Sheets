// this file is for CSS purpouses only 
// the name is a subject to change

let toggleable = document.getElementsByClassName("sheet-section");
initializeSideMenu()

function initializeSideMenu() {
    Array.from(toggleable).forEach(element => {
        element.addEventListener("click", testFunction, false)
    });
}

function testFunction() {
    console.log("test")
}
