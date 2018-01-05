import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './actions.json';

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
 * We need to keep track of action cooldowns continuously and be able to reload
 * an action in the middle of a cooldown if we should switch locations. How do
 * we accomplish this?
 *
 * 1. Lift action state to Game, as Game remains consistent between Location
 *    switches. State would only be the remaining cooldown, since whether the Action
 *    is disabled or not can be inferred via the remaining cooldown (=== 0).
 * 2. We need some way to continuously "count down" so we can load the button at
 *    potentially any cooldown state. A setInterval in Game seems perfect for this.
 *    Each tick of setInterval, the Game will update all remaining cooldowns.
 *
 * Then the flow becomes:
 * 1. An Action is clicked.
 * 2. Action's onClick calls Game's handleClick.
 * 3. One of two things could happen:
 *    a. Game's handleClick calls a setState immediately to change the remaining
 *       cooldown.
 *    b. Game enqueues an update, and a setState in setInterval's function applies
 *       all queued updates every tick. (The Action still disables immediately.)
 *    (b) implies some lag, but ensures consistency. It also implies all actions
 *    should be going through the interval function, so we need to handle that,
 *    too...
 */

 const LOCATIONS = require('./actions.json');

/*
 * Main class.
 */

class Game extends React.Component {
  constructor() {
    super();

    var remainingActionCooldowns = { }

    for(var loc in LOCATIONS) {
      for(var action in LOCATIONS[loc]["actions"]) {
        remainingActionCooldowns[action] = 0;
      }
    }

    var intervalId = setInterval(this.update.bind(this), 1000);

    this.state = {
      money: 0,
      starPoints: 0,
      currentLocation: 'Home',
      remainingActionCooldowns: remainingActionCooldowns
    };
  }

  update() {
    // update available actions

    // update remaining action cooldowns
    var newActionCooldowns = {}
    for(var action in Object.keys(this.state.remainingActionCooldowns)) {
      if(this.state.remainingActionCooldowns[action] > 0) {
        newActionCooldowns[action] = this.state.remainingActionCooldowns[action] - 1;
      }
    }

    this.setState({remainingActionCooldowns: newActionCooldowns});
  }

  handleClick(effects) {
    this.setState({
      money: this.state.money + effects.money[0],
      starPoints: this.state.starPoints + effects.sp[0]
    });
  }

  renderSidebar() {
    return (
      <Sidebar />
    );
  }

  // Lifting state up so Actions will affect things like money and SP.
  renderLocation(location) {
    return (
      <Location name={location} actions={LOCATIONS[location]}
      handleClick={(effects) => this.handleClick(effects)} />
    )
  }

  render() {
    return (
     <div>
       <Row className="stats">
         Money: {this.state.money}, SP: {this.state.starPoints}
       </Row>
       <Row className="game">
         {this.renderSidebar()}
         {this.renderLocation(this.state.currentLocation)}
       </Row>
     </div>
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
  constructor(props) {
    super(props);
    this.state = {
      name: this.props.name,
      actions: this.props.actions,
      log: ["You arrive at home."]    // TODO very hardcoded
    }
  }

  // Ideally, we pass only the elements of Game that the Action needs (e.g.
  // only pass money to "Work").
   renderAction(action) {
     return (
       <Action action={action} notifyLocation={(effects) => this.handleClick(effects)} />
     );
   }

   handleClick(effects) {
     console.log(effects);

     var newLog = this.state.log;
     newLog.push(effects.logText[0]);

     this.setState({log: newLog});

     this.props.handleClick(effects);
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
             {Object.values(this.props.actions).map((action) =>
               this.renderAction(action))
             }
             </ButtonGroup>
           </Col>
           <Col className="log" lg={5} md={5}>
             {this.state.log.join("\n")}
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
       readyText: props.action.readyText,
       waitingText: props.action.waitingText,   // shows when the button is "on cooldown" (e.g. "Working...")
       currentText: props.action.readyText,
       cooldown: props.action.cooldown,
       effects: props.action.effects,
       disabled: false
     };
   }

  //  // Called on initialization and Location switch.
  //  componentWillReceiveProps(nextProps) {
  //    // TODO gotta set those COOOOOLDOOOOOOOWNS
  //    this.setState({currentText: nextProps.readyText});
  //  }

   render() {
     return (
       <Button className="action-button" disabled={this.state.disabled} block onClick={() => this.onClick()}>
          {this.state.currentText}
       </Button>
     )
   }

   resetButton() {
     this.setState({
         currentText: this.state.readyText,
         disabled: false
     });
   }

   onClick() {
     this.setState({
         disabled: true,
         currentText: this.state.waitingText
     });
     setTimeout(this.resetButton.bind(this), this.state.cooldown * 1000);
     console.log(this.state.effects);
     this.props.notifyLocation(this.state.effects);
   }
 }

// ========================================

ReactDOM.render(
  <Screen />,
  document.getElementById('root')
);
