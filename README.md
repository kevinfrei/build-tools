# build-tools

My nodejs build tool, mostly for flow &amp; babel. It's meant to be used as the
`yarn build` step for making flow types work in modules. It produces type-free
`.js` files, typed `.flow` files, and source maps.

See its use (which is pretty much always trivial) in my other repositories'
`package.json` files, such as
[js-freik-utils/package.json](https://github.com/kevinfrei/js-freik-utils/blob/master/package.json)