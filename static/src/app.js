import IamPublicSignin from './ui/iam/public-signin.vue'
import IamPrivateSignout from './ui/iam/private-signout.vue'
import OrderPrivatePrint from './ui/order/private-print.vue'
import OrderPrivateDelete from './ui/order/private-delete.vue'
import QuestionPrivatePrint from './ui/question/private-print.vue'
import QuestionPrivateDelete from './ui/question/private-delete.vue'

class Main {
  async run () {
    const page = this.getPage(window.location.pathname)

    if (page) {
      const vm = new Vue(page)

      await vm.initialize()
      vm.$mount('#main')
    }
  }

  getPage (pathname) {
    if (new RegExp('^/public/iam/signin/$').test(pathname)) {
      return IamPublicSignin
    } else if (new RegExp('^/private/iam/signout/$').test(pathname)) {
      return IamPrivateSignout
    } else if (new RegExp('^/private/order/[0-9]+/print/$').test(pathname)) {
      return OrderPrivatePrint
    } else if (new RegExp('^/private/order/[0-9]+/delete/$').test(pathname)) {
      return OrderPrivateDelete
    } else if (new RegExp('^/private/question/[0-9]+/print/$').test(pathname)) {
      return QuestionPrivatePrint
    } else if (new RegExp('^/private/question/[0-9]+/delete/$').test(pathname)) {
      return QuestionPrivateDelete
    } else {
      return null
    }
  }
}

main()

async function main () {
  try {
    await new Main().run()
  } catch (err) {
    console.error(err.message)
    console.debug(err.stack)
  } 
}
