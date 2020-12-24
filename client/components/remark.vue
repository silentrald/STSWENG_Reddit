<template>
  <div>
    <!-- BUG: Might cause an XSS Attack -->
    <!-- eslint-disable-next-line vue/no-v-html -->
    <div v-html="html" />
  </div>
</template>

<script>
const unified = require('unified')
const markdown = require('remark-parse')
const styleGuide = require('remark-preset-lint-markdown-style-guide')
const remark2rehype = require('remark-rehype')
const html = require('rehype-stringify')

export default {
  data () {
    return {
      html: 'Sample Post'
    }
  },
  beforeMount () {
    this.loadPost()
  },
  methods: {
    async loadPost () {
      const md = this.$slots.default[0].text.trim()
      const file = await unified()
        .use(markdown)
        .use(styleGuide)
        .use(remark2rehype)
        .use(html)
        .process(md)
      this.$set(this, 'html', String(file))
    }
  }
}
</script>

<style>

</style>
