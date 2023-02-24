import React from 'react';
import { BrowserRouter as Router, Redirect, Route, Switch } from "react-router-dom";
import Main from "../page/Main";
import FollowPage from "../page/Follow";
import CreatePage from '../page/Create';
import Layout from "../components/Layout";
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
