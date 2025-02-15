import CreateProject from "@/components/CreateProject"
import Layout from "./Layout"

function CreateProjectLayout() {
  return (
    <Layout children={<CreateProject />} />
  )
}

export default CreateProjectLayout