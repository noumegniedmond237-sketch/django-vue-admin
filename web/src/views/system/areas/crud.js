import { request } from '@/api/service'

export const crudOptions = (vm) => {
  return {
    pageOptions: {
      compact: true
    },
    options: {
      tableType: 'vxe-table',
      rowKey: false,
      height: '100%',
      rowId: 'code',
      highlightCurrentRow: true,
      treeConfig: {
        lazy: true,
        children: 'children',
        hasChild: 'hasChildren',
        loadMethod: ({ row }) => {
          return request({
            url: '/api/system/area/',
            method: 'get',
            params: { pcode: row.code, limit: 999 }
          }).then(ret => {
            ret.data.data.map(value => { value.hasChildren = value.pcode_count !== 0 })
            row.hasChildren = false
            return ret.data.data
          })
        },
        iconLoaded: 'el-icon-loading'
      }
    },
    rowHandle: false,
    viewOptions: {
      componentType: 'form'
    },
    formOptions: {
      defaultSpan: 24,
      width: '30%'
    },
    indexRow: {
      title: 'N°',
      align: 'center',
      width: 100
    },
    columns: [
      {
        title: 'ID',
        key: 'id',
        width: 90,
        disabled: true,
        form: {
          disabled: true
        }
      },
      {
        title: 'Région parente',
        key: 'pcode',
        show: false,
        search: {
          disabled: false
        },
        type: 'area-selector',
        valueResolve (row, key) {
          if (row.pcode === null) {
            row.pcode = undefined
          }
        },
        form: {
          component: {
            showAllLevels: false,
            props: {
              elProps: {
                clearable: true,
                showAllLevels: false,
                props: {
                  checkStrictly: true,
                  emitPath: false,
                  clearable: true
                }
              }
            }
          }
        }
      },
      {
        title: 'Nom',
        key: 'name',
        search: {
          disabled: false
        },
        treeNode: true,
        width: 160,
        type: 'input',
        form: {
          rules: [
            { required: true, message: 'Le nom est requis' }
          ],
          component: {
            placeholder: 'Entrez le nom'
          },
          itemProps: {
            class: { yxtInput: true }
          }
        }
      },
      {
        title: 'Code région',
        key: 'code',
        search: {
          disabled: false
        },
        type: 'input',
        form: {
          rules: [
            { required: true, message: 'Le code région est requis' }
          ],
          component: {
            placeholder: 'Entrez le code région'
          },
          itemProps: {
            class: { yxtInput: true }
          }
        }
      },
      {
        title: 'Code Pinyin / Romanisé',
        key: 'pinyin',
        search: {
          disabled: true
        },
        type: 'input',
        form: {
          rules: [
            { required: true, message: 'Ce champ est requis' }
          ],
          itemProps: {
            class: { yxtInput: true }
          },
          component: {
            placeholder: 'Code romanisé'
          }
        }
      }, {
        title: 'Niveau',
        key: 'level',
        search: {
          disabled: true
        },
        type: 'input',
        form: {
          disabled: false,
          rules: [
            { required: true, message: 'Le niveau est requis' }
          ],
          itemProps: {
            class: { yxtInput: true }
          },
          component: {
            placeholder: 'Niveau'
          }
        }
      }, {
        title: 'Initiale',
        key: 'initials',
        form: {
          rules: [
            { required: true, message: "L'initiale est requise" }
          ],
          itemProps: {
            class: { yxtInput: true }
          },
          component: {
            placeholder: 'Initiale'
          }
        }
      },
      {
        title: 'Actif',
        key: 'enable',
        search: {
          disabled: false
        },
        width: 90,
        type: 'radio',
        dict: {
          data: vm.dictionary('button_status_bool')
        },
        form: {
          value: true,
          itemProps: {
            class: { yxtInput: true }
          }
        }
      }
    ].concat(vm.commonEndColumns())
  }
}
