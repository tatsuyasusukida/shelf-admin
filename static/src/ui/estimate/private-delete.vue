<template lang="pug">
  .container-fluid
    h1 見積書発行履歴の削除
    nav.mt-3(aria-label='メニュー')
      .d-flex.flex-wrap.gap-2
        a.btn.btn-outline-secondary(href='../') 戻る

    p.mt-3 見積書発行履歴を削除してもよろしいですか?

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
  import DeleteMixin from '../mixin/delete'

  export default {
    mixins: [DeleteMixin],
  }
</script>
