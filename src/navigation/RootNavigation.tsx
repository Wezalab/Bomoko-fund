import {BrowserRouter as Router,Routes,Route}  from 'react-router-dom'
import { ContactLayout, HomeLayout, ProjectLayout, WorkLayout } from '../pages'

function RootNavigation() {

  


  return (
    <Router>
        <Routes>
            <Route path='/' element={<HomeLayout /> }/>
            <Route path='/projects' element={<ProjectLayout/>} />
            <Route path='/how-it-works' element={<WorkLayout/>} />
            <Route path='/contact-us' element={<ContactLayout />} />
        </Routes>
    </Router>
  )
}

export default RootNavigation