import React, { Component } from 'react';
import axios from 'axios';
import { STORAGE, authStore, BASKET } from '../../helpers/index';
import { URLConfig } from '../../config/url.config';
import './home.scss';

export class Home extends Component {

    constructor(props) {
        super(props);

        this.state = {
            baskets: [
                { key: BASKET.APPLE, label: BASKET.APPLE, count: 10 },
                { key: BASKET.ORANGE, label: BASKET.ORANGE, count: 10 },
                { key: BASKET.GRAPES, label: BASKET.GRAPES, count: 10 }
            ],
            stacks: [],
            errorMessage: ''
        }
    }

    /**
     * Hook to handle functionlities after component load
     */
    componentDidMount() {
        axios.get(URLConfig.homeDummyURL).then(({ data }) => console.log(data?.message));
    }

    /**
     * Handle on logout request
     */
    onLogout = () => {
        authStore.logout();

        const { history } = this.props;
        history.push('/login');
    };

    /**
     * Method to add the fruits in stack
     * @param {object} basket
     */
    addIntoStack = (basket) => {
        this.setState({
            baskets: this._getUpdatedStack(basket),
            stacks: [...[basket], ...this.state.stacks] // unshift logic
        });
    };

    /**
     * Method to remove the fruits from stack
     * @param {object} basket
     */
    removeFromStack = (basket) => {
        const lastBucket = this.state.stacks[0];

        if (lastBucket?.key === basket.key) {
            this.setState({
                baskets: this._getUpdatedStack(basket, true),
                stacks: this.state.stacks.slice(1, this.state.stacks.length) // shift logic, remove first item
            });
        } else {
            // Enable toast notification
            this.setState({ errorMessage: `${basket.label} is not the top item in stack` });

            setTimeout(() => {
                this.setState({ errorMessage: '' })
            }, 3 * 1000);
        }
    };

    /**
     * Update the basket item count based on the operation
     * @param {object} basket
     * @param {boolean} isAddition
     * @returns {Array}
     */
    _getUpdatedStack = (basket, isAddition = false) => {
        const baskets = this.state.baskets.map(item => {
            if (item.key === basket.key) {
                item.count = isAddition ? item.count + 1 : item.count - 1;
            }
            return item;
        });

        return baskets;
    };

    /**
     * Hook to render the DOM
     */
    render() {
        const username = JSON.parse(sessionStorage.getItem(STORAGE.USER_DETAILS))?.name;

        const toastMessage = <div className={`alert alert-danger ${this.state.errorMessage ? 'show' : ''}`}>{this.state.errorMessage}</div>;

        return (
            <main className="home-page">
                {toastMessage}

                <div className="logout">
                    <span className="username">{username}</span>
                    <button type="button" className="site-btn login-btn" onClick={this.onLogout}>Logout</button>
                </div>

                <section className="home-section">
                    <h4 className="items-title">All Items</h4>
                    <div className="fruits-block">
                        {this.state.baskets.map((basket, i) => {
                            return (
                                <div key={i} className={`basket ${basket.key}`}>
                                    <h5>{basket.label}</h5>
                                    <h5>{basket.count}</h5>
                                    <button type="button"
                                        className={
                                            `action-btn ${basket.count < 1 ? 'disabled' : ''}`
                                        }
                                        onClick={() => this.addIntoStack(basket)} >+</button>
                                    <button type="button"
                                        className={
                                            `action-btn ${basket.count === 10 ? 'disabled' : ''}`
                                        }
                                        onClick={() => this.removeFromStack(basket)} >-</button>
                                </div>
                            );
                        })}

                    </div>

                    <div className="fruits-block basket-block">
                        <div className="basket empty">
                            {this.state.stacks.map((item, i) => {
                                return (
                                    <div key={i} className={`element ${item.key}`}></div>
                                );
                            })}
                        </div>
                    </div>
                </section>
            </main >
        );
    }
}
