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
