import React from "react";

export default class Login extends React.Component {
    render() {
        return (
            <div>
                <form>
                    <label>Email:</label>&nbsp;<br />
                    <input type="email" id="email" name="email" size="58" /><br /><br />
                    <label>Password:</label>&nbsp;<br />
                    <input type="password" id="password" name="password" size="58" /><br /><br />
                    <input class="btn btn-primary" type="submit" value="Submit" style={{ width: 29.2 + 'em' }} />
                </form>
            </div>
        )
    }
}