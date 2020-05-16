import React, { Component } from 'react';
import axios from 'axios';
import { URLConfig } from '../../config/url.config';
import { authStore } from '../../helpers/index';
import './login.scss';

export class Login extends Component {

    constructor(props) {
        super(props);

        this.state = {
            username: '',
            password: '',
            errorMessage: ''
        };
    }

    /**
     * Hook to handle functions after component loaded
     */
    componentDidMount() {
        authStore.logout(); // Auto logout
    }

    /**
     * Handle the form user inputs
     */
    onInputChange = (event) => {
        // Handle the field validation
        if (!event.target.value) {
            event.target.classList.add('has-error');
        } else {
            event.target.classList.remove('has-error');
        }

        this.setState({ [event.target.name]: event.target.value }); // Update state
    };

    /**
     * Handle the login request
     */
    onLogin = (event) => {
        event.preventDefault();

        const { username, password } = this.state;
        const { history } = this.props;

        axios.post(URLConfig.loginURL, { username, password }).then(({ data }) => {
            if (data?.success) {
                // Set auth tokens in session storage
                authStore.login(data);
                history.push('/home');
            } else {
                // If it is invalid credentials, enable toast notification
                this.setState({ errorMessage: 'UserName or Password is incorrect. Please enter valid inputs' });

                setTimeout(() => {
                    this.setState({ errorMessage: '' })
                }, 3 * 1000);
            }
        });
    };

    /**
     * Hook to render the DOM
     */
    render() {
        const toastMessage = <div className={`alert alert-danger ${this.state.errorMessage ? 'show' : ''}`}>{this.state.errorMessage}</div>;

        return (
            <main className="login-page">
                {toastMessage}

                <section className="login-section">
                    <div className="login-block">
                        <form onSubmit={this.onLogin}>
                            <h3 className="login-title">Login</h3>
                            <div className="form-field">
                                <input
                                    type="text"
                                    className="txt-box"
                                    placeholder="Username"
                                    name="username"
                                    onChange={this.onInputChange} />
                            </div>
                            <div className="form-field">
                                <input
                                    type="password"
                                    className="txt-box"
                                    placeholder="Password"
                                    name="password"
                                    onChange={this.onInputChange} />
                            </div>
                            <button
                                type="submit"
                                className={`site-btn login-btn ${this.state.username && this.state.password ? '' : 'disabled'}`}
                            >Login</button>
                        </form>
                    </div>
                </section>
            </main >
        );
    }
}
