import { HomePage } from "../components"
import Layout from "./Layout"


function HomeLayout() {
  return (
    <Layout children={<HomePage/>} />
  )
}

export default HomeLayout