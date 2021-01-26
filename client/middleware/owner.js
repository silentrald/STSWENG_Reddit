export default function ({ $auth, params, redirect }) {
  if ($auth.user) {
    const { user: username } = params
    if (username !== $auth.user.username) {
      redirect(`/u/${username}`)
    }
  } else {
    redirect('/login')
  }
}
