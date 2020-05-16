import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { STORAGE } from './app.constant';

export const authStore = {
    isLoggedIn: !!sessionStorage.getItem(STORAGE.USER_DETAILS),

    login(userData) {
        sessionStorage.setItem(STORAGE.USER_DETAILS, JSON.stringify(userData)); // Sets storage
        this.isLoggedIn = true;
    },

    logout() {
        sessionStorage.removeItem(STORAGE.USER_DETAILS); // Remove storage
        this.isLoggedIn = false;
    }
};

export const AuthRoute = ({ component: Component, ...rest }) => {
    return (
        <Route {...rest}
            render={(props) => (authStore.isLoggedIn ? <Component {...props} />
                : <Redirect to='/login' />
            )}
        />
    );
};
