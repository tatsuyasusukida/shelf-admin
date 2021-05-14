class Initializer {
  makeFormIamSignin () {
    return {
      username: '',
      password: '',
    }
  }

  makeOptionsProductColor () {
    return [
      {value: 'ナチュラル', text: 'ナチュラル', background: '#c4b295'},
      {value: 'ホワイト', text: 'ホワイト', background: '#ebe5d7'},
      {value: 'ブラウン', text: 'ブラウン', background: '#573d2b'},
      {value: 'ブラック', text: 'ブラック', background: '#322e2f'},
    ]
  }
}

module.exports.Initializer = Initializer
