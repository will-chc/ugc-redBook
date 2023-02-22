import React, { useState } from 'react';
import { BrowserRouter as Router, Redirect, Route, Switch } from "react-router-dom";
import Main from "../page/Main";
import FollowPage from "../page/Follow";
import Layout from "../components/Layout";
import { Button, Modal } from 'antd';
const RouterPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
    return (
        <Router>
            <Switch>
                <Route
                    path="/"
                    render={() => (
                        <Layout>
                            <Switch>
                                <Route path='/follow' component={FollowPage} />
                                <Route path='/' component={Main} />
                            </Switch>
                        </Layout>
                    )}
                />
            </Switch>
        </Router>
    );
};
export default RouterPage;
