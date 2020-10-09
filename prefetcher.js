export class Prefetcher {
  start(delay = 50) {
    this.delay = delay || this.delay
    document.addEventListener('mouseover', (event) => {
      this.mouseover(event)
    })
  }

  constructor(controller) {
    this.delay = 50
    this.fetchers = {}
    this.doc = document.implementation.createHTMLDocument('prefetch')
    this.xhr = new XMLHttpRequest()
    this.controller = controller
    this.controller.getActionForLink = (link) => {
      return this.getActionForLink(link)
    }
  }

  mouseover(event) {
    const { target } = event;
    if (!target) return
    if (target.hasAttribute('data-remote')) return
    if (target.hasAttribute('data-method')) return
    if (target.getAttribute('data-prefetch') === 'false') return
    if (target.getAttribute('target') === '_blank') return
    const href = target.getAttribute("href") || target.getAttribute("data-prefetch");

    // skip no fetch link
    if (!href) return
    // skip anchor
    if (href.startsWith('#')) return
    // skip outside link
    if (href.includes("://") && !href.startsWith(window.location.origin)) return

    if (this.prefetched(href)) return
    if (this.prefetching(href)) return
    this.cleanup(event, href)
    if (event.target) {
      event.target.addEventListener('mouseleave', (event) => this.mouseleave(event, href))
    }
    this.fetchers[href] = setTimeout(() => this.prefetch(href), this.delay)
  }

  mouseleave(event, href) {
    this.xhr.abort()
    this.cleanup(event, href)
  }

  cleanup(event, href) {
    const element = event.target
    clearTimeout(this.fetchers[href])
    this.fetchers[href] = null
    if (element) {
      element.removeEventListener('mouseleave', (event) => {
        return this.mouseleave(event)
      })
    }
  }

  fetchPage(url, success) {
    const { xhr } = this
    xhr.open('GET', url)
    xhr.setRequestHeader('Purpose', 'prefetch')
    xhr.setRequestHeader('Accept', 'text/html')
    xhr.onreadystatechange = () => {
      if (xhr.readyState !== XMLHttpRequest.DONE) return
      if (xhr.status !== 200) return
      success(xhr.responseText)
    }
    xhr.send()
  }

  prefetchTurbolink(url) {
    const { doc } = this
    this.fetchPage(url, (responseText) => {
      doc.open()
      doc.write(responseText)
      doc.close()
      this.fetchers[url] = null
      const snapshot = window.Turbolinks.Snapshot.fromHTMLElement(doc.documentElement)
      snapshot.isFresh = true
      this.controller.cache.put(url, snapshot)
    })
  }

  prefetch(url) {
    if (this.prefetched(url)) return
    this.prefetchTurbolink(url)
  }

  prefetched(url) {
    const hasSnapshot = location.href === url || this.controller.cache.has(url)
    const snapshot = this.controller.cache.get(url);
    return hasSnapshot && snapshot.isFresh
  }

  prefetching(url) {
    return !!this.fetchers[url]
  }


  isAction(action) {
    return action == "advance" || action == "replace" || action == "restore"
  }

  getActionForLink(link) {
    const { controller } = this;
    const location = controller.getVisitableLocationForLink(link)
    const snapshot = controller.cache.get(location)
    if (snapshot && snapshot.isFresh) {
      snapshot.isFresh = false
      controller.cache.put(link, snapshot)
      return "restore"
    }

    const action = link.getAttribute("data-turbolinks-action")
    return this.isAction(action) ? action : "advance"
  }
}



