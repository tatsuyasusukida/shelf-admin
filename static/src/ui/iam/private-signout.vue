<template lang="pug">
  .container-fluid
    h1 ログアウト
    nav.mt-3(aria-label='メニュー')
      .d-flex.flex-wrap.gap-2
        a.btn.btn-outline-secondary(href='../../') 戻る

    p.mt-3 ログアウトしてもよろしいですか？

    form(role='form')
      .row
        .col
          .d-grid
            button.btn.btn-primary(type='submit' v-on:click.prevent='onClickButtonSubmit') ログアウト
        .col.order-first
          .d-grid
            a.btn.btn-link(href='../../') キャンセル

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
