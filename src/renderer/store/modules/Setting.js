const state = {
  padding: 1,
  NPower2: true,
  sameWH: true,
  outputPath: 'untitiled.png',
  packAlgo: 'Bin-Packing'
}

const mutations = {
  LOAD (state, save) {
    save = save.setting
    if (save !== undefined) {
      if (save.padding !== undefined) state.padding = Number(save.padding)
      if (save.NPower2 !== undefined) state.NPower2 = save.NPower2
      if (save.sameWH !== undefined) state.sameWH = save.sameWH
      if (save.outputPath !== undefined) state.outputPath = save.outputPath
      if (save.packAlgo !== undefined) state.packAlgo = save.packAlgo
    }
  },
  ON_NEW_PROJ (state) {
    state.padding = 1
    state.NPower2 = true
    state.sameWH = true
    state.outputPath = 'untitiled.png'
    state.packAlgo = 'Bin-Packing'
  },
  SET_PADDING (state, padding) {
    state.padding = Number(padding)
  },
  ENABLE_NPOWER2 (state, enabled) {
    state.NPower2 = enabled
  },
  ENABLE_SAME_WH (state, enabled) {
    console.log(state.sameWH, enabled)
    state.sameWH = enabled
  },
  SET_OUTPUT_PATH (state, outputPath) {
    state.outputPath = outputPath
  },
  SET_PACK_ALGO (state, algo) {
    state.packAlgo = algo
  }
}

const actions = {
}

export default {
  state,
  mutations,
  actions
}
