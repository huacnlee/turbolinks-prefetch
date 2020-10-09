import { Prefetcher } from './prefetcher';

export default class {
  static start(delay) {
    if (!window.Turbolinks) {
      console.error('window.Turbolinks not found, you must import Turbolinks with global.')
      return
    }


    const prefetcher = new Prefetcher(window.Turbolinks.controller)
    prefetcher.start(delay)
  }
}
