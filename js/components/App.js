import React from 'react';
import Relay from 'react-relay';

import AddUserMutation from '../mutations/AddUserMutation';
import UserInput from './UserInput';

class App extends React.Component {
  _handleUserInputSave = (user) => {
    this.props.relay.commitUpdate(
      new AddUserMutation({
        name: user.name,
        age: user.age,
        address: user.address,
        email: user.email,
        manager: this.props.manager
      })
    );
  };
  render() {
    return (
      <div>
        <section className="app">
          <header className="header">
            <h1>Users</h1>
          </header>

          {this.props.children}

        </section>
        <footer className="info">
          <UserInput
            autoFocus={true}
            className="add-user"
            onSave={this._handleUserInputSave}
          />
        </footer>
      </div>
    )
  }
}

export default Relay.createContainer(App, {
  fragments: {
    manager: () => Relay.QL`
      fragment on Manager {
        ${AddUserMutation.getFragment('manager')},
      }
    `,
  }
})
