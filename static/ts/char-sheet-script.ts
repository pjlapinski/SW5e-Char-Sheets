interface feature {
  name: string
  description: string
  usesLeft: number
  usesMax: number
  refresh: string
}

interface attack {
  name: string
  proficiency: boolean
  finesse: boolean
  dmgDiceAmount: number
  dmgDiceValue: number
  dmgType: number
  dmgBonus: number
  attkBonus: number
  notes: string
}

interface item {
  name: string
  amount: number
  notes: string
  usesLeft: number
  usesMax: number
}

interface power {
  name: string
  alignment: string
  casting: string
  range: string
  duration: string
  concentration: boolean
  description: string
}

interface sheet {
  name: string
  class: string
  archetype: string
  level: number
  background: string
  species: string
  alignment: string
  attributes: {
    strength: number
    dexterity: number
    constitution: number
    intelligence: number
    wisdom: number
    charisma: number
  }
  baseAc: number
  armorType: string
  shieldBonus: number
  proficiencies: string[]
  expertise: string[]
  bonuses: {
    [name: string]: number
  }
  deathSaves: {
    succeeded: number
    failed: number
  }
  hitDice: {
    type: number
    left: number
  }
  hitPoints: {
    current: number
    max: number
    temporary: number
  }
  features: feature[]
  attacks: attack[]
  languages: string[]
  speed: number
  personalityTraits: string
  ideal: string
  bond: string
  flaw: string
  notes: string
  credits: number
  equipment: item[]
  powerPointsUsed: number
  powerPointsMax: number
  powers: {
    level0: power[]
    level1: power[]
    level2: power[]
    level3: power[]
    level4: power[]
    level5: power[]
    level6: power[]
    level7: power[]
    level8: power[]
    level9: power[]
  }
}

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
}

function getAttributeModifier(attribute): number {
  return Math.floor((characterSheet.attributes[attribute] - 10) / 2)
}

function calculateAC(): number {
  let bonus = 0
  for (let _bonus in characterSheet.bonuses) {
    if (_bonus === 'armorClass') bonus = characterSheet.bonuses[_bonus]
  }
  if (characterSheet.armorType === 'heavy') {
    return characterSheet.baseAc + characterSheet.shieldBonus + bonus
  } else if (characterSheet.armorType === 'medium') {
    return (
      characterSheet.baseAc +
      characterSheet.shieldBonus +
      Math.min(2, getAttributeModifier('dexterity') + bonus)
    )
  } else {
    return (
      characterSheet.baseAc +
      characterSheet.shieldBonus +
      getAttributeModifier('dexterity') +
      bonus
    )
  }
}

updateHTML()
