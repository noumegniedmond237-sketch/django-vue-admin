const log = {}

/**
 * @description Retourner la valeur de couleur de ce style
 * @param {String} type nom du style [ primary | success | warning | danger | text ]
 */
function typeColor (type = 'default') {
  let color = ''
  switch (type) {
    case 'default': color = '#35495E'; break
    case 'primary': color = '#3488ff'; break
    case 'success': color = '#43B883'; break
    case 'warning': color = '#e6a23c'; break
    case 'danger': color = '#f56c6c'; break
    default:; break
  }
  return color
}

/**
 * @description Afficher une information avec le style [ title | text ]
 * @param {String} title title text
 * @param {String} info info text
 * @param {String} type style
 */
log.capsule = function (title, info, type = 'primary') {
  console.log(
    `%c ${title} %c ${info} %c`,
    'background:#35495E; padding: 1px; border-radius: 3px 0 0 3px; color: #fff;',
    `background:${typeColor(type)}; padding: 1px; border-radius: 0 3px 3px 0;  color: #fff;`,
    'background:transparent'
  )
}

/**
 * @description Afficher du texte en couleur
 */
log.colorful = function (textArr) {
  console.log(
    `%c${textArr.map(t => t.text || '').join('%c')}`,
    ...textArr.map(t => `color: ${typeColor(t.type)};`)
  )
}

/**
 * @description Afficher dans la console default avec ce style
 */
log.default = function (text) {
  log.colorful([{ text }])
}

/**
 * @description Afficher dans la console primary avec ce style
 */
log.primary = function (text) {
  log.colorful([{ text, type: 'primary' }])
}

/**
 * @description Afficher dans la console success avec ce style
 */
log.success = function (text) {
  log.colorful([{ text, type: 'success' }])
}

/**
 * @description Afficher dans la console warning avec ce style
 */
log.warning = function (text) {
  log.colorful([{ text, type: 'warning' }])
}

/**
 * @description Afficher dans la console danger avec ce style
 */
log.danger = function (text) {
  log.colorful([{ text, type: 'danger' }])
}

export default log
