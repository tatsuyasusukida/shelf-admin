<template lang="pug">
  .container-fluid
    h1 注文の削除
    nav.mt-3(aria-label='メニュー')
      .d-flex.flex-wrap.gap-2
        a.btn.btn-outline-secondary(href='../') 戻る

    p.mt-3 注文を削除してもよろしいですか?

    form(role='form')
      .row
        .col
          .d-grid
            button.btn.btn-danger(type='submit' v-on:click.prevent='onClickButtonSubmit') 削除
        .col.order-first
          .d-grid
            a.btn.btn-link(href='../') キャンセル
</template>

<script>
  import BaseMixin from '../mixin/base'

  export default {
    mixins: [BaseMixin],

    methods: {
      async onClickButtonSubmit () {
        const url = this.api + 'submit'
        const options = {method: 'DELETE'}
        const response = await fetch(url, options)
        const body = await response.json()

        if (body.ok) {
          window.location.assign(body.redirect)
        }
      },
    },
  }
</script>