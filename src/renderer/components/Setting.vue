<template>
  <div class="window-content">
    <div class="control-row">
      <label class="control-item">输出文件路径：</label>
      <input
        v-model="outputPath"
        class="form-control control-item-stretch"
        type="text"
      >
      <span />
      <button
        class="btn btn-default control-item"
        @click="onClickBrowseOutputPath"
      >
        <span class="icon icon-dot-3" />
      </button>
    </div>
    <div class="control-row checkbox">
      <label><input
        v-model="autoSize"
        type="checkbox"
      >自动处理合并后贴图大小</label>
    </div>
    <div
      v-if="!autoSize"
      class="control-row"
    >
      <label class="control-item">宽：</label>
      <input
        v-model="textureWidth"
        class="form-control control-item"
        type="number"
        style="width: 80px"
      >
      <span />
      <label class="control-item">高：</label>
      <input
        v-model="textureHeight"
        class="form-control control-item"
        type="number"
        style="width: 80px"
      >
    </div>
    <div class="control-row checkbox">
      <label><input
        v-model="npower2"
        type="checkbox"
      >合并后贴图大小强制2的N次幂</label>
    </div>
    <div class="control-row checkbox">
      <label><input
        v-model="sameWH"
        type="checkbox"
      >合并后贴图宽高强制相同</label>
    </div>
    <div class="control-row">
      <label class="control-item">Padding：</label>
      <input
        v-model="padding"
        class="form-control control-item"
        type="number"
        style="width: 60px"
      >
    </div>
    <div class="control-row">
      <label class="control-item">合并算法：</label>
      <select
        v-model="packAlgo"
        class="form-control control-item"
      >
        <option>Bin-Packing</option>
      </select>
    </div>
  </div>
</template>

<script>
import { remote } from 'electron'
import { mapMutations } from 'vuex'

export default {
  name: 'Setting',
  computed: {
    textureWidth: {
      get () { return this.$store.state.Setting.textureWidth },
      set (value) {
        if (Number(value) < 1) value = 1
        this.SET_TEXTURE_WIDTH(Number(value))
        this.ON_PROJ_MODIFIED()
      }
    },
    textureHeight: {
      get () { return this.$store.state.Setting.textureHeight },
      set (value) {
        this.SET_TEXTURE_HEIGHT(Number(value))
        this.ON_PROJ_MODIFIED()
      }
    },
    autoSize: {
      get () { return this.$store.state.Setting.autoSize },
      set (value) {
        this.ENABLE_AUTO_SIZE(value)
        this.ON_PROJ_MODIFIED()
      }
    },
    npower2: {
      get () { return this.$store.state.Setting.NPower2 },
      set (value) {
        this.ENABLE_NPOWER2(value)
        this.ON_PROJ_MODIFIED()
      }
    },
    sameWH: {
      get () { return this.$store.state.Setting.sameWH },
      set (value) {
        this.ENABLE_SAME_WH(value)
        this.ON_PROJ_MODIFIED()
      }
    },
    padding: {
      get () { return this.$store.state.Setting.padding },
      set (value) {
        this.SET_PADDING(Number(value))
        this.ON_PROJ_MODIFIED()
      }
    },
    outputPath: {
      get () { return this.$store.state.Setting.outputPath },
      set (value) {
        this.SET_OUTPUT_PATH(value)
        this.ON_PROJ_MODIFIED()
      }
    },
    packAlgo: {
      get () { return this.$store.state.Setting.packAlgo },
      set (value) {
        this.SET_PACK_ALGO(value)
        this.ON_PROJ_MODIFIED()
      }
    }
  },
  mounted () {
  },
  methods: {
    ...mapMutations([
      'ENABLE_NPOWER2', 'ENABLE_SAME_WH', 'SET_PADDING', 'SET_OUTPUT_PATH', 'SET_PACK_ALGO',
      'SET_OUTPUT_PATH', 'ON_PROJ_MODIFIED', 'ENABLE_AUTO_SIZE', 'SET_TEXTURE_WIDTH', 'SET_TEXTURE_HEIGHT'
    ]),

    async onClickBrowseOutputPath () {
      const ret = await remote.dialog.showSaveDialog({
        title: '选择输出文件路径',
        filters: [
          { name: 'PNG Image File', extensions: ['png'] },
          { name: 'All Files', extensions: ['*'] }
        ]
      })
      if (ret.filePath && !ret.canceled) {
        this.SET_OUTPUT_PATH(ret.filePath)
        this.ON_PROJ_MODIFIED()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  label {
    margin-bottom: 0px;
  }

  .window-content {
    flex-direction: column;
    flex-wrap: nowrap;
    margin: 20px;
  }

  .control-row {
    margin-top: 0px;
    margin-bottom: 10px;

    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;

    .control-item {
      flex-grow: 0;
      width: auto;
    }

    .control-item-stretch {
      flex-grow: 1;
      width: auto;
    }

    span {
      margin-left: 6px;
      margin-right: 6px;
    }
  }

  .form-control {
    display: flex;
    margin: 3px;
  }

</style>
