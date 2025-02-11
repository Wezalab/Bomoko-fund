import ProfilePage from "@/components/ProfilePage"
import Layout from "./Layout"

function ProfileLayout() {
  return (
    <Layout children={<ProfilePage />} />
  )
}

export default ProfileLayout