# Turbolinks Prefetch

Turbolinks extends for prefetch links to speeds up your website.

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

## Demo

<img width="715" alt="截屏2020-09-28 17 17 44" src="https://user-images.githubusercontent.com/5518/94414149-92935b00-01ae-11eb-9916-778d7740db98.png">

https://github.com/ruby-china/homeland/commit/e1378468703b8c3cfd7e33a17dc703ff8294a3e9

Visit https://ruby-china.org
