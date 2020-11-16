import { resolve } from 'path'
import { Nuxt, Builder } from 'nuxt'
import { JSDOM } from 'jsdom'

// We keep the nuxt and server instance
// So we can close them at the end of the test
let nuxt = null

// Init Nuxt.js and create a server listening on localhost:4000
beforeAll(async () => {
  const config = {
    dev: false,
    rootDir: resolve(__dirname, '../..')
  }
  nuxt = new Nuxt(config)
  await new Builder(nuxt).build()
  await nuxt.server.listen(4000, 'localhost')
}, 30000)

// Example of testing only generated html
test('Route / exits and render HTML', async () => {
  const context = {}
  const { html } = await nuxt.server.renderRoute('/', context)
  console.log(html)
})

// Example of testing via dom checking
test('Route / exits and render HTML with CSS applied', async () => {
  const context = {}
  const { html } = await nuxt.server.renderRoute('/', context)
  const { window } = new JSDOM(html).window
  // const element = window.document.querySelector('.red')
  console.log(window)
})

// Close server and ask nuxt to stop listening to file changes
afterAll(() => {
  nuxt.close()
})
