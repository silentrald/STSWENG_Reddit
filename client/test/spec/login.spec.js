import { mount } from '@vue/test-utils'
// import sinon from 'sinon'
import loginPage from '@/pages/login.vue'

describe('Login Page', () => {
  test('Can Mount?', () => {
    const wrapper = mount(loginPage)
    expect(wrapper.vm).toBeTruthy()
  })
})
