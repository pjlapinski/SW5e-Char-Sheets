export interface Feature {
  name: string
  description: string
  usesLeft: number
  usesMax: number
  refresh: string
}

export interface Attack {
  name: string
  proficiency: boolean
  finesse: boolean
  ranged: boolean
  dmgDiceAmount: number
  dmgDiceValue: number
  dmgType: string
  dmgBonus: number
  atkBonus: number
  notes: string
}

export interface Item {
  name: string
  amount: number
  notes: string
  usesLeft: number
  usesMax: number
}

export interface Power {
  name: string
  alignment: string
  casting: string
  range: string
  duration: string
  concentration: boolean
  description: string
}

export interface Sheet {
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
    armorClass: number
    attacks: number
    damage: number
    savingThrows: number
    strengthSave: number
    dexteritySave: number
    constitutionSave: number
    intelligenceSave: number
    wisdomSave: number
    charismaSave: number
    skills: number
    passivePerception: number
    techSaveDC: number
    techAttackBonus: number
    darkSaveDC: number
    darkAttackBonus: number
    lightSaveDC: number
    lightAttackBonus: number
    athletics: number
    acrobatics: number
    sleightOfHand: number
    stealth: number
    investigation: number
    lore: number
    nature: number
    piloting: number
    technology: number
    animalHandling: number
    insight: number
    medicine: number
    perception: number
    survival: number
    deception: number
    intimidation: number
    performance: number
    persuasion: number
    initiative: number
    hitPointsPerLevel: number
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
  features: Feature[]
  attacks: Attack[]
  languages: string[]
  otherProficiencies: string[]
  speed: number
  personalityTraits: string
  ideal: string
  bond: string
  flaw: string
  notes: string
  credits: number
  equipment: Item[]
  powerPointsLeft: number
  powerPointsMax: number
  powers: {
    level0: Power[]
    level1: Power[]
    level2: Power[]
    level3: Power[]
    level4: Power[]
    level5: Power[]
    level6: Power[]
    level7: Power[]
    level8: Power[]
    level9: Power[]
  }
}
