import React from "react";

export default class SignUp extends React.Component {
    render() {
        return (
            <div>
                <form>
                    <label>First Name:</label>&nbsp;<br />
                    <input type="text" id="fname" name="fname" size="58" /><br /><br />
                    <label>Last Name:</label>&nbsp;<br />
                    <input type="text" id="lname" name="lname" size="58" /><br /><br />
                    <label>Address:</label>&nbsp;<br />
                    <input type="text" id="address" name="address" size="58" /><br /><br />
                    <label>Phone Number:</label>&nbsp;<br />
                    <input type="number" id="pnum" name="pnum" style={{width: 29.2 +'em'}} /><br /><br />
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