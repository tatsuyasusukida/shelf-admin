<template lang="pug">
  .container-fluid
    h1.mt-3 ログイン
    form(role='form')
      .form-group.mb-3
        label.form-label(for='username') ユーザー名
        input.form-control(type='email' name='username' id='username' aria-required='true' v-model='form.username' v-bind:aria-invalid='validation.username.ok === false' v-bind:aria-describedby="validation.username.ok === false && 'usernameValidation'" v-bind:class="{'is-invalid': validation.username.ok === false}")
        p.invalid-feedback(id='usernameValidation')
          template(v-if='validation.username.isNotEmpty === false')
            | ユーザー名をご入力ください。
      .form-group.mb-3
        label.form-label(for='password') パスワード
        .input-group
          input.form-control(v-bind:type="showPassword ? 'text' : 'password'" name='password' id='password' aria-required='true' v-model='form.password' v-bind:aria-invalid='validation.password.ok === false' v-bind:aria-describedby="validation.password.ok === false && 'passwordValidation'" v-bind:class="{'is-invalid': validation.password.ok === false}")
          button.btn.btn-outline-secondary(type='button' v-bind:aria-label="showPassword ? 'パスワードを非表示にする' : 'パスワードを表示する'" v-on:click.prevent='onClickButtonPassword')
            template(v-if='showPassword') 非表示
            template(v-if='!showPassword') 表示
        p.invalid-feedback(id='passwordValidation' v-bind:class="{'d-block': validation.password.ok === false}")
          template(v-if='validation.password.isNotEmpty === false')
            | パスワードをご入力ください。
          template(v-if='validation.password.isAuthenticated === false')
            | ユーザー名またはパスワードをご確認ください。
      .d-grid
        button.btn.btn-primary(type='submit' v-on:click.prevent='onClickButtonSubmit') ログイン
</template>


<script>
  import BaseMixin from '../mixin/base'

  export default {
    mixins: [BaseMixin],

    data () {
      return {
        form: null,
        validation: null,
        showPassword: false,
      }
    },

    methods: {
      async initialize () {
        const url = this.api + 'initialize' + window.location.search
        const response = await fetch(url)
        const body = await response.json()

        this.form = body.form
        this.validation = body.validation
      },

      onClickButtonPassword () {
        this.showPassword = !this.showPassword
      },

      async onClickButtonSubmit () {
        const url = this.api + 'validate'
        const options = {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({form: this.form}),
        }

        const response = await fetch(url, options)
        const body = await response.json()

        this.validation = body.validation

        if (this.validation.ok) {
          const url = this.api + 'submit'
          const response = await fetch(url, options)
          const body = await response.json()

          if (body.ok) {
            window.location.assign(body.redirect)
          }
        } else {
          window.scrollTo(0, 0)
        }
      },
    },
  }
</script>