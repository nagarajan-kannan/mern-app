import React from 'react'
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { AuthRoute } from './helpers/index';
import { Login, Home } from './views/index';

// Router config
export const Router = () => {
    return (
        <BrowserRouter>
            <Switch>
                <Route exact path="/">
                    <Redirect to="/home" />
                </Route>

                <Route path="/login" component={Login} />
                <AuthRoute path="/home" component={Home} />

                <Route path="*">
                    <Redirect to="/home" />
                </Route>
            </Switch>
        </BrowserRouter>
    );
}
