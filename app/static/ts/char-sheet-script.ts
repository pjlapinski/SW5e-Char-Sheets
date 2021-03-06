import { Sheet, Attack, Feature } from './char-sheet-interfaces'
import {
  updateDisplayHTML,
  fillPowersEditHTML,
  fillAttacksEditHTML,
  fillEquipmentEditHTML,
  fillFeaturesEditHTML,
  fillHPInfoEditHTML,
  fillBasicInfoEditHTML,
} from './char-sheet-html-updates.js'
import { apiFindExactly } from './api-handler.js'

export const characterSheet: Sheet = JSON.parse(
  sessionStorage.getItem('characterSheet')
)
sessionStorage.removeItem('characterSheet')

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
const shieldEdit: HTMLInputElement = document.getElementById(
  'shield-edit'
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
const shortRestBtn: HTMLInputElement = document.getElementById(
  'short-rest'
) as HTMLInputElement
const longRestBtn: HTMLInputElement = document.getElementById(
  'long-rest'
) as HTMLInputElement
const levelUpBtn: HTMLInputElement = document.getElementById(
  'level-up'
) as HTMLInputElement
const utilityDiv: HTMLElement = document.getElementById('utility-section')
let previousSection: number
const saveBtn: HTMLElement = document.getElementById('save-nav')
const returnBtn: HTMLElement = document.getElementById('return-nav')
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
  addFeaturesEventListenersOnInit()
  addHPInfoEventListeners()
  addBasicInfoEventListeners()
  addRestButtonsEventListeners()
  addSaveEventListener()
  addReturnEventListener()
  addOnExitEventListener()
}

function addAttributeScoresEventListeners(): void {
  for (let att of attributeScores) {
    att.addEventListener('change', () => {
      let name = att.id.split('-')[0]
      characterSheet.attributes[name] = Number(att.value)
      update()
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
      update()
    })
  }
}

function addProficienciesEventListeners(): void {
  for (let prof of proficiencyCheckboxes) {
    prof.addEventListener('change', () => {
      let input = <HTMLInputElement>prof
      let skillName = stringToCamelCase(
        prof.parentElement.parentElement.id.replace(/-/g, ' ')
      )
      if (input.checked) characterSheet.proficiencies.push(skillName)
      else {
        let index = characterSheet.proficiencies.indexOf(skillName)
        characterSheet.proficiencies.splice(index, 1)
      }
      update()
    })
  }
}

function addExpertiseEventListeners(): void {
  for (let expertise of expertiseCheckboxes) {
    expertise.addEventListener('change', () => {
      let input = <HTMLInputElement>expertise
      let skillName = stringToCamelCase(
        expertise.parentElement.parentElement.id.replace(/-/g, ' ')
      )
      if (input.checked) characterSheet.expertise.push(skillName)
      else {
        let index = characterSheet.expertise.indexOf(skillName)
        characterSheet.expertise.splice(index, 1)
      }
      update()
    })
  }
}

function addNotesEventListeners(): void {
  editNotes.addEventListener('change', () => {
    characterSheet.notes = editNotes.value
    update()
  })
}

function addPowerPointsEventListeners(): void {
  editMaxPowerPoints.addEventListener('change', () => {
    if (Number(editMaxPowerPoints.value) < 0) editMaxPowerPoints.value = '0'
    characterSheet.powerPointsMax = Number(editMaxPowerPoints.value)
    update()
  })
  currentPowerPoints.addEventListener('change', () => {
    if (Number(currentPowerPoints.value) < 0) currentPowerPoints.value = '0'
    else if (Number(currentPowerPoints.value) > characterSheet.powerPointsMax)
      currentPowerPoints.value = String(characterSheet.powerPointsMax)
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
      update()
      fillPowersEditHTML()
      for (let j = 0; j <= 9; j++) updateEditPowersListsEventListeners(j)
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
    let description: HTMLTextAreaElement = power.getElementsByTagName(
      'textarea'
    )[0]
    let fields = [
      'delete',
      'name',
      'alignment',
      'casting',
      'range',
      'duration',
      'concentration',
    ]
    for (let i = 0; i < fields.length; i++) {
      if (i === 0) {
        inputs[i].addEventListener('click', () => {
          characterSheet.powers[`level${level}`].splice(index, 1)
          update()
          fillPowersEditHTML()
          for (let j = 0; j < 10; j++) updateEditPowersListsEventListeners(j)
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
        update()
        fillPowersEditHTML()
        for (let j = 0; j < 10; j++) updateEditPowersListsEventListeners(j)
      })
    }
    description.addEventListener('change', () => {
      characterSheet.powers[`level${level}`][index]['description'] =
        description.value
      update()
      fillPowersEditHTML()
      for (let j = 0; j < 10; j++) updateEditPowersListsEventListeners(j)
    })
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
    update()
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
    ]
    let notes: HTMLTextAreaElement = attack.getElementsByTagName('textarea')[0]
    for (let i = 0; i < fields.length; i++) {
      if (i === 0) {
        inputs[i].addEventListener('click', () => {
          characterSheet.attacks.splice(index, 1)
          update()
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
        update()
        fillAttacksEditHTML()
        updateAttacksEventListeners()
      })
    }
    notes.addEventListener('change', () => {
      characterSheet.attacks[index].notes = notes.value
      update()
      fillAttacksEditHTML()
      updateAttacksEventListeners()
    })
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
    update()
    fillEquipmentEditHTML()
    updateEquipmentEventListeners()
  })

  creditsEdit.addEventListener('change', () => {
    characterSheet.credits = Number(creditsEdit.value)
    update()
  })

  updateEquipmentEventListeners()
}

function updateEquipmentEventListeners(): void {
  let items = equipmentEditList.getElementsByClassName('equipment__item')
  let displayItems = equipmentDisplayList.getElementsByClassName(
    'equipment__item'
  )

  for (let index = 0; index < displayItems.length; index++) {
    let item = items[index]
    let itemDisplay = displayItems[index]

    let inputs: Array<HTMLInputElement> = Array.from(
      item.getElementsByTagName('input')
    )
    let displayInput = itemDisplay.getElementsByTagName('input')
    if (displayInput.length > 0) {
      displayInput[0].addEventListener('change', () => {
        if (Number(displayInput[0].value) < 0) displayInput[0].value = '0'
        else if (
          Number(displayInput[0].value) >
          characterSheet.equipment[index].usesMax
        )
          displayInput[0].value = String(
            characterSheet.equipment[index].usesMax
          )
        characterSheet.equipment[index].usesLeft = Number(displayInput[0].value)
        update()
        fillEquipmentEditHTML()
        updateEquipmentEventListeners()
      })
    }

    let fields = ['delete', 'name', 'amount', 'usesMax']
    let notes: HTMLTextAreaElement = item.getElementsByTagName('textarea')[0]
    for (let i = 0; i < fields.length; i++) {
      if (i === 0) {
        inputs[i].addEventListener('click', () => {
          characterSheet.equipment.splice(index, 1)
          update()
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
        update()
        fillEquipmentEditHTML()
        updateEquipmentEventListeners()
      })
    }
    notes.addEventListener('change', () => {
      characterSheet.equipment[index].notes = notes.value
      update()
      fillEquipmentEditHTML()
      updateEquipmentEventListeners()
    })
  }
}

function addFeaturesEventListenersOnInit(): void {
  addOtherProficiencyBtn.addEventListener('click', () => {
    characterSheet.otherProficiencies.push('')
    fillFeaturesEditHTML()
    update()
  })

  addLanguageBtn.addEventListener('click', () => {
    characterSheet.languages.push('')
    fillFeaturesEditHTML()
    update()
  })

  addFeatureBtn.addEventListener('click', () => {
    characterSheet.features.push({
      name: '',
      description: '',
      usesLeft: 0,
      usesMax: 0,
      refresh: 'none',
    })
    fillFeaturesEditHTML()
    update()
  })
  addFeaturesEventListeners()
}

function addFeaturesEventListeners(): void {
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
      fillFeaturesEditHTML()
      update()
    })

    inputs[1].addEventListener('change', () => {
      characterSheet.otherProficiencies[index] = inputs[1].value
      fillFeaturesEditHTML()
      update()
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
      fillFeaturesEditHTML()
      update()
    })

    inputs[1].addEventListener('change', () => {
      characterSheet.languages[index] = inputs[1].value
      fillFeaturesEditHTML()
      update()
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
        fillFeaturesEditHTML()
        update()
      })
    }

    let select: HTMLSelectElement = feature.getElementsByTagName('select')[0]
    let description: HTMLTextAreaElement = feature.getElementsByTagName(
      'textarea'
    )[0]
    let fields = ['delete', 'name', 'usesMax']

    for (let i = 0; i < fields.length; i++) {
      if (i === 0) {
        inputs[i].addEventListener('click', () => {
          characterSheet.features.splice(index, 1)
          fillFeaturesEditHTML()
          update()
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
        fillFeaturesEditHTML()
        update()
      })
    }
    description.addEventListener('change', () => {
      characterSheet.features[index].description = description.value
      fillFeaturesEditHTML()
      update()
    })
    select.addEventListener('change', () => {
      let value = select.value
      characterSheet.features[index].refresh =
        value === 'none' ? value : `${value}Rest`
      fillFeaturesEditHTML()
      update()
    })
  }
}

function addHPInfoEventListeners(): void {
  maxHitPointsEdit.addEventListener('change', () => {
    let value = Number(maxHitPointsEdit.value)
    value = value > 0 ? value : 0
    characterSheet.hitPoints.max = value
    fillHPInfoEditHTML()
    update()
  })

  hitDiceDieEdit.addEventListener('change', () => {
    let value = Number(hitDiceDieEdit.value)
    value = value > 0 ? value : 0
    characterSheet.hitDice.type = value
    fillHPInfoEditHTML()
    update()
  })

  healOrDamageChoice.addEventListener('change', () => {
    update()
  })

  healOrDamageAmount.addEventListener('change', () => {
    if (Number(healOrDamageAmount.value) < 0)
      healOrDamageAmount.value = '0'
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
      characterSheet.hitPoints.temporary = amount
    }
    healOrDamageAmount.value = ''
    update()
  })

  hitDiceAvailable.addEventListener('change', () => {
    let value = Number(hitDiceAvailable.value)
    let max = characterSheet.level

    value = value > 0 ? value : 0
    value = value <= max ? value : max
    characterSheet.hitDice.left = value
    update()
  })

  let deathSaveSuccInputs: HTMLCollection = deathSaveSuccesses.getElementsByClassName(
    'checkbox'
  )
  let deathSaveFailInputs: HTMLCollection = deathSaveFailures.getElementsByClassName(
    'checkbox'
  )

  for (let i = 0; i < 3; i++) {
    deathSaveSuccInputs[i].addEventListener('change', () => {
      let checked = (deathSaveSuccInputs[i] as HTMLInputElement).checked
      characterSheet.deathSaves.succeeded = checked ? i + 1 : i
      update()
    })
    deathSaveFailInputs[i].addEventListener('change', () => {
      let checked = (deathSaveFailInputs[i] as HTMLInputElement).checked
      characterSheet.deathSaves.failed = checked ? i + 1 : i
      update()
    })
  }
}

function addBasicInfoEventListeners(): void {
  levelUpBtn.addEventListener('click', showUtilityLevelUp)

  charNameEdit.addEventListener('change', () => {
    characterSheet.name = charNameEdit.value
    updateTitle()
    update()
    fillBasicInfoEditHTML()
  })

  speciesEdit.addEventListener('change', () => {
    characterSheet.species = speciesEdit.value
    update()
    fillBasicInfoEditHTML()
  })

  classEdit.addEventListener('change', () => {
    characterSheet.class = classEdit.value
    update()
    fillBasicInfoEditHTML()
  })

  archetypeEdit.addEventListener('change', () => {
    characterSheet.archetype = archetypeEdit.value
    update()
    fillBasicInfoEditHTML()
  })

  levelEdit.addEventListener('change', () => {
    let level = Number(levelEdit.value)
    level = level > 0 ? level : 1
    level = level <= 20 ? level : 20
    characterSheet.level = level
    update()
    fillBasicInfoEditHTML()
  })

  backgroundEdit.addEventListener('change', () => {
    characterSheet.background = backgroundEdit.value
    update()
    fillBasicInfoEditHTML()
  })

  alignmentEdit.addEventListener('change', () => {
    characterSheet.alignment = alignmentEdit.value
    update()
    fillBasicInfoEditHTML()
  })

  speedEdit.addEventListener('change', () => {
    let speed = Number(speedEdit.value)
    speed = speed >= 0 ? speed : 0
    characterSheet.speed = speed
    update()
    fillBasicInfoEditHTML()
  })

  armorClassEdit.addEventListener('change', () => {
    characterSheet.baseAc = Number(armorClassEdit.value)
    update()
    fillBasicInfoEditHTML()
  })

  shieldEdit.addEventListener('change', () => {
    characterSheet.shieldBonus = Number(shieldEdit.value)
    update()
    fillBasicInfoEditHTML()
  })

  armorType.addEventListener('change', () => {
    characterSheet.armorType = armorType.value
    update()
    fillBasicInfoEditHTML()
  })

  personalityTraitsEdit.addEventListener('change', () => {
    characterSheet.personalityTraits = personalityTraitsEdit.value
    update()
    fillBasicInfoEditHTML()
  })

  idealEdit.addEventListener('change', () => {
    characterSheet.ideal = idealEdit.value
    update()
    fillBasicInfoEditHTML()
  })

  bondEdit.addEventListener('change', () => {
    characterSheet.bond = bondEdit.value
    update()
    fillBasicInfoEditHTML()
  })

  flawEdit.addEventListener('change', () => {
    characterSheet.flaw = flawEdit.value
    update()
    fillBasicInfoEditHTML()
  })
}

function addRestButtonsEventListeners(): void {
  shortRestBtn.addEventListener('click', shortRest)
  longRestBtn.addEventListener('click', longRest)
}

function addSaveEventListener(): void {
  saveBtn.addEventListener('click', saveSheet)
}

function addReturnEventListener(): void {
  returnBtn.addEventListener('click', () => {
    saveSheet()
    document.location.href = document.location.origin
  })
}

function addOnExitEventListener(): void {
  // this whole thing works kind of funky on mobile chromxe

  // for mobile, the 'beforeunload' way will not work, so this will have to do
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') saveSheet()
  })
  window.addEventListener('beforeunload', () => {
    let url = '/char-sheet/save/' + document.location.pathname.split('/')[2]
    let headers = {
      type: 'application/json',
    }
    let blob = new Blob([JSON.stringify(characterSheet)], headers)
    navigator.sendBeacon(url, blob)
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
  bonus += getProficiencyBonus(characterSheet.level)
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

export async function getCasterType(cls?, arch?): Promise<string> {
  let type = 'None'
  if (cls == null)
    cls = await apiFindExactly('classes', { name: characterSheet.class })

  if (cls == null) return 'None'
  if (cls['casterType'] === 'None' && characterSheet.archetype !== '') {
    if (arch == null)
      arch = await apiFindExactly('archetypes', {
        name: characterSheet.archetype,
      })
    if (arch == null) return 'None'
    return arch['casterType']
  }
  return cls['casterType']
}

function longRest(): void {
  characterSheet.hitPoints.current = characterSheet.hitPoints.max
  let hitDiceAfterRecovery =
    characterSheet.hitDice.left + Math.ceil(characterSheet.level / 2)
  hitDiceAfterRecovery =
    hitDiceAfterRecovery <= characterSheet.level
      ? hitDiceAfterRecovery
      : characterSheet.level
  characterSheet.hitDice.left = hitDiceAfterRecovery
  characterSheet.hitPoints.temporary = 0
  characterSheet.deathSaves.succeeded = 0
  for (let feature of characterSheet.features)
    feature.usesLeft = feature.usesMax
  for (let item of characterSheet.equipment) item.usesLeft = item.usesMax
  characterSheet.powerPointsLeft = characterSheet.powerPointsMax
  characterSheet.deathSaves.failed = 0
  update()
}

async function shortRest(): Promise<void> {
  let type = await getCasterType()
  if (type === 'Tech')
    characterSheet.powerPointsLeft = characterSheet.powerPointsMax
  for (let feature of characterSheet.features)
    if (feature.refresh === 'shortRest') feature.usesLeft = feature.usesMax
  showUtilityShortRest()
}

async function getLevelUpFeatures(cls?, arch?): Promise<Array<Feature>> {
  let result: Array<Feature> = []

  if (cls == null)
    cls = await apiFindExactly('classes', { name: characterSheet.class })
  if (cls == null) return result
  let features = cls['levelChanges'][String(characterSheet.level + 1)][
    'Features'
  ].split(/, /g)
  for (let feature of features) {
    let featueDesc = cls['features'][feature]
    if (featueDesc == null) continue
    let featureObj: Feature = {
      name: feature,
      description: featueDesc,
      usesLeft: 0,
      usesMax: 0,
      refresh: 'none',
    }
    result.push(featureObj)
  }
  if (characterSheet.archetype === '') return result
  if (arch == null)
    arch = await apiFindExactly('archetypes', {
      name: characterSheet.archetype,
    })
  if (arch == null) return result
  let archFeaturesOnLevel =
    arch['featuresTable'][String(characterSheet.level + 1)]
  if (archFeaturesOnLevel == null) return result
  let archFeatures = archFeaturesOnLevel.split(/, /g)
  for (let feature of archFeatures) {
    let featueDesc = arch['features'][feature]
    let featureObj: Feature = {
      name: feature,
      description: featueDesc,
      usesLeft: 0,
      usesMax: 0,
      refresh: 'none',
    }
    result.push(featureObj)
  }
  return result
}

async function getPowerPointsAtLevel(
  level: number,
  cls?,
  arch?
): Promise<number> {
  if (cls == null)
    cls = await apiFindExactly('classes', { name: characterSheet.class })
  if (arch == null)
    arch = await apiFindExactly('archetypes', {
      name: characterSheet.archetype,
    })
  let casterType = await getCasterType(cls, arch)

  if (cls == null && arch == null) return 0
  if (
    cls == null ||
    cls['levelChanges'][String(level)][`${casterType} Points`] == null
  ) {
    if (
      arch == null ||
      arch['leveledTable'] == null ||
      arch['leveledTable'][String(level)] == null ||
      arch['leveledTable'][String(level)][1]['key'] !== `${casterType} Points`
    )
      return 0
    return Number(arch['leveledTable'][String(level)][1]['value'])
  }
  return Number(cls['levelChanges'][String(level)][`${casterType} Points`])
}

async function getMaxPowerLevel(level: number, cls?, arch?): Promise<number> {
  if (cls == null)
    cls = await apiFindExactly('classes', { name: characterSheet.class })
  if (arch == null)
    arch = await apiFindExactly('archetypes', {
      name: characterSheet.archetype,
    })

  if (cls == null && arch == null) return 0
  if (
    cls == null ||
    cls['levelChanges'][String(level)]['Max Power Level'] == null
  ) {
    if (
      arch == null ||
      arch['leveledTable'] == null ||
      arch['leveledTable'][String(level)] == null ||
      arch['leveledTable'][String(level)][2]['key'] !== 'Max Power Level'
    )
      return 0
    return Number(arch['leveledTable'][String(level)][2]['value'][0])
  }
  return Number(cls['levelChanges'][String(level)]['Max Power Level'][0])
}

async function getPowersKnown(level: number, cls?, arch?): Promise<number> {
  if (cls == null)
    cls = await apiFindExactly('classes', { name: characterSheet.class })
  if (arch == null)
    arch = await apiFindExactly('archetypes', {
      name: characterSheet.archetype,
    })
  let casterType = await getCasterType(cls, arch)

  if (cls == null && arch == null) return 0
  if (
    cls == null ||
    cls['levelChanges'][String(level)][`${casterType} Powers Known`] == null
  ) {
    if (
      arch == null ||
      arch['leveledTable'] == null ||
      arch['leveledTable'][String(level)] == null ||
      arch['leveledTable'][String(level)][0]['key'] !==
        `${casterType} Powers Known`
    )
      return 0
    return Number(arch['leveledTable'][String(level)][0]['value'])
  }
  return Number(
    cls['levelChanges'][String(level)][`${casterType} Powers Known`]
  )
}

// #endregion
// #region utility functions
function update(): void {
  updateDisplayHTML()
  updateEquipmentEventListeners()
  addFeaturesEventListeners()
}

function initUtilityDiv(): void {
  utilityDiv.innerHTML = ''

  let sections = document.getElementsByClassName('sheet-section')
  for (let i = 0; i < sections.length; i++) {
    let section = sections[i] as HTMLElement
    if (section.style.display === 'block') {
      previousSection = i
      section.style.display = 'none'
      break
    }
  }
  utilityDiv.style.display = 'block'
  document.getElementById('menu-toggle').style.display = 'none'
  if (window.outerWidth > 600)
    document.getElementById('sheet-side-menu').style.width = '0'
}

function exitUtilityDiv(): void {
  utilityDiv.style.display = 'none'
  let sections = document.getElementsByClassName('sheet-section')
  let prev = sections[previousSection] as HTMLElement
  prev.style.display = 'block'
  if (window.outerWidth > 600)
    document.getElementById('sheet-side-menu').style.width = '250px'
  else document.getElementById('menu-toggle').style.display = 'block'
  update()
}

function showUtilityShortRest(): void {
  initUtilityDiv()
  let returnBtn: HTMLInputElement = document.createElement('input')
  returnBtn.value = 'Return'
  returnBtn.className = 'button'
  returnBtn.type = 'button'
  returnBtn.addEventListener('click', exitUtilityDiv)
  utilityDiv.appendChild(returnBtn)
  let question = document.createElement('h4')
  question.innerText = 'How many hit dice would you like to use?'
  utilityDiv.appendChild(question)
  let amount = document.createElement('input')
  amount.className = 'number'
  amount.type = 'number'
  amount.addEventListener('change', () => {
    let value = Number(amount.value)
    let max = characterSheet.hitDice.left
    amount.value = value > 0 ? String(value) : '0'
    amount.value = value <= max ? String(value) : String(max)
  })
  utilityDiv.appendChild(amount)
  let submit = document.createElement('input')
  submit.className = 'button'
  submit.type = 'button'
  submit.value = 'Rest'
  submit.addEventListener('click', () => {
    characterSheet.hitDice.left -= Number(amount.value)
    exitUtilityDiv()
  })
  utilityDiv.appendChild(submit)
}

async function showUtilityLevelUp(): Promise<void> {
  initUtilityDiv()
  if (characterSheet.level === 20) {
    let message: HTMLElement = document.createElement('h4')
    message.innerText =
      'You are max level, there is no more levelling up to be done!'
    utilityDiv.appendChild(message)
    let returnBtn: HTMLInputElement = document.createElement('input')
    returnBtn.value = 'Return'
    returnBtn.className = 'button'
    returnBtn.type = 'button'
    returnBtn.addEventListener('click', exitUtilityDiv)
    utilityDiv.appendChild(returnBtn)
    return
  }
  let cls = await apiFindExactly('classes', { name: characterSheet.class })
  let arch = await apiFindExactly('archetypes', {
    name: characterSheet.archetype,
  })
  let returnBtn: HTMLInputElement = document.createElement('input')
  returnBtn.value = 'Return'
  returnBtn.className = 'button'
  returnBtn.type = 'button'
  returnBtn.addEventListener('click', exitUtilityDiv)
  utilityDiv.appendChild(returnBtn)

  let hpBonus =
    characterSheet.bonuses.hitPointsPerLevel +
    getAttributeModifier('constitution')
  let sign = hpBonus >= 0 ? '+' : ''

  let hpMessage: HTMLElement = document.createElement('h4')
  hpMessage.innerText =
    `Congratulations! If you roll for HP, go ahead and roll 1d${characterSheet.hitDice.type}${sign}${hpBonus}. ` +
    'Then input the result below.'
  utilityDiv.appendChild(hpMessage)
  let hpInput: HTMLInputElement = document.createElement('input')
  hpInput.className = 'number'
  hpInput.type = 'number'
  utilityDiv.appendChild(hpInput)
  let message: HTMLElement = document.createElement('p')
  message.innerText =
    `Below you will find the list of features you have gained. Those will be added directly to your features. However, ` +
    `keep in mind that things like number of uses are NOT added automatically. Also, any previous features that are upgraded ` +
    `on this level are not shown here. Please go through your existing features and make sure to update everything!`
  utilityDiv.appendChild(message)
  let featuresList: HTMLElement = document.createElement('ul')
  let features = await getLevelUpFeatures(cls, arch)

  for (let feature of features) {
    let li: HTMLElement = document.createElement('li')
    let name: HTMLElement = document.createElement('h3')
    name.className = 'label'
    name.innerText = feature.name
    li.appendChild(name)
    let desc: HTMLElement = document.createElement('p')
    desc.innerText = feature.description
    li.appendChild(desc)
    featuresList.appendChild(li)
  }
  utilityDiv.appendChild(featuresList)

  let casterType = await getCasterType(cls, arch)
  let pointDifference = 0
  if (casterType !== 'None') {
    pointDifference =
      (await getPowerPointsAtLevel(characterSheet.level + 1, cls, arch)) -
      (await getPowerPointsAtLevel(characterSheet.level, cls, arch))
    let powersAmount =
      (await getPowersKnown(characterSheet.level + 1, cls, arch)) -
      (await getPowersKnown(characterSheet.level, cls, arch))
    let maxLevel = await getMaxPowerLevel(characterSheet.level + 1, cls, arch)
    let powerMessage: HTMLElement = document.createElement('h4')
    powerMessage.innerText =
      `Additionally, you gained ${pointDifference} power point${
        pointDifference > 1 ? 's' : ''
      }, which will be updated automatically. ` +
      `You can also choose ${powersAmount} new power${
        powersAmount > 1 ? 's' : ''
      }, at maximum power level of ${maxLevel}.`
    utilityDiv.appendChild(powerMessage)
  }
  let submitBtn: HTMLInputElement = document.createElement('input')
  submitBtn.type = 'button'
  submitBtn.className = 'button'
  submitBtn.value = 'Level up'
  submitBtn.addEventListener('click', () => {
    characterSheet.level++
    characterSheet.hitDice.left++
    characterSheet.hitPoints.max += Number(hpInput.value)
    characterSheet.hitPoints.current += Number(hpInput.value)
    for (let feature of features) characterSheet.features.push(feature)
    characterSheet.powerPointsMax += pointDifference
    fillBasicInfoEditHTML()
    exitUtilityDiv()
  })
  utilityDiv.appendChild(submitBtn)
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

export function updateTitle(): void {
  document.title = `SW5e - ${characterSheet.name}`
}

function saveSheet(): void {
  fetch('/char-sheet/save/' + document.location.pathname.split('/')[2], {
    method: 'POST',
    body: JSON.stringify(characterSheet),
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

// auto save every 30 seconds
setInterval(saveSheet, 30000)

// #endregion
