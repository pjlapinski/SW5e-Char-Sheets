import { sheet } from 'char-sheet-interfaces'

var characterSheet: sheet
var updateDisplayHTML
var stringToCamelCase

// #region variables
const attributeNames: Array<String> = [
  'strength',
  'dexterity',
  'constitution',
  'intelligence',
  'wisdom',
  'charisma',
]
const attributeScores: Array<HTMLInputElement> = []
attributeNames.forEach(att =>
  attributeScores.push(
    <HTMLInputElement>document.getElementById(`${att}-score`)
  )
)
const bonusesFields: Array<HTMLInputElement> = Array.from(
  document.getElementById('bonuses-section').getElementsByTagName('input')
)
const proficiencyCheckboxes: HTMLCollection = document.getElementsByClassName(
  'proficiency-checkbox'
)
const expertiseCheckboxes: HTMLCollection = document.getElementsByClassName(
  'proficiency-checkbox__expertise'
)
// #endregion

// #region event listeners
for (let att of attributeScores) {
  att.addEventListener('change', () => {
    let name = att.id.split('-')[0]
    characterSheet.attributes[name] = Number(att.value)
    updateDisplayHTML()
  })
}

for (let bonus of bonusesFields) {
  bonus.addEventListener('change', () => {
    let nameParts = bonus.id.split('-')
    // removing the '-bonus-value' part
    nameParts.pop()
    nameParts.pop()
    let name: string = ''
    for (let part of nameParts) {
      if (nameParts.indexOf(part) !== 0)
        part = part.charAt(0).toUpperCase() + part.slice(1)
      name += part
    }

    characterSheet.bonuses[name] = Number(bonus.value)
    updateDisplayHTML()
  })
}

for (let prof of proficiencyCheckboxes) {
  prof.addEventListener('change', () => {
    let input = <HTMLInputElement>prof
    let skillName = stringToCamelCase(prof.parentElement.id.replace(/-/g, ' '))
    if (input.checked) characterSheet.proficiencies.push(skillName)
    else {
      let index = characterSheet.proficiencies.indexOf(skillName)
      characterSheet.proficiencies.splice(index, 1)
    }
    updateDisplayHTML()
  })
}

for (let expertise of expertiseCheckboxes) {
  expertise.addEventListener('change', () => {
    let input = <HTMLInputElement>expertise
    let skillName = stringToCamelCase(
      expertise.parentElement.id.replace(/-/g, ' ')
    )
    if (input.checked) characterSheet.expertise.push(skillName)
    else {
      let index = characterSheet.expertise.indexOf(skillName)
      characterSheet.expertise.splice(index, 1)
    }
    updateDisplayHTML()
  })
}
// #endregion
