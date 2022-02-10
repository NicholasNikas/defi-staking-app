import React, {Component} from 'react';
import './App.css'
import NavBar from './NavBar.js'

class App extends Component {

    constructor(props) {
        super(props)
        this.state = {
            account: '0x0'
        }
    }

    render() {
        const { account } = this.state;
        return (
            <div>
                <NavBar account={account}/>
            </div>
        )
    }
}

export default App;
