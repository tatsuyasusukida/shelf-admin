const assert = require('assert')
const querystring = require('querystring')
const {TestBase} = require('../util/TestBase')
const {Paginator} = require('./Paginator')

class PaginatorTest extends TestBase {
  async testMakePage () {
    const paginator = new Paginator()
    const count = 100
    const limit = 20
    const current = 1
    const actual = await paginator.makePage(count, limit, current)
    const expected = {
      count: 100,
      min: 1,
      max: 5,
      current: 1,
      start: 1,
      end: 20,
    }

    assert.deepStrictEqual(actual, expected)
  }

  async testMakePagination () {
    const paginator = new Paginator()
    const query = {keyword: 'keyword'}
    const page = {
      count: 100,
      min: 1,
      max: 5,
      current: 1,
      start: 1,
      end: 20,
    }

    const actual = await paginator.makePagination(query, page)
    const expected = {
      previous: {
        isActive: false,
        href: '?keyword=keyword&page=0',
      },
      pages: [
        {
          isCurrent: true,
          href: '?keyword=keyword&page=1',
          number: 1,
        },
        {
          isCurrent: false,
          href: '?keyword=keyword&page=2',
          number: 2,
        },
        {
          isDots: true,
        },
        {
          isCurrent: false,
          href: '?keyword=keyword&page=5',
          number: 5,
        },
      ],
      next: {
        isActive: true,
        href: '?keyword=keyword&page=2',
      },
    }

    assert.deepStrictEqual(actual, expected)
  }
}

if (require.main === module) {
  main()
}

async function main () {
  try {
    await new PaginatorTest().print()
  } catch (err) {
    console.error(err.message)
    console.debug(err.stack)
  }
}

module.exports.PaginatorTest = PaginatorTest
