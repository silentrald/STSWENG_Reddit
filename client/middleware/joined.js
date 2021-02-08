export default async function ({ $auth, params, $axios, redirect }) {
  if ($auth.user) {
    const { station: name } = params
    const station = await $axios.get(`/api/station/id/${name}`)
    const { joined } = station.data
    if (!joined) {
      redirect(`/s/${name}`)
    }
  } else {
    redirect('/login')
  }
}
