import React from "react";
import "../../css/styles.css";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

export default class Home extends React.Component {
    render() {
        return (
            <div class="navbar navbar-expand-lg navbar-light" id="mainNav">
                <a style={{ position: "relative", right: 80 + 'px', bottom: 260 + 'px', fontSize: 25 + 'px', color: "white" }} class="navbar-brand" href="#page-top">Auctions</a>
                <Container>
                    <Row>
                        <Col md={4}>
                            <Card>
                                <Card.Body>
                                    <Card.Title>Card 1</Card.Title>
                                    <Card.Text>
                                        This is some text within Card 1.
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={4}>
                            <Card>
                                <Card.Body>
                                    <Card.Title>Card 2</Card.Title>
                                    <Card.Text>
                                        This is some text within Card 2.
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={4}>
                            <Card>
                                <Card.Body>
                                    <Card.Title>Card 3</Card.Title>
                                    <Card.Text>
                                        This is some text within Card 3.
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        )
    }
}