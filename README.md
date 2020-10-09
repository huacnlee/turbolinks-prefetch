# Turbolinks Prefetch

[Turbolinks](https://github.com/turbolinks/turbolinks) extend for prefetch links to speeds up your website.

[中文介绍与说明](https://ruby-china.org/topics/40471)

## WorkFlow

```
hover --> [prefetch] --<no cache>--> [XHR fetch] -> [Turbolinks cache.put]
              |
          <exist cache / in fetching>
              |
            ignore

click --<check cache>-- exist --> [isPrefetch] -> [Turbolinks.visit advance] ---> [render page]
             |                         |                 |
             |                         |                 --async-> [fetch background] -> [render if updated]
             |                         |
             |                       <Yes>
             |                         |--- [Turbolinks.visit restore] --> render -> nothing
          No cahce
             |
             ---> [Turbolinks.visit]
```

## Installation

```bash
$ yarn add turbolinks-prefetch
```

## Usage

```js
import Turbolinks from 'turbolinks';
window.Turbolinks = Turbolinks;

import TurbolinksPrefetch from 'turbolinks-prefetch';
TurbolinksPrefetch.start();
```

Prefetch request will send `Purpose: prefetch` header, so you may need this to ignore some thing.

For example views count increment:

```rb
class TopicsController < ApplicationController
  def show
    if request.headers["Purpose"] != "prefetch"
      # Ignore hit counter for prefetch request
      @topic.increment_hit
    end
  end
end
```

### Disable prefetch

By default, TurbolinksPrefetch will enable prefetch for all links.

Except:

- Links not have same host (Origin);
- Open in new window links `target="_blank"`;
- The links has `data-remote` attribute;
- The links has `data-method` attribute;
- The links has `data-prefetch="false"` attribute;

If you wants disable prefetch, you can do like this:

```html
<a href="https://google.com">Google</>
<a href="/topics/123" target="_blank">Open in new window</a>
<a href="/topics/123" data-method="PUT" data-remote>Put</a>
<a href="/topics/123" data-method="DELETE">Delete</a>
<a href="/topics/123" data-prefetch="false">Disable by directly</a>
```

## Demo

<img width="715" alt="截屏2020-09-28 17 17 44" src="https://user-images.githubusercontent.com/5518/94414149-92935b00-01ae-11eb-9916-778d7740db98.png">

https://github.com/ruby-china/homeland/commit/e1378468703b8c3cfd7e33a17dc703ff8294a3e9

## Demo site

- [Ruby China](https://ruby-china.org)
- [HackerShare](https://hackershare.dev)
