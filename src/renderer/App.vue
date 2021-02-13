<template>
  <div id="app">
    <div class="window">
      <header class="toolbar toolbar-header draggable">
        <h1 class="title">
          位图字体生成器 {{ titleProjPathName }}
        </h1>
        <div class="toolbar-actions">
          <div class="btn-group">
            <button
              class="btn btn-default"
              @click="onClickNew"
            >
              <span class="icon icon-doc-text" />
            </button>
            <button
              class="btn btn-default"
              @click="onClickOpen"
            >
              <span class="icon icon-folder" />
            </button>
            <button
              class="btn btn-default"
              @click="onClickSave"
            >
              <span class="icon icon-floppy" />
            </button>
          </div>

          <div class="btn-group">
            <button
              class="btn btn-default"
              @click="onClickBMPList"
            >
              <span class="icon icon-list" />
            </button>
            <button
              class="btn btn-default"
              @click="onClickSetting"
            >
              <span class="icon icon-tools" />
            </button>
          </div>

          <div class="btn-group">
            <button
              class="btn btn-default"
              @click="onClickPublish"
            >
              <span class="icon icon-publish" />
            </button>
          </div>

          <div class="btn-group pull-right">
            <button
              class="btn btn-default"
              @click="onClickHelp"
            >
              <span class="icon icon-help-circled" />
            </button>
            <button
              class="btn btn-default"
              @click="onClickExit"
            >
              <span class="icon icon-logout" />
            </button>
          </div>
        </div>
      </header>
      <router-view />
      <footer class="toolbar toolbar-footer">
        <h1 class="title" />
      </footer>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import * as path from 'path'

export default {
  name: 'BmfontJs',

  computed: {
    ...mapState({
      projPathName: state => state.App.projPathName,
      modified: state => state.App.modified
    }),
    titleProjPathName () {
      const projPathName = this.projPathName != null ? (' - [' + path.basename(this.projPathName) + ']') : ''
      const modified = this.modified ? '*' : ''
      return projPathName + modified
    }
  },

  mounted () {
    const holder = document.getElementById('app')
    holder.ondragover = (e) => {
      e.preventDefault()
      e.stopPropagation()
    }
    holder.ondrop = (e) => {
      e.preventDefault()
      e.stopPropagation()
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
  .toolbar.toolbar-footer {
    margin-bottom: 1px;
  }

  .toolbar.toolbar-header {
      margin-top: 1px;
      margin-bottom: 0px;
  }

</style>
