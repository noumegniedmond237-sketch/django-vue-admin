/**
 * @description Création d'un élément de menu
 * @param {Function} h createElement
 * @param {Object} menu Données du menu
 */
export function elMenuItem (h, menu) {
  let icon = null
  if (menu.icon) icon = <i class={ `fa fa-${menu.icon}` }/>
  else if (menu.iconSvg) icon = <d2-icon-svg name={ menu.iconSvg }/>
  else icon = <i class="fa fa-file-o"/>
  const displayTitle = (menu.path === '/index') ? 'Tableau de bord' : (menu.title || 'Sans titre')
  return <el-menu-item
    key={ menu.path }
    index={ menu.path }>
    { icon }
    <span slot="title">{ displayTitle }</span>
  </el-menu-item>
}

/**
 * @description Création d'un sous-menu
 * @param {Function} h createElement
 * @param {Object} menu Données du menu
 */
export function elSubmenu (h, menu) {
  let icon = null
  if (menu.icon) icon = <i slot="title" class={ `fa fa-${menu.icon}` }/>
  else if (menu.iconSvg) icon = <d2-icon-svg slot="title" name={ menu.iconSvg }/>
  else icon = <i slot="title" class="fa fa-folder-o"/>
  const displayTitle = (menu.path === '/index') ? 'Tableau de bord' : (menu.title || 'Sans titre')
  return <el-submenu
    key={ menu.path }
    index={ menu.path }>
    { icon }
    <span slot="title">{ displayTitle }</span>
    { menu.children.map(child => createMenu.call(this, h, child)) }
  </el-submenu>
}

/**
 * @description Méthode de rendu du menu
 * @param {Function} h createElement
 * @param {Object} menu Données du menu
 */
export function createMenu (h, menu) {
  if (menu.children === undefined) return elMenuItem.call(this, h, menu)
  return elSubmenu.call(this, h, menu)
}
