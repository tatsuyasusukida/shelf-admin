export default {
  data () {
    return {
      api: null,
    }
  },

  created () {
    const {pathname} = window.location
    const home = pathname.split('/').slice(2).map(_ => '..').join('/')
    const api = `${home}/api/v1${pathname}`

    this.api = api
  },

  methods: {
    async initialize () {

    },
  }
}
