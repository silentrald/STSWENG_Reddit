export default function ({ $auth, next }) {
  if (!$auth.user) {
    next('/login')
  }
}
