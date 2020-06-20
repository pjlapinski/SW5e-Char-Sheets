import { feature, attack, item, power, sheet } from 'char-sheet-interfaces'

// this is only done so that typescript has no problem with using a variable
// defined in a completly different place
var characterSheet: sheet

// html elements that are going to be changing
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

function updateHTML(): void {
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
  currHp.innerText = String(characterSheet.hitPoints.current)
  maxHp.innerText = String(characterSheet.hitPoints.max)
  tempHp.innerText = String(characterSheet.hitPoints.temporary)
  availableHitDice.value = String(characterSheet.hitDice.left)
  hitDiceMax.innerText = String(characterSheet.level)
  hitDiceDie.innerText = String(characterSheet.hitDice.type)
  updateDeathSavesHTML()
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

updateHTML()
