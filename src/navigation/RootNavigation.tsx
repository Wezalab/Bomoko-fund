import {BrowserRouter as Router,Routes,Route}  from 'react-router-dom'
import { ContactLayout, HomeLayout, ProjectLayout, WorkLayout } from '../pages'
import SingleProjectLayout from '@/pages/SingleProjectLayout'
import FaqLayout from '@/pages/FaqLayout'

function RootNavigation() {

  return (
    <Router>
        <Routes>
            <Route path='/' element={<HomeLayout /> }/>
            <Route path='/projects' element={<ProjectLayout/>} />
            <Route path='/how-it-works' element={<WorkLayout/>} />
            <Route path='/contact-us' element={<ContactLayout />} />
            <Route path="/projects/:id" element={<SingleProjectLayout />}/>
            <Route path="/faq" element={<FaqLayout />} />
        </Routes>
    </Router>
  )
}

export default RootNavigation