import {remote} from 'electron'
import * as fs from 'fs'
import {promisify} from 'util'

const writeFile = promisify(fs.writeFile)
const readFile = promisify(fs.readFile)

const state = {
  projPathName: null,
  modified: false
}

async function saveProj (rootState, savePath) {
  let save = {
    setting: rootState.Setting,
    bmpList: rootState.BMPList
  }
  await writeFile(savePath, JSON.stringify(save), {encoding: 'utf8'})
}

async function openProj (commit) {
  let projPath = remote.dialog.showOpenDialog({
    title: '打开BMFont工程',
    properties: [
      'openFile'
    ],
    filters: [
      { name: 'BMFont Project File', extensions: ['bfp'] },
      { name: 'All Files', extensions: ['*'] }
    ]
  })[0]

  try {
    let data = await readFile(projPath, {encoding: 'utf8'})
    let json = JSON.parse(data)
    commit('LOAD', json)
    commit('ON_PROJ_SAVED', projPath)
  } catch (e) {
    console.log(e)
  }
}

async function checkProjModified () {
  if (state.modified) {
    let choice = remote.dialog.showMessageBox({
      type: 'question',
      title: 'BMFont.js',
      message: '工程已经更改，是否保存当前工程？',
      defaultId: 0,
      noLink: true,
      buttons: ['保存', '不保存', '取消']
    })
    return choice
  } else {
    return 1
  }
}

function confirmExit () {
  let choice = remote.dialog.showMessageBox({
    type: 'question',
    title: 'BMFont.js',
    message: '确定要退出吗？',
    defaultId: 0,
    noLink: true,
    buttons: ['退出', '取消']
  })
  if (choice === 0) {
    remote.getCurrentWindow().close()
  }
}

const mutations = {
  ON_NEW_PROJ (state) {
    state.projPathName = null
    state.modified = false
  },

  ON_PROJ_MODIFIED (state) {
    if (state.projPathName === null) {
      state.projPathName = '未命名'
    }
    state.modified = true
  },

  ON_PROJ_SAVED (state, projPathName) {
    state.projPathName = projPathName
    state.modified = false
  }
}

const actions = {
  async NEW_PROJ ({commit, dispatch}) {
    let choice = await checkProjModified()
    if (choice === 0) {
      await dispatch('SAVE_PROJ')
      commit('ON_NEW_PROJ')
    } else if (choice === 1) {
      commit('ON_NEW_PROJ')
    }
  },

  async OPEN_PROJ ({commit, dispatch}) {
    let choice = await checkProjModified()
    if (choice === 0) {
      await dispatch('SAVE_PROJ')
      openProj(commit)
    } else if (choice === 1) {
      openProj(commit)
    }
  },

  async SAVE_PROJ ({state, commit, rootState}) {
    if (state.projPathName === null) return
    let savePath = remote.dialog.showSaveDialog({
      title: '保存BMFont工程',
      filters: [
        { name: 'BMFont Project File', extensions: ['bfp'] },
        { name: 'All Files', extensions: ['*'] }
      ]
    })
    if (savePath === undefined) return
    await saveProj(rootState, savePath)
    commit('ON_PROJ_SAVED', savePath)
  },

  async CONFIRM_EXIT ({dispatch}) {
    let choice = await checkProjModified()
    if (choice === 0) {
      await dispatch('SAVE_PROJ')
      confirmExit()
    } else if (choice === 1) {
      confirmExit()
    }
  }
}

export default {
  state,
  mutations,
  actions
}
