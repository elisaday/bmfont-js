<template>
  <div id="app">
    <div class="window">
      <header class="toolbar toolbar-header draggable">
        <h1 class="title">位图字体生成器 {{titleProjPathName}}</h1>
        <div class="toolbar-actions">
          <div class="btn-group">
            <button class="btn btn-default" @click="onClickNew">
              <span class="icon icon-doc-text"></span>
            </button>
            <button class="btn btn-default" @click="onClickOpen">
              <span class="icon icon-folder"></span>
            </button>
            <button class="btn btn-default" @click="onClickSave">
              <span class="icon icon-floppy"></span>
            </button>
          </div>

          <div class="btn-group">
            <button class="btn btn-default" @click="onClickBMPList">
              <span class="icon icon-list"></span>
            </button>
            <button class="btn btn-default" @click="onClickSetting">
              <span class="icon icon-tools"></span>
            </button>
          </div>

          <div class="btn-group">
            <button class="btn btn-default" @click="onClickPublish">
              <span class="icon icon-publish"></span>
            </button>
          </div>

          <div class="btn-group pull-right">
            <button class="btn btn-default" @click="onClickHelp">
              <span class="icon icon-help-circled"></span>
            </button>
            <button class="btn btn-default" @click="onClickExit">
              <span class="icon icon-logout"></span>
            </button>
          </div>
        </div>      
      </header>
      <router-view></router-view>
      <footer class="toolbar toolbar-footer">
        <h1 class="title"></h1>
      </footer>
    </div>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import * as path from 'path'

  export default {
    name: 'bmfont-js',
    mounted () {
      let holder = document.getElementById('app')
      holder.ondragover = (e) => {
        e.preventDefault()
        e.stopPropagation()
      }
      holder.ondrop = (e) => {
        e.preventDefault()
        e.stopPropagation()
      }    
    },
    computed: {
      ...mapState({
        projPathName: state => state.App.projPathName,
        modified: state => state.App.modified
      }),
      titleProjPathName () {
        let projPathName = this.projPathName != null ? (' - [' + path.basename(this.projPathName) + ']') : ''
        let modified = this.modified ? '*' : ''
        return projPathName + modified
      }
    },
    methods: {
      onClickNew () {
        this.$store.dispatch('NEW_PROJ')
      },

      onClickOpen () {
        this.$store.dispatch('OPEN_PROJ')
      },

      onClickSave () {
        this.$store.dispatch('SAVE_PROJ')
      },

      onClickBMPList () {
        this.$router.push('bmp-list')
      },

      onClickSetting () {
        this.$router.push('setting')
      },

      onClickHelp () {
        this.$router.push('help')
      },

      onClickPublish () {
        this.$store.dispatch('PUBLISH')
      },

      onClickExit () {
        this.$store.dispatch('CONFIRM_EXIT')          
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "assets/photon/css/photon.min.css";

  .toolbar.toolbar-footer {
    margin-bottom: 1px;
  }
  
  .toolbar.toolbar-header {
      margin-top: 1px;
      margin-bottom: 0px;
  }

</style>
