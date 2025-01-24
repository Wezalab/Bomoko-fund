import Layout from './Layout'
import { ProjectPage } from '../components'

function ProjectLayout() {
  return (
    <Layout children={<ProjectPage />} />
  )
}

export default ProjectLayout