import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Button from 'react-bootstrap/lib/Button';
import ButtonGroup from 'react-bootstrap/lib/ButtonGroup';

/*
 * Represents the screen. While this is the "overarching" class, it isn't the
 * main class of the game; it creates Game, which contains all the game
 * components and variables. This is more for the header, footer, and other
 * miscellaneous elements.
 */

class Screen extends React.Component {
 renderGame() {
   return (
     <Game />
   );
 }

 render() {
   return (
     <Grid className="screen">
       <Row className="game-header">
         IDLE &#9734; IDOL
       </Row>
       {this.renderGame()}
     </Grid>
   );
 }
}

/*
 * Main class.
 */

class Game extends React.Component {
  constructor() {
    super();
    this.state = {
      money: 0,
      starPoints: 0,
      currentLocation: 'home'
    };
  }

  handleClick() {
    this.money += 100;
    alert('You made money!');
  }

  renderSidebar() {
    return (
      <Sidebar />
    );
  }

  // Lifting state up so Actions will affect things like money and SP.
  renderLocation() {
    return (
      <Location value = {
        this.state.money,
        this.state.starPoints,
        this.state.currentLocation
      } handleClick={() => this.handleClick()} />
    )
  }

  render() {
    return (
     <Row className="game">
       {this.renderSidebar()}
       {this.renderLocation()}
     </Row>
   );
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

  // Ideally, we pass only the elements of Game that the Action needs (e.g.
  // only pass money to "Work").
   renderAction(action) {
     return (
       <Action readyText={action} onClick={() => this.props.handleClick()} />
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
       <Button className="action-button" block onClick={() => this.props.onClick()}>
          {this.state.readyText}
       </Button>
     )
   }
 }

// ========================================

ReactDOM.render(
  <Screen />,
  document.getElementById('root')
);
