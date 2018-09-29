<template>
  <div class="window-content">
    <div class="pane-group" id="dropArea">
      <div class="tip" :style="{display: tipShow}">
        <p>把文字图片拖放到这里</p>
      </div>
      <table class="table-striped" :style="{display: tipHide}">
        <thead>
          <tr>
            <th @click="onClickHeaderImgFile">图片文件</th>
            <th>字符</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(bmp, index) of bmpList" :key="index">
            <td>{{bmp.filePath}}</td>
            <td><input :value="bmp.char" v-on:input="charChanged(index, $event)" type="text" class="form-control" maxlength="1" style="width: 40px; text-align:center"></td>
            <td><button class="btn btn-mini btn-default" v-on:click="onClickRemove(index)">移除</button></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
  import {mapMutations} from 'vuex'

  export default {
    name: 'bmp-list',
    mounted () {
      let holder = document.getElementById('dropArea')
      holder.ondragover = (e) => {
        e.preventDefault()
        e.stopPropagation()
      }
      holder.ondrop = (e) => {
        e.preventDefault()
        e.stopPropagation()
        for (let f of e.dataTransfer.files) {
          if (f.type === 'image/png') {
            this.appendBMP(f.path, f.name.charAt(0))
          }
        }
      }
    },
    computed: {
      bmpList () {
        return this.$store.state.BMPList.bmpList
      },
      setting () {
        return this.$store.state.Setting
      },
      tipShow () {
        return this.bmpList.length === 0 ? '' : 'none'
      },
      tipHide () {
        return this.bmpList.length === 0 ? 'none' : ''
      }
    },
    methods: {
      ...mapMutations([
        'APPEND_BMP', 'REMOVE_BMP', 'CHANGE_CHAR', 'ON_PROJ_MODIFIED', 'ORDER_BY_PATH'
      ]),

      appendBMP (filePath, char) {
        this.APPEND_BMP({filePath: filePath, char: char})
        this.ON_PROJ_MODIFIED()
      },

      charChanged (index, event) {
        this.CHANGE_CHAR({index: index, char: event.data})
        this.ON_PROJ_MODIFIED()
      },

      onClickRemove (index) {
        this.REMOVE_BMP(index)
        this.ON_PROJ_MODIFIED()
      },

      onClickHeaderImgFile () {
        this.ORDER_BY_PATH()
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../assets/photon/css/photon.min.css";

  .tip {
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 1;

    p {
      border-style: dashed;
      border-color: #aaa;
      border-radius: 10px;
      padding: 20px;
      font-size: 1.8em;
      font-weight: bold;
      color: #888;
    }
  }
</style>

