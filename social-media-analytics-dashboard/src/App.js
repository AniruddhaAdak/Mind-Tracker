import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Header from './components/common/Header';
import Sidebar from './components/common/Sidebar';
import Footer from './components/common/Footer';
import Dashboard from './components/dashboard/Dashboard';
import './assets/styles/main.css';

const App = () => {
    return (
        <Router>
            <div className="app-container">
                <Header />
                <Sidebar />
                <main className="main-content">
                    <Switch>
                        <Route path="/" component={Dashboard} />
                    </Switch>
                </main>
                <Footer />
            </div>
        </Router>
    );
};

export default App;