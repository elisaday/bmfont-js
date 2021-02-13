<template>
  <div class="window-content">
    <div class="container">
      <p>
        点击
        <button
          class="btn btn-default"
          @click="onClickSetting"
        >
          <span class="icon icon-tools" />
        </button>
        切换到设置面板，设置好各项参数
      </p>
      <p>
        点击
        <button
          class="btn btn-default"
          @click="onClickBMPList"
        >
          <span class="icon icon-list" />
        </button>
        切换到图片列表，编辑字符图片
      </p>
      <p>
        点击
        <button class="btn btn-default">
          <span class="icon icon-publish" />
        </button>
        发布字体配置和合并后的贴图
      </p>
      <p>
        点击
        <button
          class="btn btn-default"
          @click="onClickHelp"
        >
          <span class="icon icon-help-circled" />
        </button>
        返回这里的帮助页面
      </p>
    </div>

    <div class="copyright">
      <!-- <img src="@/assets/avatar.png"> -->
      <img src="@/assets/avatar.png">
      <div
        class="link"
        @click="onClickGithub"
      >
        <span class="icon icon-github" />
        Github
      </div>
      <div
        class="link"
        @click="onClickEmail"
      >
        <span class="icon icon-mail" />
        E-Mail
      </div>
    </div>
  </div>
</template>

<script>
import { shell } from 'electron'

export default {
  name: 'Help',
  computed: {
  },
  mounted () {
  },
  methods: {
    onClickBMPList () {
      this.$router.push('bmp-list')
    },

    onClickSetting () {
      this.$router.push('setting')
    },

    onClickHelp () {
      this.$router.push('help')
    },

    onClickGithub () {
      shell.openExternal('https://github.com/elisaday/bmfont-js')
    },

    onClickEmail () {
      shell.openExternal('mailto:zebbey@gmail.com')
    }
  }
}
</script>

<style lang="scss" scoped>
  .window-content {
    flex-direction: column;
    flex-wrap: nowrap;
    margin: 20px;
  }

  .container {
    flex-grow: 1;
  }

  .container p {
    font-size: 1.2em;
  }

  .copyright {
    display: flex;
    justify-content: space-around;
    align-items: flex-end;
    font-size: 1.2em;
  }

  .copyright img {
    border-radius: 3em;
    width: 6em;
    height: auto;
  }

  .copyright .link {
    padding: 0 5px;
    color: #555;
  }

  .copyright .link:hover {
    border-radius: 4px;
    color: #444;
    background: #eee;
  }

</style>
