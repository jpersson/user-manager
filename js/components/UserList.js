import React from 'react'
import Relay from 'react-relay'

import User from './User'

class UserList extends React.Component {
  state = {
    minAge: 0,
    selectedUser: null
  }

  _handleFilterChange = (event) => {
    this.state.minAge = event.target.checked ? 30 : 0
    this.props.relay.setVariables({
      minAge: this.state.minAge
    })
  }

  _handleSelectionChange = (userComponent) => {
    if(this.state.selectedUser === userComponent) {
      userComponent.setSelected(false)
      this.setState({selectedUser: null})
    }
    else {
      if(this.state.selectedUser) {
        this.state.selectedUser.setSelected(false)
      }
      userComponent.setSelected(true)
      this.setState({selectedUser: userComponent})
    }
  }

  _renderUsers() {
    return this.props.manager.users.edges.map(edge =>
      <User
        key={edge.node.id}
        user={edge.node}
        manager={this.props.manager}
        onSelection={this._handleSelectionChange}
      />
    )
  }
  render() {
    return (
      <section>
        <div className="list-filters">
          <input
            id="min_age_checkbox"
            type="checkbox"
            checked={this.state.minAge == 30}
            className="toggle"
            onChange={this._handleFilterChange}
          />
          <label htmlFor="min_age_checkbox">Only users over 30</label>
        </div>
        <ul className="main user-list">
          {this._renderUsers()}
        </ul>
      </section>
    )
  }
}

export default Relay.createContainer(UserList, {
  initialVariables: {
    minAge: 0,
  },
  prepareVariables({minAge}) {
    return {
      minAge: minAge < 0 ? 0 : minAge,
    }
  },
  fragments: {
    manager: () => Relay.QL`
      fragment on Manager {
        users(first: 100, minAge: $minAge) {
          edges {
            node {
              id,
              ${User.getFragment('user')}
            }
          }
        }
      }
    `,
  }
})
