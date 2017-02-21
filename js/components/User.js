import RemoveUserMutation from '../mutations/RemoveUserMutation'
import ModifyUserMutation from '../mutations/ModifyUserMutation'
import UserInput from './UserInput'

import React from 'react';
import Relay from 'react-relay';
import classnames from 'classnames';

class User extends React.Component {
  state = {
    isEditing: false,
    isSelected: false
  }

  _handleDestroyClick = () => {
    this._removeUser()
  }

  _handleEditClick = () => {
    this._setEditMode(true)
  }

  _handleUserViewClick = () => {
    this.props.onSelection(this)
  }

  _handleUserInputSave = (user) => {
    this._setEditMode(false)
    this.props.relay.commitUpdate(
      new ModifyUserMutation({
        user: this.props.user,
        name: user.name,
        age: user.age,
        address: user.address,
        email: user.email
      })
    )
  }

  _removeUser() {
    this.props.relay.commitUpdate(
      new RemoveUserMutation({
        user: this.props.user,
        manager: this.props.manager
      })
    )
  }

  _setEditMode = (shouldEdit) => {
    this.setState({isEditing: shouldEdit});
  }

  setSelected = (selected) => {
    this.setState({isSelected: selected})
  }

  renderUserInput() {
    return (
      <UserInput
        autoFocus={true}
        className="edit-user"
        onCancel={this._handleTextInputCancel}
        onDelete={this._handleTextInputDelete}
        onSave={this._handleUserInputSave}
        initialName={this.props.user.name}
        initialAge={this.props.user.age}
        initialAddress={this.props.user.address}
        initialEmail={this.props.user.email}
      />
    )
  }

  render() {
    return (
      <li
        className={classnames({
          editing: this.state.isEditing,
          selected: this.state.isSelected
        })}>
        <div className="user-view" onClick={this._handleUserViewClick}>
          <label className="user-age">
            {this.props.user.age}
            <label>years</label>
          </label>
          <label className="user-name">
            {this.props.user.name}
          </label>
          <label className="user-email">
            {this.props.user.email}
          </label>
          <label className="user-address">
            {this.props.user.address}
          </label>
        </div>
        <div className="actions">
          <button
            className="edit"
            onClick={this._handleEditClick}
          >Edit</button>
          <button
            className="destroy"
            onClick={this._handleDestroyClick}
          >Delete</button>
        </div>
        {this.state.isEditing && this.renderUserInput()}
      </li>
    )
  }
}

export default Relay.createContainer(User, {
  fragments: {
    user: () => Relay.QL`
      fragment on User {
        name,
        age,
        address,
        email,
        ${RemoveUserMutation.getFragment('user')},
        ${ModifyUserMutation.getFragment('user')}
      }
    `
  }
})
