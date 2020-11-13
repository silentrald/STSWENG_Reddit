export const state = () => ({
  token: undefined,
  username: undefined,
  fname: undefined,
  lname: undefined,
  gender: undefined,
  birthday: undefined,
  bio: undefined,
  fame: 0
})

export const mutations = {
  setToken (state, token) {
    if (typeof (token) === 'string') {
      state.token = token
    }
  },

  setUser (state, user) {
    state.username = user.username
    state.fname = user.fname
    state.lname = user.lname
    state.gender = user.gender
    state.birthday = user.birthday
    state.bio = user.bio
    state.fame = user.fame
  },

  clearUser (state) {
    state.token = undefined
    state.username = undefined
    state.fname = undefined
    state.lname = undefined
    state.gender = undefined
    state.birthday = undefined
    state.bio = undefined
    state.fame = 0
  }
}
