import { mount } from '@vue/test-utils'
// import sinon from 'sinon'
import indexPage from '@/pages/index.vue'

describe('Index Page', () => {
  test('Can Mount?', () => {
    const wrapper = mount(indexPage)
    expect(wrapper.vm).toBeTruthy()
  })
})
