import CreateProject from "@/components/CreateProject"
import DashboardSidebar from '@/components/shared/DashboardSidebar';

function CreateProjectLayout() {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <DashboardSidebar />
      <div className="flex-1 ml-[64px] overflow-auto">
        <CreateProject />
      </div>
    </div>
  )
}

export default CreateProjectLayout
