import { remote } from 'electron'
import GrowingPacker from '../../assets/bin-packing/packer.growing.js'
import Packer from '../../assets/bin-packing/packer.js'
import Jimp from 'jimp/es'
import * as path from 'path'
import * as xmlbuilder from 'xmlbuilder'
import * as fs from 'fs'
import { promisify } from 'util'

const writeFile = promisify(fs.writeFile)

const state = {
  bmpList: []
}

function calculateSize (w, h, setting) {
  if (setting.NPower2) {
    [w, h] = expandSize(w, h)
  }
  if (setting.sameWH) {
    let s = Math.max(w, h)
    w = s
    h = s
  }
  return [w, h]
}

function packingImages (imgList, setting) {
  let packer
  let w, h
  if (setting.autoSize) {
    packer = new GrowingPacker()
  } else {
    [w, h] = calculateSize(setting.textureWidth, setting.textureHeight, setting)
    packer = new Packer(w, h)
  }
  let blocks = []
  for (let img of imgList) {
    blocks.push({ w: img.bitmap.width + setting.padding, h: img.bitmap.height + setting.padding })
  }
  packer.fit(blocks)
  if (setting.autoSize) {
    [w, h] = calculateSize(packer.root.w, packer.root.h, setting)
  }
  return [blocks, w, h]
}

function expandSize (w, h) {
  w = 2 ** Math.ceil(Math.log(w) / Math.log(2))
  h = 2 ** Math.ceil(Math.log(h) / Math.log(2))
  return [w, h]
}

function validateBlocks (blocks) {
  for (let b of blocks) {
    if (!b.fit || !b.fit.used) {
      return false
    }
  }
  return true
}

async function loadAllImages (bmpList) {
  let imgList = []
  for (let bmp of bmpList) {
    let img = await Jimp.read(bmp.filePath)
    imgList.push(img)
  }
  return imgList
}

async function saveFNT (blocks, bmpList, imgList, fntPath) {
  let doc = xmlbuilder.create('font')
  let elem = doc.ele('chars', { 'count': blocks.length })
  for (let idx in blocks) {
    let block = blocks[idx].fit
    let char = bmpList[idx].char
    let bmp = imgList[idx].bitmap
    elem.ele('char', { 'id': char.charCodeAt(0), 'x': block.x, 'y': block.y, 'width': bmp.width, 'height': bmp.height, 'xadvance': bmp.width })
  }
  let xml = elem.end({ pretty: true })
  await writeFile(fntPath, xml, { encoding: 'utf8' })
}

const mutations = {
  LOAD (state, save) {
    save = save.bmpList
    if (save !== undefined) {
      if (save.bmpList !== undefined) {
        for (let bmp of save.bmpList) {
          if (bmp.filePath !== undefined && bmp.char !== undefined) {
            state.bmpList.push({ filePath: bmp.filePath, char: bmp.char })
          }
        }
      }
    }
  },

  ON_NEW_PROJ (state) {
    state.bmpList = []
  },

  APPEND_BMP (state, { filePath, char }) {
    state.bmpList.push({ filePath: filePath, char: char })
  },

  REMOVE_BMP (state, index) {
    if (index < 0 || index >= state.bmpList.length) return
    state.bmpList.splice(index, 1)
  },

  CHANGE_CHAR (state, { index, char }) {
    if (index < 0 || index >= state.bmpList.length) return
    state.bmpList[index].char = char
  },

  ORDER_BY_PATH (state) {
    state.bmpList.sort((a, b) => {
      if (a.filePath < b.filePath) return -1
      else if (a.filePath > b.filePath) return 1
      return 0
    })
  }
}

const actions = {
  async PUBLISH ({ state, rootState }) {
    if (state.bmpList.length === 0) return

    let setting = rootState.Setting
    try {
      let imgList = await loadAllImages(state.bmpList)
      let [blocks, w, h] = packingImages(imgList, setting)
      if (!validateBlocks(blocks)) {
        remote.dialog.showErrorBox('', '贴图太小了，不能容纳所有的字符')
        return
      }

      console.log(w, h)

      let resultImg = await new Jimp(w, h)
      for (let idx in blocks) {
        let block = blocks[idx]
        let img = imgList[idx]
        resultImg.composite(img, block.fit.x, block.fit.y)
      }
      await resultImg.write(setting.outputPath)
      let ext = path.extname(setting.outputPath)
      let fntPath = setting.outputPath.substring(0, setting.outputPath.length - ext.length) + '.xml'
      saveFNT(blocks, state.bmpList, imgList, fntPath)
    } catch (e) {
      console.dir(e)
      remote.dialog.showErrorBox('', '请检查字符图片文件是否正确\n' + e.message)
    }
  }
}

export default {
  state,
  mutations,
  actions
}
