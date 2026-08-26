export const BUTTON_VALUE_TO_COLOR_MAPPING = {
  1: 'success',
  true: 'success',
  0: 'danger',
  false: 'danger',
  Search: 'warning',
  Update: 'primary',
  Create: 'success',
  Retrieve: 'info',
  Delete: 'danger'
}

export function getButtonSettings (objectSettings) {
  return objectSettings.map(item => {
    return {
      label: item.label,
      value: item.value,
      color: BUTTON_VALUE_TO_COLOR_MAPPING[item.value]
    }
  })
}

export const BUTTON_STATUS_BOOL = getButtonSettings([{ label: 'Activé', value: true }, { label: 'Désactivé', value: false }])
export const BUTTON_STATUS_NUMBER = getButtonSettings([{ label: 'Activé', value: 1 }, { label: 'Désactivé', value: 0 }])
export const BUTTON_WHETHER_NUMBER = getButtonSettings([{ label: 'Oui', value: 1 }, { label: 'Non', value: 0 }])
export const BUTTON_WHETHER_BOOL = getButtonSettings([{ label: 'Oui', value: true }, { label: 'Non', value: false }])
export const USER_TYPE = getButtonSettings([{ label: 'Administrateur', value: 0 }, { label: 'Utilisateur', value: 1 }])
