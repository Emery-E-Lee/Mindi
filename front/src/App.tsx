import React from 'react';
import './App.css';
import SignIn from 'pages/User/SignIn';
import SignUp from 'pages/User/SignUp';
import Posting from 'pages/Diary/Posting';
import Header from 'components/modules/header/Header';
import EITest from 'pages/EITest/EITest';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import EITestResult from 'components/modules/EITest/EITestResult';
import Main from 'components/modules/main/Main';
import SnackbarContainer from 'components/modules/snackbar/SnackbarContainer';
import Result from 'components/modules/diary-result/Result';

const App: React.FC = () => {
  return (
    <div className='App'>
      <Router>
        <Routes>
          <Route path='/sign-in' element={<SignIn />} />
          <Route path='/sign-up' element={<SignUp />} />
          <Route path='/diary-posting' element={<Posting />} />
          <Route path='/diary-posting/result' element={<Result />} />
          <Route path='/ei-test' element={<EITest />} />
          <Route path='/ei-test/result' element={<EITestResult />} />
          <Route path='/main' element={<Main />} />
        </Routes>
      </Router>
      <SnackbarContainer />
    </div>
  );
};

export default App;
