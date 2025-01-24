import Layout from './Layout'
import { ContactPage } from '../components'

function ContactLayout() {
  return (
    <Layout children={<ContactPage />} />
  )
}

export default ContactLayout