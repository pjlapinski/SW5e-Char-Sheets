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
