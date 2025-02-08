import {BrowserRouter as Router,Routes,Route}  from 'react-router-dom'
import { ContactLayout, HomeLayout, ProjectLayout, WorkLayout } from '../pages'
import SingleProjectLayout from '@/pages/SingleProjectLayout'
import FaqLayout from '@/pages/FaqLayout'
import PrivacyPolicyLayout from '@/pages/PrivacyPolicyLayout'
import EditProjectLayout from '@/pages/EditProjectLayout'

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
            <Route path="/faq" element={<FaqLayout />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyLayout />} />
        </Routes>
    </Router>
  )
}

export default RootNavigation