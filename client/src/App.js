import './App.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';

import PageTemplate from './templates/page-template';

import {SignIn, About, Home, Instrument, SignUp, NotFound} from './pages';

function App() {
  return (
    <Router>
            <PageTemplate>
                <Routes>
                    <Route exact path='/' element={<Home />} />
                    <Route exact path='/login' element={<SignIn />} />
                    <Route exact path='/signup' element={<SignUp />} />
                    <Route exact path='/instrument' element={<Instrument />} />
                    <Route exact path='/about' element={<About />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </PageTemplate>
        </Router>
  );
}

export default App;
