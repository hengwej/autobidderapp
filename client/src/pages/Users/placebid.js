import React, { Component } from "react";
import "../../css/styles.css";

export default class PlaceBid extends Component {

    render() {
        return (
            <div>
                <form>
                    <label><b>Bidding Amount($):</b></label>&nbsp;
                    <input type="number" id="bid" name="bid" style={{ width: 29.2 + 'em' }} /><br /><br />
                    <input class="btn btn-warning" type="submit" value="Submit" style={{ width: 29.2 + 'em' }} />
                </form>
            </div>
        );
    }
}