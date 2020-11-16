import { mount } from '@vue/test-utils'
// import sinon from 'sinon'
import signUpPage from '@/pages/sign-up.vue'

describe('Sign-up Page', () => {
  test('Can Mount?', () => {
    const wrapper = mount(signUpPage)
    expect(wrapper.vm).toBeTruthy()
  })

  describe('Fields Error Text', () => {
    test('Username error', () => {
      const wrapper = mount(signUpPage, {
        data () {
          return {
            errors: {
              username: 'Username is too long'
            }
          }
        }
      })

      const error = wrapper.find('.error')

      expect(error.exists()).toBe(true)
      expect(error.text()).toEqual('Username is too long')
    })

    test('Password error', () => {
      const wrapper = mount(signUpPage, {
        data () {
          return {
            errors: {
              password: 'Passwords do not match'
            }
          }
        }
      })

      const error = wrapper.find('.error')

      expect(error.exists()).toBe(true)
      expect(error.text()).toEqual('Passwords do not match')
    })

    test('Email error', () => {
      const wrapper = mount(signUpPage, {
        data () {
          return {
            errors: {
              email: 'Email is invalid'
            }
          }
        }
      })

      const error = wrapper.find('.error')

      expect(error.exists()).toBe(true)
      expect(error.text()).toEqual('Email is invalid')
    })
  })
})
