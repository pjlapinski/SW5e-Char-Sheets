// this file is for CSS purpouses only
// the name is a subject to change

let sideMenuButtons: Array<Element> = Array.from(
  document.getElementsByClassName('nav-wrapper')
)
let sheetSections: Array<Element> = Array.from(
  document.getElementsByClassName('sheet-section')
)
let displaySheetSections: Array<Element> = Array.from(
  document.getElementsByClassName('display-sheet-section')
)
let editSheetSections: Array<Element> = Array.from(
  document.getElementsByClassName('edit-sheet-section')
)
let previouslyClickedElement: number = 0
let isEditModeActive: Boolean = false
initializeSideMenu()
initializeAccordion()

// indexes 0-8 are for infomations about a character, 11-13 are for save, return and edit

function openMenu() {
  document.getElementById('menu-toggle').style.display = 'none'
  document.getElementById('sheet-side-menu').style.width = '45%'
}

export function closeMenu() {
  document.getElementById('menu-toggle').style.display = 'block'
  document.getElementById('sheet-side-menu').style.width = '0'
}

function initializeSideMenu(): void {
  let sideMenu = document.getElementsByClassName('side-menu')[0]
  let menuToggle = document.getElementById('menu-toggle')
  let closeMenuBtn = document.getElementById('sheet-close-btn')
  menuToggle.addEventListener('click', openMenu, false)
  closeMenuBtn.addEventListener('click', closeMenu, false)

  sideMenuButtons.forEach(element => {
    element.addEventListener(
      'click',
      function () {
        changeSelectedInformations(element)
      },
      false
    )
  })

  window.onmouseup = function (event) {
    if (
      !event.target.closest('.side-menu') &&
      document.getElementById('sheet-side-menu').offsetWidth > 0 &&
      !event.target.closest('.nav-wrapper')
    ) {
      closeMenu()
    }
  }

  disableSection(displaySheetSections)
  disableSection(editSheetSections)

  sheetSections[0].setAttribute('style', 'display: block')
  sideMenuButtons[0].setAttribute('style', 'background: rgb(105, 105, 105)')
}

function initializeAccordion(): void {
  let accordions = document.getElementsByClassName("skills-toggle");
  let i: number;

  for (i = 0; i < accordions.length; i++) {
    accordions[i].addEventListener("click", function() {
      this.classList.toggle("skills-toggle-active");
      var panel = this.nextElementSibling;
      if (panel.style.maxHeight) {
        panel.style.maxHeight = null;
      } else {
        panel.style.maxHeight = panel.scrollHeight + "%";
      } 
    });
  }
}

function disableSection(section: Array<Element>) {
  section.forEach(element => {
    element.setAttribute('style', 'display: none')
  })
}

function changeSelectedInformations(element): void {
  let clickedElement: number = sideMenuButtons.indexOf(element)

  if (clickedElement < 9) {
    if (isEditModeActive) {
      sideMenuButtons[previouslyClickedElement].setAttribute(
        'style',
        'background-color: #111'
      )
      sideMenuButtons[clickedElement].setAttribute(
        'style',
        'background: rgb(105, 105, 105)'
      )
      editSheetSections[previouslyClickedElement].setAttribute(
        'style',
        'display: none'
      )
      editSheetSections[clickedElement].setAttribute('style', 'display: block')

      if (clickedElement < 9) {
        previouslyClickedElement = clickedElement
      }
    } else {
      sideMenuButtons[previouslyClickedElement].setAttribute(
        'style',
        'background-color: #111'
      )
      sideMenuButtons[clickedElement].setAttribute(
        'style',
        'background: rgb(105, 105, 105)'
      )
      displaySheetSections[previouslyClickedElement].setAttribute(
        'style',
        'display: none'
      )
      displaySheetSections[clickedElement].setAttribute(
        'style',
        'display: block'
      )

      if (clickedElement < 9) {
        previouslyClickedElement = clickedElement
      }
    }
  }

  if (clickedElement == 13) {
    if (isEditModeActive) {
      disableSection(editSheetSections)
      sideMenuButtons[clickedElement].setAttribute(
        'style',
        'background-color: #111'
      )
      displaySheetSections[previouslyClickedElement].setAttribute(
        'style',
        'display: block'
      )
      isEditModeActive = false
    } else {
      isEditModeActive = true
      disableSection(displaySheetSections)
      editSheetSections[previouslyClickedElement].setAttribute(
        'style',
        'display: block'
      )
      sideMenuButtons[clickedElement].setAttribute(
        'style',
        'background: rgb(105, 105, 105)'
      )
    }
  }

  // 11-13 are for save, return (not supported yet) and edit
  // this function can be propably more generic
}
