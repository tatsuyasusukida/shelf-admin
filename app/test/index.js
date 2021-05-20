const {ConverterTest} = require('../lib/ConverterTest')
const {ImageMakerTest} = require('../lib/ImageMakerTest')
const {InitializerTest} = require('../lib/InitializerTest')

class Main {
  async run () {
    const testcases = [
      new ConverterTest(),
      new ImageMakerTest(),
      new InitializerTest(),
    ]

    for (const testcase of testcases) {
      await testcase.print()
    }
  }
}

if (require.main === module) {
  main()
}

async function main () {
  try {
    await new Main().run()
  } catch (err) {
    console.error(err.message)
    console.debug(err.stack)
  }
}
