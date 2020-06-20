import { feature, attack, item, power, sheet } from 'char-sheet-interfaces'

// this is only done so that typescript has no problem with using a variable
// defined in a completly different place
var characterSheet: sheet

// html elements that are going to be changing
//
// #region basic info tab elements
const characterName: HTMLElement = document.getElementById('character-name')
const species: HTMLElement = document.getElementById('species')
const characterClass: HTMLElement = document.getElementById('class')
const archetype: HTMLElement = document.getElementById('archetype')
const level: HTMLElement = document.getElementById('level')
const background: HTMLElement = document.getElementById('background')
const alignment: HTMLElement = document.getElementById('alignment')
const speed: HTMLElement = document.getElementById('speed')
const armorClass: HTMLElement = document.getElementById('armor-class')
const personalityTraits: HTMLElement = document.getElementById(
  'personality-traits'
)
const ideal: HTMLElement = document.getElementById('ideal')
const bond: HTMLElement = document.getElementById('bond')
const flaw: HTMLElement = document.getElementById('flaw')

//#endregion
// #region hp tab elements
const currHp: HTMLElement = document.getElementById('curr-hp')
const maxHp: HTMLElement = document.getElementById('max-hp')
const tempHp: HTMLElement = document.getElementById('temp-hp')
const availableHitDice: HTMLInputElement = <HTMLInputElement>(
  document.getElementById('hit-dice-available-amount')
)
const hitDiceMax: HTMLElement = document.getElementById('hit-dice-max')
const hitDiceDie: HTMLElement = document.getElementById('hit-dice-die')
const deathSavesSucc: HTMLElement = document.getElementById(
  'death-saves__successes'
)
const deathSavesFail: HTMLElement = document.getElementById(
  'death-saves__failures'
)
// #endregion
// #region skills and attributes elements
const strengthMod: HTMLElement = document.getElementById('strength-mod')
const strengthScore: HTMLInputElement = <HTMLInputElement>(
  document.getElementById('strength-score')
)
const strengthSave: HTMLElement = document.getElementById('strength-save')
const dexterityMod: HTMLElement = document.getElementById('dexterity-mod')
const dexterityScore: HTMLInputElement = <HTMLInputElement>(
  document.getElementById('dexterity-score')
)
const dexteritySave: HTMLElement = document.getElementById('dexterity-save')
const constitutionMod: HTMLElement = document.getElementById('constitution-mod')
const constitutionScore: HTMLInputElement = <HTMLInputElement>(
  document.getElementById('constitution-score')
)
const constitutionSave: HTMLElement = document.getElementById(
  'constitution-save'
)
const intelligenceMod: HTMLElement = document.getElementById('intelligence-mod')
const intelligenceScore: HTMLInputElement = <HTMLInputElement>(
  document.getElementById('intelligence-score')
)
const intelligenceSave: HTMLElement = document.getElementById(
  'intelligence-save'
)
const wisdomMod: HTMLElement = document.getElementById('wisdom-mod')
const wisdomScore: HTMLInputElement = <HTMLInputElement>(
  document.getElementById('wisdom-score')
)
const wisdomSave: HTMLElement = document.getElementById('wisdom-save')
const charismaMod: HTMLElement = document.getElementById('charisma-mod')
const charismaScore: HTMLInputElement = <HTMLInputElement>(
  document.getElementById('charisma-score')
)
const charismaSave: HTMLElement = document.getElementById('charisma-save')
const skills: object = {
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
const passivePerception: HTMLElement = document.getElementById(
  'passive-perception-score'
)
// #endregion

function updateHTML(): void {
  // could all be moved to different functions and just called here
  // basic info elements
  characterName.innerText = characterSheet.name
  species.innerText = characterSheet.species
  characterClass.innerText = characterSheet.class
  archetype.innerText = characterSheet.archetype
  level.innerText = String(characterSheet.level)
  background.innerText = characterSheet.background
  alignment.innerText = characterSheet.alignment
  speed.innerText = String(characterSheet.speed)
  armorClass.innerText = String(calculateAC())
  personalityTraits.innerText = characterSheet.personalityTraits
  ideal.innerText = characterSheet.ideal
  bond.innerText = characterSheet.bond
  flaw.innerText = characterSheet.flaw
  // hp info elements
  currHp.innerText = String(characterSheet.hitPoints.current)
  maxHp.innerText = String(characterSheet.hitPoints.max)
  tempHp.innerText = String(characterSheet.hitPoints.temporary)
  availableHitDice.value = String(characterSheet.hitDice.left)
  hitDiceMax.innerText = String(characterSheet.level)
  hitDiceDie.innerText = String(characterSheet.hitDice.type)
  updateDeathSavesHTML()
  // attributes and skills elements
  strengthScore.value = String(characterSheet.attributes.strength)
  strengthMod.innerText = String(getAttributeModifier('strength'))
  dexterityScore.value = String(characterSheet.attributes.dexterity)
  dexterityMod.innerText = String(getAttributeModifier('dexterity'))
  constitutionScore.value = String(characterSheet.attributes.constitution)
  constitutionMod.innerText = String(getAttributeModifier('constitution'))
  intelligenceScore.value = String(characterSheet.attributes.intelligence)
  intelligenceMod.innerText = String(getAttributeModifier('intelligence'))
  wisdomScore.value = String(characterSheet.attributes.wisdom)
  wisdomMod.innerText = String(getAttributeModifier('wisdom'))
  charismaScore.value = String(characterSheet.attributes.charisma)
  charismaMod.innerText = String(getAttributeModifier('charisma'))
  for (let skill in skills) {
    let camelCase = stringToCamelCase(skill.replace(/-/g, ' '))
    let skillProficiencyHTML: HTMLInputElement = <HTMLInputElement>(
      document.getElementById(`${skill}-prof`)
    )
    let skillScoreHTML: HTMLElement = document.getElementById(`${skill}-score`)
    for (let prof of characterSheet.proficiencies) {
      if (stringToCamelCase(prof) === camelCase) {
        skillProficiencyHTML.checked = true
        break
      }
    }
    skillScoreHTML.innerText = String(getSkillMod(skill))
  }
  passivePerception.innerText = String(getPassiveSkill('perception'))
}

function updateDeathSavesHTML(): void {
  let successes = deathSavesSucc.children
  let failures = deathSavesFail.children

  for (let i = 0; i < 3; i++) {
    let succ = <HTMLInputElement>successes[i]
    let fail = <HTMLInputElement>failures[i]
    succ.checked = i < characterSheet.deathSaves.succeeded
    fail.checked = i < characterSheet.deathSaves.failed
  }
}

function getAttributeModifier(attribute): number {
  return Math.floor((characterSheet.attributes[attribute] - 10) / 2)
}

function calculateAC(): number {
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
 * skill variable needs to be given as in skills const
 */
function getSkillMod(skill: string): number {
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
 * skill variable needs to be given as in skills const
 */
function getPassiveSkill(skill: string): number {
  return 10 + getSkillMod(skill)
}

function getProficiencyBonus(level: number): number {
  if (level < 5) return 2
  else if (level < 9) return 3
  else if (level < 13) return 4
  else if (level < 17) return 5
  else return 6
}

function stringToCamelCase(str: string): string {
  return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function (match, index) {
    if (+match === 0) return ''
    return index === 0 ? match.toLowerCase() : match.toUpperCase()
  })
}

updateHTML()
