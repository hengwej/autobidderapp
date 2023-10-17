import React from "react";
import "../../../css/styles.css";
import "./styles.css";


export default class Logout extends React.Component {

    render() {
        return (
            <div>
                <form>
                    <label>Email:</label>&nbsp;<br />
                    <input type="email" id="email" name="email" size="58" /><br /><br />
                    <label>Password:</label>&nbsp;<br />
                    <input type="password" id="password" name="password" size="58" /><br /><br />
                    <input
                        className="btn btn-primary"
                        type="button"
                        value="Logout"
                        style={{ width: 29.2 + 'em' }}
                        onClick={this.handleLogout}
                    />
                </form>
            </div>
        );
    }
}
