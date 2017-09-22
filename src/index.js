import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Button from 'react-bootstrap/lib/Button';
import ButtonGroup from 'react-bootstrap/lib/ButtonGroup';

/*
 *  An Action is anything that can be done ingame. It renders as a button.
 *  They need to do something eventually...and they need to be prepopulated
 *  from some kind of static list.
 */
 class Action extends React.Component {
   constructor(props) {
     super(props);
     this.state = {
       readyText: props.readyText,
       waitingText: null   // shows when the button is "on cooldown" (e.g. "Working...")
     }
   }

   render() {
     return (
       <Button className="action-button" block>{this.state.readyText}</Button>
     )
   }
 }

class Sidebar extends React.Component {

   render() {
     return (
       <Col className="sidebar" lg={2} md={2}>
         <ButtonGroup vertical block>
           <Button className="menu-button" bsStyle="primary" block>Home</Button>
           <Button className="menu-button" block>Downtown</Button>
           <Button className="menu-button" block>Talent Agency</Button>
           <Button className="menu-button" block>Studio</Button>
           <Button className="menu-button" block>Manager Profile</Button>
           <Button className="menu-button" block>Idolpedia</Button>
         </ButtonGroup>
       </Col>
     );
   }
 }

class Location extends React.Component {
   renderAction(action) {
     return (
       <Action readyText={action} />
     );
   }

   render() {
     return (
       <Col className="location" lg={10} md={10}>
         <Row className="location-header">
           Home
         </Row>
         <Row className="location-content">
           <Col className="action-list" lg={5} md={5}>
             <ButtonGroup vertical block>
               {this.renderAction("Work")}
               {this.renderAction("Buy clothes online")}
               {this.renderAction("Research idols")}
             </ButtonGroup>
           </Col>
           <Col className="log" lg={5} md={5}>
             You arrived at home.
           </Col>
         </Row>
       </Col>
     )
   }
}

class GameContainer extends React.Component {
  renderSidebar() {
    return (
      <Sidebar />
    );
  }

  renderLocation() {
    return (
      <Location />
    )
  }

  render() {
    return (
     <Row className="game-container">
       {this.renderSidebar()}
       {this.renderLocation()}
     </Row>
   );
 }
}

 /*
  * A main class, more or less. The goal right now is to break down the horrific
  * render function into smaller classes.
  */

class Game extends React.Component {
  renderGameContainer() {
    return (
      <GameContainer />
    );
  }

  render() {
    return (
      <Grid className="screen">
        <Row className="game-header">
          IDLE &#9734; IDOL
        </Row>
        {this.renderGameContainer()}
      </Grid>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
