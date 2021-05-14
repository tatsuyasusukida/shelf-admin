<template lang="pug">
  include ../mixin/requirement

  .container-a4
    nav(aria-label='メニュー')
      .d-print-none
        .mt-3.mb-3.text-end
          button.px-3(type='button' v-on:click.prevent='onClickButtonPrint') 印刷...
    template(v-for='(product, i) of products')
      .paper(v-bind:class="{'is-first': i === 0}")
        +requirement
      .mb-3.d-print-none
</template>


<script>
  import BaseMixin from '../mixin/base'

  export default {
    mixins: [BaseMixin],

    data () {
      return {
        question: null,
        products: null,
      }
    },

    methods: {
      async initialize () {
        const url = this.api + 'initialize'
        const response = await fetch(url)
        const body = await response.json()

        this.question = body.question
        this.products = body.products
      },

      onClickButtonPrint () {
        window.print()
      },
    },
  }
</script>