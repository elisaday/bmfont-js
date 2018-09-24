<template>
  <div class="window-content">
    <div class="control-row">
      <label class="control-item">输出文件路径：</label>
      <input class="form-control control-item-stretch" type="text" v-model="outputPath">
      <button class="btn btn-default control-item" style="margin-left: 4px" @click="onClickBrowseOutputPath">
        <span class="icon icon-dot-3"></span>
      </button>
    </div>
    <div class="control-row checkbox">
      <label><input type="checkbox" v-model="npower2">合并后贴图大小强制2的N次幂</label>
    </div>
    <div class="control-row checkbox">
      <label><input type="checkbox" v-model="sameWH">合并后贴图宽高强制相同</label>
    </div>
    <div class="control-row">
      <label class="control-item">Padding：</label>
      <input class="form-control control-item" type="text" v-model="padding">
    </div>
    <div class="control-row">
      <label class="control-item">合并算法：</label>
      <select class="form-control control-item" v-model="packAlgo">
        <option>Bin-Packing</option>
      </select>
    </div>
  </div>
</template>

<script>
  import {remote} from 'electron'
  import {mapMutations} from 'vuex'

  export default {
    name: 'setting',
    mounted () {
    },
    computed: {
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
          this.SET_PADDING(value) 
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
      },            
    },
    methods: {
      ...mapMutations([
        'ENABLE_NPOWER2', 'ENABLE_SAME_WH', 'SET_PADDING', 'SET_OUTPUT_PATH', 'SET_PACK_ALGO', 'SET_OUTPUT_PATH', 'ON_PROJ_MODIFIED'
      ]),      

      onClickBrowseOutputPath () {
        let pngSavePath = remote.dialog.showSaveDialog({
          title: '选择输出文件路径',
          filters: [
            { name: 'PNG Image File', extensions: ['png'] },
            { name: 'All Files', extensions: ['*'] }
          ]
        })
        if (pngSavePath) {
          this.SET_OUTPUT_PATH(pngSavePath)
          this.ON_PROJ_MODIFIED()
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../assets/photon/css/photon.min.css";

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
  }

  .form-control {
    display: flex;
    margin: 3px;
  }

</style>
