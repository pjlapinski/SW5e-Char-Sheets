import { Sheet, Attack, Power } from 'char-sheet-interfaces'
import {
  updateDisplayHTML,
  fillPowersEditHTML,
  fillAttacksEditHTML,
  fillEquipmentEditHTML,
  fillFeaturesEditHTML,
  fillHPInfoEditHTML,
  fillBasicInfoEditHTML,
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
const bonusesDivs: HTMLCollection = document.getElementsByClassName(
  'bonus-wrapper'
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
const creditsEdit: HTMLInputElement = document.getElementById(
  'credits'
) as HTMLInputElement
const equipmentEditList: HTMLElement = document.getElementById('equipment-edit')
const equipmentDisplayList: HTMLElement = document.getElementById('equipment')
const addItemBtn: HTMLInputElement = document.getElementById(
  'add-equipment'
) as HTMLInputElement
const otherProficienciesEditList: HTMLElement = document.getElementById(
  'proficiencies-edit'
)
const addOtherProficiencyBtn: HTMLInputElement = document.getElementById(
  'add-other-proficiency'
) as HTMLInputElement
const languagesEditList: HTMLElement = document.getElementById('languages-edit')
const addLanguageBtn: HTMLInputElement = document.getElementById(
  'add-language'
) as HTMLInputElement
const featuresEditList: HTMLElement = document.getElementById(
  'features-and-traits-edit'
)
const featuresDisplayList: HTMLElement = document.getElementById(
  'features-and-traits'
)
const addFeatureBtn: HTMLInputElement = document.getElementById(
  'add-feature'
) as HTMLInputElement
const maxHitPointsEdit: HTMLInputElement = document.getElementById(
  'max-hp-edit'
) as HTMLInputElement
const hitDiceDieEdit: HTMLInputElement = document.getElementById(
  'hit-dice-die-edit'
) as HTMLInputElement
const healOrDamageAmount: HTMLInputElement = document.getElementById(
  'heal-or-damage-amount'
) as HTMLInputElement
const healOrDamageChoice: HTMLSelectElement = document.getElementById(
  'heal-or-damage-choice'
) as HTMLSelectElement
const submitHealOrDamage: HTMLInputElement = document.getElementById(
  'submit-heal-or-damage'
) as HTMLInputElement
const hitDiceAvailable: HTMLInputElement = document.getElementById(
  'hit-dice-available-amount'
) as HTMLInputElement
const deathSaveSuccesses: HTMLElement = document.getElementById(
  'death-saves__successes'
)
const deathSaveFailures: HTMLElement = document.getElementById(
  'death-saves__failures'
)
const charNameEdit: HTMLInputElement = document.getElementById(
  'character-name-edit'
) as HTMLInputElement
const speciesEdit: HTMLInputElement = document.getElementById(
  'species-edit'
) as HTMLInputElement
const classEdit: HTMLInputElement = document.getElementById(
  'class-edit'
) as HTMLInputElement
const archetypeEdit: HTMLInputElement = document.getElementById(
  'archetype-edit'
) as HTMLInputElement
const levelEdit: HTMLInputElement = document.getElementById(
  'level-edit'
) as HTMLInputElement
const backgroundEdit: HTMLInputElement = document.getElementById(
  'background-edit'
) as HTMLInputElement
const alignmentEdit: HTMLInputElement = document.getElementById(
  'alignment-edit'
) as HTMLInputElement
const speedEdit: HTMLInputElement = document.getElementById(
  'speed-edit'
) as HTMLInputElement
const armorClassEdit: HTMLInputElement = document.getElementById(
  'armor-class-edit'
) as HTMLInputElement
const armorType: HTMLSelectElement = document.getElementById(
  'equipped-armor-type'
) as HTMLSelectElement
const personalityTraitsEdit: HTMLInputElement = document.getElementById(
  'personality-traits-edit'
) as HTMLInputElement
const idealEdit: HTMLInputElement = document.getElementById(
  'ideal-edit'
) as HTMLInputElement
const bondEdit: HTMLInputElement = document.getElementById(
  'bond-edit'
) as HTMLInputElement
const flawEdit: HTMLInputElement = document.getElementById(
  'flaw-edit'
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
  addEquipmentEventListeners()
  addFeaturesEventListeners()
  addHPInfoEventListeners()
  addBasicInfoEventListeners()
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
  for (let bonus of bonusesDivs) {
    let input = bonus.getElementsByTagName('input')[0]
    input.addEventListener('change', () => {
      let nameParts = input.id.split('-')
      // removing the '-bonus-value' part
      nameParts.pop()
      nameParts.pop()
      let name: string = ''
      for (let part of nameParts) {
        if (nameParts.indexOf(part) !== 0)
          part = part.charAt(0).toUpperCase() + part.slice(1)
        name += part
      }

      characterSheet.bonuses[name] = Number(input.value)
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

function addEquipmentEventListeners(): void {
  addItemBtn.addEventListener('click', () => {
    characterSheet.equipment.push({
      name: '',
      amount: 1,
      notes: '',
      usesLeft: 0,
      usesMax: 0,
    })
    updateDisplayHTML()
    fillEquipmentEditHTML()
    updateEquipmentEventListeners()
  })

  creditsEdit.addEventListener('change', () => {
    characterSheet.credits = Number(creditsEdit.value)
    updateDisplayHTML()
  })

  updateEquipmentEventListeners()
}

function updateEquipmentEventListeners(): void {
  let items = equipmentEditList.getElementsByClassName('equipment__item')
  let displayItems = equipmentDisplayList.getElementsByClassName(
    'equipment__item'
  )

  for (let index = 0; index < items.length; index++) {
    let item = items[index]
    let itemDisplay = displayItems[index]

    let inputs: Array<HTMLInputElement> = Array.from(
      item.getElementsByTagName('input')
    )
    let displayInput = itemDisplay.getElementsByTagName('input')
    if (displayInput.length > 0) {
      displayInput[0].addEventListener('change', () => {
        if (Number(displayInput[0].value) < 0) displayInput[0].value = '0'
        characterSheet.equipment[index].usesLeft = Number(displayInput[0].value)
        updateDisplayHTML()
        fillEquipmentEditHTML()
        updateEquipmentEventListeners()
      })
    }

    let fields = ['delete', 'amount', 'name', 'usesLeft', 'usesMax', 'notes']
    for (let i = 0; i < fields.length; i++) {
      if (i === 0) {
        inputs[i].addEventListener('click', () => {
          characterSheet.equipment.splice(index, 1)
          updateDisplayHTML()
          fillEquipmentEditHTML()
          updateEquipmentEventListeners()
        })
        continue
      }
      inputs[i].addEventListener('change', () => {
        if (inputs[i].type === 'text')
          characterSheet.equipment[index][fields[i]] = inputs[i].value
        else if (inputs[i].type === 'number') {
          let min = i === 1 ? 1 : 0
          if (Number(inputs[i].value) < min) inputs[i].value = String(min)
          characterSheet.equipment[index][fields[i]] = Number(inputs[i].value)
        }
        updateDisplayHTML()
        fillEquipmentEditHTML()
        updateEquipmentEventListeners()
      })
    }
  }
}

function addFeaturesEventListeners(): void {
  addOtherProficiencyBtn.addEventListener('click', () => {
    characterSheet.otherProficiencies.push('')
    updateDisplayHTML()
    fillFeaturesEditHTML()
    updateOtherProficienciesEventListeners()
  })

  addLanguageBtn.addEventListener('click', () => {
    characterSheet.languages.push('')
    updateDisplayHTML()
    fillFeaturesEditHTML()
    updateLanguagesEventListeners()
  })

  addFeatureBtn.addEventListener('click', () => {
    characterSheet.features.push({
      name: '',
      description: '',
      usesLeft: 0,
      usesMax: 0,
      refresh: 'none',
    })
    updateDisplayHTML()
    fillFeaturesEditHTML()
    updateFeaturesEventListeners()
  })

  updateOtherProficienciesEventListeners()
  updateLanguagesEventListeners()
  updateFeaturesEventListeners()
}

function updateOtherProficienciesEventListeners(): void {
  let profs = otherProficienciesEditList.getElementsByTagName('li')

  for (let index = 0; index < profs.length; index++) {
    let prof = profs[index]
    let inputs = prof.getElementsByTagName('input')

    inputs[0].addEventListener('click', () => {
      characterSheet.otherProficiencies.splice(index, 1)
      updateDisplayHTML()
      fillFeaturesEditHTML()
      updateOtherProficienciesEventListeners()
    })

    inputs[1].addEventListener('change', () => {
      characterSheet.otherProficiencies[index] = inputs[1].value
      updateDisplayHTML()
      fillFeaturesEditHTML()
      updateOtherProficienciesEventListeners()
    })
  }
}

function updateLanguagesEventListeners(): void {
  let langs = languagesEditList.getElementsByTagName('li')

  for (let index = 0; index < langs.length; index++) {
    let lang = langs[index]
    let inputs = lang.getElementsByTagName('input')

    inputs[0].addEventListener('click', () => {
      characterSheet.languages.splice(index, 1)
      updateDisplayHTML()
      fillFeaturesEditHTML()
      updateLanguagesEventListeners()
    })

    inputs[1].addEventListener('change', () => {
      characterSheet.languages[index] = inputs[1].value
      updateDisplayHTML()
      fillFeaturesEditHTML()
      updateLanguagesEventListeners()
    })
  }
}

function updateFeaturesEventListeners(): void {
  let features: HTMLCollection = featuresEditList.getElementsByTagName('li')
  let displayFeatures: HTMLCollection = featuresDisplayList.getElementsByTagName(
    'li'
  )

  for (let index = 0; index < features.length; index++) {
    let feature = features[index]
    let featureDisplay = displayFeatures[index]

    let inputs: Array<HTMLInputElement> = Array.from(
      feature.getElementsByTagName('input')
    )
    let displayInput = featureDisplay.getElementsByTagName('input')
    if (displayInput.length > 0) {
      displayInput[0].addEventListener('change', () => {
        let value = Number(displayInput[0].value)
        let max = characterSheet.features[index].usesMax
        value = value > 0 ? value : 0
        value = value <= max ? value : max
        characterSheet.features[index].usesLeft = value
        updateDisplayHTML()
        fillFeaturesEditHTML()
        updateFeaturesEventListeners()
      })
    }

    let select: HTMLSelectElement = feature.getElementsByTagName('select')[0]
    let fields = ['delete', 'name', 'usesMax', 'description']

    for (let i = 0; i < fields.length; i++) {
      if (i === 0) {
        inputs[i].addEventListener('click', () => {
          characterSheet.features.splice(index, 1)
          updateDisplayHTML()
          fillFeaturesEditHTML()
          updateFeaturesEventListeners()
        })
        continue
      }
      inputs[i].addEventListener('change', () => {
        if (inputs[i].type === 'text')
          characterSheet.features[index][fields[i]] = inputs[i].value
        else if (inputs[i].type === 'number') {
          if (Number(inputs[i].value) < 0) inputs[i].value = '0'
          characterSheet.features[index][fields[i]] = Number(inputs[i].value)
        }
        updateDisplayHTML()
        fillFeaturesEditHTML()
        updateFeaturesEventListeners()
      })
    }
    select.addEventListener('change', () => {
      let value = select.value
      characterSheet.features[index].refresh =
        value === 'none' ? value : `${value}Rest`
      updateDisplayHTML()
      fillFeaturesEditHTML()
      updateFeaturesEventListeners()
    })
  }
}

function addHPInfoEventListeners(): void {
  maxHitPointsEdit.addEventListener('change', () => {
    let value = Number(maxHitPointsEdit.value)
    value = value > 0 ? value : 0
    characterSheet.hitPoints.max = value
    updateDisplayHTML()
  })

  hitDiceDieEdit.addEventListener('change', () => {
    let value = Number(hitDiceDieEdit.value)
    value = value > 0 ? value : 0
    characterSheet.hitDice.type = value
    updateDisplayHTML()
  })

  healOrDamageChoice.addEventListener('change', () => {
    updateDisplayHTML()
  })

  submitHealOrDamage.addEventListener('click', () => {
    let state = healOrDamageChoice.value
    let amount = Number(healOrDamageAmount.value)

    if (state === 'damage') {
      let diff = characterSheet.hitPoints.temporary - amount
      if (diff >= 0) {
        characterSheet.hitPoints.temporary -= amount
      } else {
        characterSheet.hitPoints.temporary = 0
        let after = characterSheet.hitPoints.current + diff // diff is a negative number here
        after = after > 0 ? after : 0
        characterSheet.hitPoints.current = after
      }
    } else if (state === 'heal') {
      let after = characterSheet.hitPoints.current + amount
      let max = characterSheet.hitPoints.max
      after = after <= max ? after : max
      characterSheet.hitPoints.current = after
    } else {
      amount = amount > 0 ? amount : 0
      characterSheet.hitPoints.temporary += amount
    }
    updateDisplayHTML()
  })

  hitDiceAvailable.addEventListener('change', () => {
    let value = Number(hitDiceAvailable.value)
    let max = characterSheet.level

    value = value > 0 ? value : 0
    value = value <= max ? value : max
    characterSheet.hitDice.left = value
    updateDisplayHTML()
  })

  let deathSaveSuccInputs = deathSaveSuccesses.getElementsByTagName('input')
  let deathSaveFailInputs = deathSaveFailures.getElementsByTagName('input')

  for (let i = 0; i < 3; i++) {
    deathSaveSuccInputs[i].addEventListener('change', () => {
      let checked = deathSaveSuccInputs[i].checked
      characterSheet.deathSaves.succeeded = checked ? i + 1 : i
      updateDisplayHTML()
    })
    deathSaveFailInputs[i].addEventListener('change', () => {
      let checked = deathSaveFailInputs[i].checked
      characterSheet.deathSaves.failed = checked ? i + 1 : i
      updateDisplayHTML()
    })
  }
}

function addBasicInfoEventListeners(): void {
  // TODO: add level up

  charNameEdit.addEventListener('change', () => {
    characterSheet.name = charNameEdit.value
    updateDisplayHTML()
    fillBasicInfoEditHTML()
  })

  speciesEdit.addEventListener('change', () => {
    characterSheet.species = speciesEdit.value
    updateDisplayHTML()
    fillBasicInfoEditHTML()
  })

  classEdit.addEventListener('change', () => {
    characterSheet.class = classEdit.value
    updateDisplayHTML()
    fillBasicInfoEditHTML()
  })

  archetypeEdit.addEventListener('change', () => {
    characterSheet.archetype = archetypeEdit.value
    updateDisplayHTML()
    fillBasicInfoEditHTML()
  })

  levelEdit.addEventListener('change', () => {
    let level = Number(levelEdit.value)
    level = level > 0 ? level : 1
    level = level <= 20 ? level : 20
    characterSheet.level = level
    updateDisplayHTML()
    fillBasicInfoEditHTML()
  })

  backgroundEdit.addEventListener('change', () => {
    characterSheet.background = backgroundEdit.value
    updateDisplayHTML()
    fillBasicInfoEditHTML()
  })

  alignmentEdit.addEventListener('change', () => {
    characterSheet.alignment = alignmentEdit.value
    updateDisplayHTML()
    fillBasicInfoEditHTML()
  })

  speedEdit.addEventListener('change', () => {
    let speed = Number(speedEdit.value)
    speed = speed >= 0 ? speed : 0
    characterSheet.speed = speed
    updateDisplayHTML()
    fillBasicInfoEditHTML()
  })

  armorClassEdit.addEventListener('change', () => {
    characterSheet.baseAc = Number(armorClassEdit.value)
    updateDisplayHTML()
    fillBasicInfoEditHTML()
  })

  armorType.addEventListener('change', () => {
    characterSheet.armorType = armorType.value
    updateDisplayHTML()
    fillBasicInfoEditHTML()
  })

  personalityTraitsEdit.addEventListener('change', () => {
    characterSheet.personalityTraits = personalityTraitsEdit.value
    updateDisplayHTML()
    fillBasicInfoEditHTML()
  })

  idealEdit.addEventListener('change', () => {
    characterSheet.ideal = idealEdit.value
    updateDisplayHTML()
    fillBasicInfoEditHTML()
  })

  bondEdit.addEventListener('change', () => {
    characterSheet.bond = bondEdit.value
    updateDisplayHTML()
    fillBasicInfoEditHTML()
  })

  flawEdit.addEventListener('change', () => {
    characterSheet.flaw = flawEdit.value
    updateDisplayHTML()
    fillBasicInfoEditHTML()
  })
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
