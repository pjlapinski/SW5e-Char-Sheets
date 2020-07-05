export interface feature {
  name: string
  description: string
  usesLeft: number
  usesMax: number
  refresh: string
}

export interface attack {
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

export interface item {
  name: string
  amount: number
  notes: string
  usesLeft: number
  usesMax: number
}

export interface power {
  name: string
  alignment: string
  casting: string
  range: string
  duration: string
  concentration: boolean
  description: string
}

export interface sheet {
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
  otherProficiencies: string[]
  speed: number
  personalityTraits: string
  ideal: string
  bond: string
  flaw: string
  notes: string
  credits: number
  equipment: item[]
  powerPointsLeft: number
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
