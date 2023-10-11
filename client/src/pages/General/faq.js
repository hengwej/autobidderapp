import React from "react";
import Header from "../../components/Header";


export default class FAQ extends React.Component {
    render() {
        return (
            <div>


                <a
                    style={{ margin: "20px 20px 0", fontSize: "25px", color: "white" }}
                    className="navbar-brand"
                    href="#page-top"
                >
                    FAQ
                </a>
                <Header headerText="Contact us" />
            </div>
        )
    }
}