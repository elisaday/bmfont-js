import { remote } from 'electron'
import GrowingPacker from '@/assets/bin-packing/packer.growing.js'
import Packer from '@/assets/bin-packing/packer.js'
import * as path from 'path'
import * as xmlbuilder from 'xmlbuilder'
import * as fs from 'fs'
import { promisify } from 'util'
import Jimp from 'jimp/es'

const writeFile = promisify(fs.writeFile)

const state = {
  bmpList: []
}

function calculateSize (w, h, setting) {
  if (setting.NPower2) {
    [w, h] = expandSize(w, h)
  }
  if (setting.sameWH) {
    const s = Math.max(w, h)
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
  const blocks = []
  for (const img of imgList) {
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
  for (const b of blocks) {
    if (!b.fit || !b.fit.used) {
      return false
    }
  }
  return true
}

async function loadAllImages (bmpList) {
  const imgList = []
  for (const bmp of bmpList) {
    const img = await Jimp.read(bmp.filePath)
    imgList.push(img)
  }
  return imgList
}

async function saveFNT (blocks, bmpList, imgList, fntPath) {
  const doc = xmlbuilder.create('font')
  const elem = doc.ele('chars', { count: blocks.length })
  for (const idx in blocks) {
    const block = blocks[idx].fit
    const char = bmpList[idx].char
    const bmp = imgList[idx].bitmap
    elem.ele('char', { id: char.charCodeAt(0), x: block.x, y: block.y, width: bmp.width, height: bmp.height, xadvance: bmp.width })
  }
  const xml = elem.end({ pretty: true })
  await writeFile(fntPath, xml, { encoding: 'utf8' })
}

const mutations = {
  LOAD (state, save) {
    save = save.bmpList
    if (save !== undefined) {
      if (save.bmpList !== undefined) {
        for (const bmp of save.bmpList) {
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

    const setting = rootState.Setting
    try {
      const imgList = await loadAllImages(state.bmpList)
      const [blocks, w, h] = packingImages(imgList, setting)
      if (!validateBlocks(blocks)) {
        remote.dialog.showErrorBox('', '贴图太小了，不能容纳所有的字符')
        return
      }

      const resultImg = await new Jimp(w, h)
      for (const idx in blocks) {
        const block = blocks[idx]
        const img = imgList[idx]
        resultImg.composite(img, block.fit.x, block.fit.y)
      }
      await resultImg.write(setting.outputPath)
      const ext = path.extname(setting.outputPath)
      const fntPath = setting.outputPath.substring(0, setting.outputPath.length - ext.length) + '.xml'
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
