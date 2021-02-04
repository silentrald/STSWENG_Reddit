export default async function ({ $auth, params, $axios, redirect }) {
  if ($auth.user) {
    const {
      station: name,
      post
    } = params
    const res = await $axios.get(`/api/post/${post}`)
    const { author } = res.data.post
    if (author !== $auth.user.username) {
      redirect(`/s/${name}/post/${post}`)
    }
  } else {
    redirect('/login')
  }
}
