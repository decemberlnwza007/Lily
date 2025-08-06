import { GoogleAuth } from 'google-auth-library'

const auth = new GoogleAuth({
  scopes: 'https://www.googleapis.com/auth/cloud-platform',
})

async function listModels() {
  const client = await auth.getClient()
  const accessToken = await client.getAccessToken()

  const res = await fetch(
    'https://generativelanguage.googleapis.com/v1beta/models',
    {
      headers: {
        Authorization: `Bearer ${accessToken.token}`,
      },
    },
  )

  const data = await res.json()
  console.log('Available models:', data.models)
}

listModels()
