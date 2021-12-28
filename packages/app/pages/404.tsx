import Error from './_error'

export default function Custom404(): JSX.Element {
  return (
    <Error statusCode={404}/>
  )
}
