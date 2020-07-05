import { Sheet, Attack, Power } from 'char-sheet-interfaces'
import {
  updateDisplayHTML,
  fillPowersEditHTML,
  fillAttacksEditHTML,
} from './char-sheet-html-updates.js'

export const characterSheet: Sheet = JSON.parse(
  sessionStorage.getItem('characterSheet')
)

// #region variables
export const skills: object = {
  'strength-save': 'strength',
  'dexterity-save': 'dexterity',
  'constitution-save': 'constitution',
  'intelligence-save': 'intelligence',
  'wisdom-save': 'wisdom',
  'charisma-save': 'charisma',
  athletics: 'strength',
  acrobatics: 'dexterity',
  'sleight-of-hand': 'dexterity',
  stealth: 'dexterity',
  investigation: 'intelligence',
  lore: 'intelligence',
  nature: 'intelligence',
  piloting: 'intelligence',
  technology: 'intelligence',
  'animal-handling': 'wisdom',
  insight: 'wisdom',
  medicine: 'wisdom',
  perception: 'wisdom',
  survival: 'wisdom',
  deception: 'charisma',
  intimidation: 'charisma',
  performance: 'charisma',
  persuasion: 'charisma',
}
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
const editNotes: HTMLInputElement = <HTMLInputElement>(
  document.getElementById('notes-edit')
)
const editMaxPowerPoints: HTMLInputElement = <HTMLInputElement>(
  document.getElementById('max-power-points-edit')
)
const currentPowerPoints: HTMLInputElement = <HTMLInputElement>(
  document.getElementById('current-power-points')
)
const editPowersLists: Array<HTMLElement> = []
const addPowerAtLevelButtons: Array<HTMLInputElement> = []
for (let i = 0; i <= 9; i++) {
  let levelName = i == 0 ? 'at-will' : `level-${i}`
  editPowersLists.push(document.getElementById(`powers__${levelName}-edit`))
  addPowerAtLevelButtons.push(
    document.getElementById(`add-power__${levelName}`) as HTMLInputElement
  )
}
const attacksEditList: HTMLElement = document.getElementById('attacks-edit')
const addAttackBtn: HTMLInputElement = document.getElementById(
  'add-attack'
) as HTMLInputElement
// #endregion

// #region event listeners
export function addAllEventListeners(): void {
  addAttributeScoresEventListeners()
  addBonusesEventListeners()
  addProficienciesEventListeners()
  addExpertiseEventListeners()
  addNotesEventListeners()
  addPowersEventListeners()
  addPowerPointsEventListeners()
  addAttacksEventListeners()
}

function addAttributeScoresEventListeners(): void {
  for (let att of attributeScores) {
    att.addEventListener('change', () => {
      let name = att.id.split('-')[0]
      characterSheet.attributes[name] = Number(att.value)
      updateDisplayHTML()
    })
  }
}

function addBonusesEventListeners(): void {
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
}

function addProficienciesEventListeners(): void {
  for (let prof of proficiencyCheckboxes) {
    prof.addEventListener('change', () => {
      let input = <HTMLInputElement>prof
      let skillName = stringToCamelCase(
        prof.parentElement.id.replace(/-/g, ' ')
      )
      if (input.checked) characterSheet.proficiencies.push(skillName)
      else {
        let index = characterSheet.proficiencies.indexOf(skillName)
        characterSheet.proficiencies.splice(index, 1)
      }
      updateDisplayHTML()
    })
  }
}

function addExpertiseEventListeners(): void {
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
}
function addNotesEventListeners(): void {
  editNotes.addEventListener('change', () => {
    characterSheet.notes = editNotes.value
    updateDisplayHTML()
  })
}

function addPowerPointsEventListeners(): void {
  editMaxPowerPoints.addEventListener('change', () => {
    if (Number(editMaxPowerPoints.value) < 0) editMaxPowerPoints.value = '0'
    characterSheet.powerPointsMax = Number(editMaxPowerPoints.value)
    updateDisplayHTML()
  })
  currentPowerPoints.addEventListener('change', () => {
    if (Number(currentPowerPoints.value) < 0) currentPowerPoints.value = '0'
    characterSheet.powerPointsLeft = Number(currentPowerPoints.value)
  })
}

function addPowersEventListeners(): void {
  for (let i = 0; i <= 9; i++) {
    addPowerAtLevelButtons[i].addEventListener('click', () => {
      characterSheet.powers[`level${i}`].push({
        name: '',
        alignment: '',
        casting: '',
        range: '',
        duration: '',
        concentration: false,
        description: '',
      })
      updateDisplayHTML()
      fillPowersEditHTML()
      updateEditPowersListsEventListeners(i)
    })
    updateEditPowersListsEventListeners(i)
  }
}

function updateEditPowersListsEventListeners(level: number): void {
  let powers: Array<Element> = Array.from(
    editPowersLists[level].getElementsByClassName('power')
  )

  for (let index = 0; index < powers.length; index++) {
    let power = powers[index]
    let inputs: Array<HTMLInputElement> = Array.from(
      power.getElementsByTagName('input')
    )
    let fields = [
      'delete',
      'name',
      'alignment',
      'casting',
      'range',
      'duration',
      'concentration',
      'description',
    ]
    for (let i = 0; i < fields.length; i++) {
      if (i === 0) {
        inputs[i].addEventListener('click', () => {
          characterSheet.powers[`level${level}`].splice(index, 1)
          updateDisplayHTML()
          fillPowersEditHTML()
          updateEditPowersListsEventListeners(level)
        })
        continue
      }
      inputs[i].addEventListener('change', () => {
        if (inputs[i].type === 'text')
          characterSheet.powers[`level${level}`][index][fields[i]] =
            inputs[i].value
        else if (inputs[i].type === 'checkbox')
          characterSheet.powers[`level${level}`][index][fields[i]] =
            inputs[i].checked
        updateDisplayHTML()
        fillPowersEditHTML()
        updateEditPowersListsEventListeners(level)
      })
    }
  }
}

function addAttacksEventListeners(): void {
  addAttackBtn.addEventListener('click', () => {
    characterSheet.attacks.push({
      name: '',
      proficiency: false,
      finesse: false,
      ranged: false,
      dmgDiceAmount: 0,
      dmgDiceValue: 0,
      dmgType: '',
      dmgBonus: 0,
      atkBonus: 0,
      notes: '',
    })
    updateDisplayHTML()
    fillAttacksEditHTML()
    updateAttacksEventListeners()
  })
  updateAttacksEventListeners()
}

function updateAttacksEventListeners(): void {
  let attacks: HTMLCollection = attacksEditList.getElementsByTagName('li')

  for (let index = 0; index < attacks.length; index++) {
    let attack = attacks[index]

    let inputs: Array<HTMLInputElement> = Array.from(
      attack.getElementsByTagName('input')
    )
    let fields = [
      'delete',
      'name',
      'proficiency',
      'finesse',
      'ranged',
      'dmgDiceAmount',
      'dmgDiceValue',
      'dmgType',
      'dmgBonus',
      'atkBonus',
      'notes',
    ]
    for (let i = 0; i < fields.length; i++) {
      if (i === 0) {
        inputs[i].addEventListener('click', () => {
          characterSheet.attacks.splice(index, 1)
          updateDisplayHTML()
          fillAttacksEditHTML()
          updateAttacksEventListeners()
        })
        continue
      }
      inputs[i].addEventListener('change', () => {
        if (inputs[i].type === 'text')
          characterSheet.attacks[index][fields[i]] = inputs[i].value
        else if (inputs[i].type === 'checkbox')
          characterSheet.attacks[index][fields[i]] = inputs[i].checked
        else if (inputs[i].type === 'number')
          characterSheet.attacks[index][fields[i]] = Number(inputs[i].value)
        updateDisplayHTML()
        fillAttacksEditHTML()
        updateAttacksEventListeners()
      })
    }
  }
}

// #endregion

// #region 5e calculating functions
export function calculateAttackBonus(atk: Attack): number {
  let bonus = characterSheet.bonuses.attacks
  bonus += atk.proficiency ? getProficiencyBonus(characterSheet.level) : 0
  if (atk.ranged) bonus += getAttributeModifier('dexterity')
  else if (atk.finesse)
    bonus += Math.max(
      getAttributeModifier('strength'),
      getAttributeModifier('dexterity')
    )
  else bonus += getAttributeModifier('strength')
  bonus += atk.atkBonus
  return bonus
}

export function calculateAttackDamage(atk: Attack): string {
  let bonus = characterSheet.bonuses.damage
  if (atk.ranged) bonus += getAttributeModifier('dexterity')
  else if (atk.finesse)
    bonus += Math.max(
      getAttributeModifier('strength'),
      getAttributeModifier('dexterity')
    )
  else bonus += getAttributeModifier('strength')
  bonus += atk.dmgBonus
  // if lower than 0 it's empty, because bonus already has the '-' in it
  let sign: string = bonus >= 0 ? '+' : ''
  return `${atk.dmgDiceAmount}d${atk.dmgDiceValue}${sign}${bonus} ${atk.dmgType}`
}

export function getAttributeModifier(attribute: string): number {
  return Math.floor((characterSheet.attributes[attribute] - 10) / 2)
}

export function getPowerSaveDC(type: string): number {
  let dc = characterSheet.bonuses[`${type}SaveDC`]
  dc += getProficiencyBonus(characterSheet.level)
  if (type === 'tech') dc += getAttributeModifier('intelligence')
  else if (type === 'light') dc += getAttributeModifier('wisdom')
  else dc += getAttributeModifier('charisma')
  dc += 8
  return dc
}

export function getPowerAttackBonus(type: string): number {
  let bonus = characterSheet.bonuses[`${type}AttackBonus`]
  if (type === 'tech') bonus += getAttributeModifier('intelligence')
  else if (type === 'light') bonus += getAttributeModifier('wisdom')
  else bonus += getAttributeModifier('charisma')
  return bonus
}

export function calculateAC(): number {
  let base =
    characterSheet.baseAc +
    characterSheet.shieldBonus +
    characterSheet.bonuses.armorClass
  if (characterSheet.armorType === 'heavy') return base
  if (characterSheet.armorType === 'medium')
    return base + Math.min(2, getAttributeModifier('dexterity'))
  return base + getAttributeModifier('dexterity')
}

/**
 * skill variable formatted in a html naming convention, words separated by dashes
 */
export function getSkillMod(skill: string): number {
  let camelCase = stringToCamelCase(skill.replace(/-/g, ' '))
  let attr = skills[skill]
  let attrMod = getAttributeModifier(attr)
  let bonus = characterSheet.bonuses[camelCase]
  if (camelCase.includes('Save')) bonus += characterSheet.bonuses.savingThrows
  else bonus += characterSheet.bonuses.skills
  for (let proficiency of characterSheet.proficiencies) {
    if (stringToCamelCase(proficiency) === camelCase) {
      bonus += getProficiencyBonus(characterSheet.level)
      break
    }
  }
  for (let expertise of characterSheet.expertise) {
    if (stringToCamelCase(expertise) === camelCase) {
      bonus += getProficiencyBonus(characterSheet.level)
      break
    }
  }
  return attrMod + bonus
}

/**
 * skill variable formatted in a html naming convention, words separated by dashes
 */
export function getPassiveSkill(skill: string): number {
  return 10 + getSkillMod(skill)
}

export function getInitiativeBonus(): number {
  return getAttributeModifier('dexterity') + characterSheet.bonuses.initiative
}

export function getProficiencyBonus(level: number): number {
  if (level < 5) return 2
  else if (level < 9) return 3
  else if (level < 13) return 4
  else if (level < 17) return 5
  else return 6
}

export function stringCamelCaseToDashes(str: string): string {
  return str.replace(/[A-Z]/g, m => '-' + m.toLowerCase())
}

export function stringToCamelCase(str: string): string {
  return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function (match, index) {
    if (+match === 0) return ''
    return index === 0 ? match.toLowerCase() : match.toUpperCase()
  })
}
// #endregion
