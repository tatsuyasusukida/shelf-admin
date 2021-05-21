const querystring = require('querystring')

class Paginator {
  makePage (count, limit, current) {
    return {
      count,
      min: 1,
      max: Math.ceil(count / limit),
      current,
      start: (current - 1) * limit + 1,
      end: Math.min(current * limit, count),
    }
  }

  makePagination (query, page) {
    const body = JSON.parse(JSON.stringify(query))

    if (body['page']) {
      delete body['page']
    }

    const search = '?' + querystring.stringify(body)
    const pages = []
    const around = 1

    for (let i = Math.max(page.current - around, page.min); i <= Math.min(page.current + around, page.max); i += 1) {
      pages.push({
        isCurrent: i === page.current,
        href: search + '&page=' + i,
        number: i,
      })
    }

    if (page.current > page.min + around + 2) {
      pages.unshift({
        isDots: true,
      })
    }

    if (page.current === page.min + around + 2) {
      pages.unshift({
        isCurrent: false,
        href: search + '&page=' + (page.min + 1),
        number: 2,
      })
    }

    if (page.current >= page.min + around + 1) {
      pages.unshift({
        isCurrent: false,
        href: search + '&page=' + page.min,
        number: 1,
      })
    }

    if (page.current < page.max - around - 2) {
      pages.push({
        isDots: true,
      })
    }

    if (page.current === page.max - around - 2) {
      pages.push({
        isCurrent: false,
        href: search + '&page=' + (page.max - 1),
        number: page.max - 1,
      })
    }

    if (page.current <= page.max - around - 1) {
      pages.push({
        isCurrent: false,
        href: search + '&page=' + page.max,
        number: page.max,
      })
    }

    const pagination = {
      previous: {
        isActive: page.current > page.min,
        href: search + '&page=' + (page.current - 1),
      },
      pages: pages,
      next: {
        isActive: page.current < page.max,
        href: search + '&page=' + (page.current + 1),
      },
    }

    return pagination
  }
}

module.exports.Paginator = Paginator
