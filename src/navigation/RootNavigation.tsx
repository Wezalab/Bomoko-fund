import {BrowserRouter as Router,Routes,Route}  from 'react-router-dom'
import { ContactLayout, HomeLayout, ProjectLayout, WorkLayout, VentureLayout, DashboardLayout } from '../pages'
import SingleProjectLayout from '@/pages/SingleProjectLayout'
import FaqLayout from '@/pages/FaqLayout'
import PrivacyPolicyLayout from '@/pages/PrivacyPolicyLayout'
import EditProjectLayout from '@/pages/EditProjectLayout'
import ProfileLayout from '@/pages/ProfileLayout'
import CreateProjectLayout from '@/pages/CreateProjectLayout'
import BusinessPlanLayout from '@/pages/BusinessPlanLayout'
import BusinessPlanEditorLayout from '@/pages/BusinessPlanEditorLayout'
import BusinessPlanSetupLayout from '@/pages/BusinessPlanSetupLayout'
import NotFound from '@/pages/NotFound'
import AuthRedirect from '@/components/AuthRedirect'
import LoginPage from '@/components/LoginPage'
import BusinessPlanWizard from '@/components/BusinessPlanWizard'
import BusinessPlanOverviewNew from '@/components/businessPlan/BusinessPlanOverviewNew'
import BMCLayout from '@/pages/BMCLayout'
import BMCNewLayout from '@/pages/BMCNewLayout'
import BMCWizardLayout from '@/pages/BMCWizardLayout'
import BMCCanvasLayout from '@/pages/BMCCanvasLayout'
import BMCStrategyLayout from '@/pages/BMCStrategyLayout'
import ManageLayout from '@/pages/ManageLayout'
import FinancialsLayout from '@/pages/FinancialsLayout'

function RootNavigation() {

  return (
    <Router>
        <Routes>
            <Route path='/' element={<HomeLayout /> }/>
            <Route path='/projects' element={<ProjectLayout/>} />
            <Route path='/how-it-works' element={<WorkLayout/>} />
            <Route path='/contact-us' element={<ContactLayout />} />
            <Route path="/projects/:id" element={<SingleProjectLayout />}/>
            <Route path="/projects/:id/edit" element={<EditProjectLayout />}/>
            <Route path="/projects/create" element={<CreateProjectLayout />} />
            <Route path="/business-plan" element={<BusinessPlanLayout />} />
            <Route path="/business-plan/editor" element={<BusinessPlanEditorLayout />} />
            <Route path="/business-plan/wizard" element={<BusinessPlanOverviewNew />} />
            <Route path="/business-plan/initial-setup" element={<BusinessPlanWizard />} />
            <Route path="/business-plan/setup" element={<BusinessPlanSetupLayout />} />
            <Route path="/venture" element={<VentureLayout />} />
            <Route path="/dashboard" element={<DashboardLayout />} />
            <Route path="/faq" element={<FaqLayout />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyLayout />} />
            <Route path="/profile" element={<ProfileLayout />} />
            <Route path="/bmc" element={<BMCLayout />} />
            <Route path="/bmc/new" element={<BMCNewLayout />} />
            <Route path="/bmc/wizard" element={<BMCWizardLayout />} />
            <Route path="/bmc/:id" element={<BMCCanvasLayout />} />
            <Route path="/bmc/:id/strategies" element={<BMCStrategyLayout />} />
            <Route path="/manage" element={<ManageLayout />} />
            <Route path="/financials" element={<FinancialsLayout />} />
            <Route path="/auth/google/callback" element={<AuthRedirect />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/*" element={<NotFound />} />
        </Routes>
    </Router>
  )
}

export default RootNavigation