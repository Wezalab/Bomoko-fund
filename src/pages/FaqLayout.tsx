import Layout from "./Layout"

function FaqLayout() {
  return (
    <Layout children={<FaqLayout />} />
  )
}

export default FaqLayout