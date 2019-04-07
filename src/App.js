import React, { Component } from 'react';
import './App.scss';
import Part from './components/part';

const partDefinitions = {
  A1: ['vibration', 'thermal', 'radiation'],
  B1: ['vibration', 'radiation'],
  C1: ['thermal', 'radiation', 'humidity'],
  D1: ['vibration', 'thermal', 'radiation', 'humidity'],
  E1: ['humidity']
}

class App extends Component {
  constructor(props) {
    super(props);

    let orders = ['A1', 'C1', 'E1', 'D1', 'C1', 'B1', 'E1'];
    let orderObjects = [];

    orders.forEach((order, index) => {
      orderObjects.push(this.newPartObj(order, index));
    });

    this.state = {
      orders: orderObjects,
      completedOrders: [],
      machines: {
        vibration: [],
        thermal: [],
        humidity: [],
        radiation: []
      }
    }

    this.nextOrder = this.nextOrder.bind(this);
  }

  newPartObj(part, key) {
    let machines = partDefinitions[part];
    let initialTestState = {};
    machines.forEach(machine => {
      initialTestState[machine] = false;
    });
    return { type: part, testState: initialTestState, key: key };
  }

  nextTest(partState) {
    let incompleteTestName = '';
    let incompleteTest = Object.keys(partState.testState).some(testName => {
      incompleteTestName = testName;
      return partState.testState[testName] === false;
    });

    if(incompleteTest) {
      partState.testState[incompleteTestName] = true;
      this.state.machines[incompleteTestName].push(partState);
    } else {
      this.state.completedOrders.push(partState);
    }
  }

  nextOrder() {
    if(this.state.orders.length > 0) {
      let outstandingOrders = this.state.orders;
      let newPart = outstandingOrders.shift();
      let firstMachineForNewPart = partDefinitions[newPart.type][0];
      this.state.machines[firstMachineForNewPart].push(newPart);
    }

    let completedTests = [];
    Object.keys(this.state.machines).forEach(machine => {
      if(this.state.machines[machine].length > 0 && !completedTests.includes(this.state.machines[machine][0])) {
        let nextPart = this.state.machines[machine].shift();
        completedTests.push(nextPart);
        this.nextTest(nextPart);
      };
    });

    console.log(this.state);
    this.setState(this.state);
  }

  render() {
    let newOrders = this.state.orders.map(order => {return <Part partState={order} key={order.key}/>});
    let machines = Object.keys(this.state.machines).map(machine => {
      return (
        <div className={"machine " + machine} key={machine}>
          <div className="machine-name section-title">
            { machine }
          </div>
          <div className="machine-parts">
            { this.state.machines[machine].map(m => {
              return <Part partState={m} key={m.key}/>
            }) }
          </div>
        </div>
      )
    });
    let completedOrders = this.state.completedOrders.map(order => {return <Part partState={order} key={order.key}/>});
    return (
      <div className="App">
        <button onClick={this.nextOrder} className="next-step">Next Step</button>
        <section className="new-orders">
          <div className="section-title">New Orders</div>
          <div className="flex">{ newOrders }</div>
        </section>
        <section className="machines">
          { machines }
        </section>
        <section className="completed-orders">
          <div className="section-title">Completed Orders</div>
          <div className="flex">{ completedOrders }</div>
        </section>
      </div>
    );
  }
}

export default App;
