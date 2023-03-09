import React from 'react';
import { BrowserRouter as Router, Redirect, Route, Switch } from "react-router-dom";
import Main from "../page/Main";
import CreatePage from '../page/Create';
import DataChart from '../page/DataChart';
import Layout from "../components/Layout";
import UserPage from '../page/UserPage';
const RouterPage:React.FC = () => {
    return (
        <Router>
            <Switch>
                <Route
                    path="/"
                    render={() => (
                        <Layout>
                            <Switch>
                                <Route path='/create' component={CreatePage} />
                                <Route path='/explore' component={Main} />
                                <Route path='/user_page' component={UserPage} />
                                <Route path='/data_viewing' component={DataChart} />
                                <Redirect to="/explore" />
                            </Switch>
                        </Layout>
                    )}
                />
            </Switch>
        </Router>
    );
};
export default RouterPage;
