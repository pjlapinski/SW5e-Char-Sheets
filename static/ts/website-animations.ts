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

let buttonTabs: Array<Element> = Array.from(
  document.getElementsByClassName('tabs-button')
)

let powersTabs: Array<Element> = Array.from(
  document.getElementsByClassName('powers-header__element')
)

let previouslyClickedElement: number = 0
let isEditModeActive: Boolean = false

initializeAccordion()
initializeSideMenu()
initializePowersTabs()

// indexes 0-8 are for infomations about a character, 11-13 are for save, return and edit

function openMenu() {
  if (window.outerWidth > 600) {
    document.getElementById('menu-toggle').style.display = 'none'
    document.getElementById('sheet-side-menu').style.width = '250px'
  } else {
    document.getElementById('menu-toggle').style.display = 'none'
    document.getElementById('sheet-side-menu').style.width = '45%'
  }
}

export function closeMenu() {
  if (window.outerWidth < 600) {
    document.getElementById('menu-toggle').style.display = 'block'
    document.getElementById('sheet-side-menu').style.width = '0'
  }
}

function initializeSideMenu(): void {
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
      !event.target.closest('.nav-wrapper') &&
      window.outerWidth < 600
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
  let accordions = document.getElementsByClassName('skills-toggle')

  for (let i = 0; i < accordions.length; i++) {
    accordions[i].addEventListener('click', () => {
      accordions[i].classList.toggle('skills-toggle-active')
      let panel = accordions[i].nextElementSibling as HTMLElement
      if (panel.style.maxHeight) {
        panel.style.maxHeight = null
      } else {
        panel.style.maxHeight = panel.scrollHeight + 'vh'
      }
    })

    let toggle = accordions[i] as HTMLElement
    toggle.click()
    // let panelAfterToggle = toggle.nextElementSibling as HTMLElement
    // panelAfterToggle.style.maxHeight = panelAfterToggle.scrollHeight + 'vh'
    // toggle.classList.toggle('skills-toggle-active')
  }
}

function initializePowersTabs(): void {
  let tabsBtns = document.getElementsByClassName('tabs-button')
  let tabs = document.getElementsByClassName('powers-header__element')

  let tabsHtml: Array<HTMLElement> = []
  for (let tab of tabs) {
    tabsHtml.push(tab as HTMLElement)
  }

  for (let i = 0; i < tabsBtns.length; i++) {
    tabsBtns[i].addEventListener('click', function () {
      //TODO: this can be animated using maxHeight property

      let panel: HTMLElement = tabsHtml[i]
      if (panel.style.display == 'none' || panel.style.display == '') {
        for (let j = 0; j < tabsHtml.length; j++) {
          let p = tabsHtml[j]
          if (p != panel) {
            p.style.display = 'none'
            tabsBtns[j].classList.remove('tabs-button-active')
          }
        }
        panel.style.display = 'block'
        this.classList.add('tabs-button-active')
        panel.classList.add('powers-header-active')
      } else {
        panel.style.display = 'none'
        this.classList.remove('tabs-button-active')
        panel.classList.remove('powers-header-active')
      }
    })
  }
}

function disableSection(section: Array<Element>) {
  section.forEach(element => {
    element.setAttribute('style', 'display: none')
  })
}

function changeSelectedTab(buttonTab): void {
  let clickedElement: number = buttonTab.indexOf(buttonTab)
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
  closeMenu()

  // 11-13 are for save, return (not supported yet) and edit
  // this function can be propably more generic
}
