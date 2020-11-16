import { mount } from '@vue/test-utils'
// import sinon from 'sinon'
import successPage from '@/pages/success.vue'

describe('Success Page', () => {
  test('Can Mount?', () => {
    const wrapper = mount(successPage)
    expect(wrapper.vm).toBeTruthy()
  })
})
