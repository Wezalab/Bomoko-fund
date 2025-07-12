import {BrowserRouter as Router,Routes,Route}  from 'react-router-dom'
import { ContactLayout, HomeLayout, ProjectLayout, WorkLayout, VentureLayout } from '../pages'
import SingleProjectLayout from '@/pages/SingleProjectLayout'
import FaqLayout from '@/pages/FaqLayout'
import PrivacyPolicyLayout from '@/pages/PrivacyPolicyLayout'
import EditProjectLayout from '@/pages/EditProjectLayout'
import ProfileLayout from '@/pages/ProfileLayout'
import CreateProjectLayout from '@/pages/CreateProjectLayout'
import BusinessPlanLayout from '@/pages/BusinessPlanLayout'
import BusinessPlanEditorLayout from '@/pages/BusinessPlanEditorLayout'
import NotFound from '@/pages/NotFound'
import AuthRedirect from '@/components/AuthRedirect'

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
            <Route path="/venture" element={<VentureLayout />} />
            <Route path="/faq" element={<FaqLayout />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyLayout />} />
            <Route path="/profile" element={<ProfileLayout />} />
            <Route path="/auth/google/callback" element={<AuthRedirect />} />
            <Route path="/*" element={<NotFound />} />
        </Routes>
    </Router>
  )
}

export default RootNavigation