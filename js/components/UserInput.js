import React from 'react'
import ReactDOM from 'react-dom'

export default class UserInput extends React.Component {
  state = {
    isEditing: false,
    name: this.props.initialName || '',
    age: this.props.initialAge || '0',
    address: this.props.initialAddress || '',
    email: this.props.initialEmail || '',
  }

  componentDidMount() {
    ReactDOM.findDOMNode(this).focus()
  }

  _commitChanges = () => {
    this.setState({name: '', age: 0, address: '', email: ''})
    this.props.onSave({
      name: this.state.name,
      age: this.state.age,
      email: this.state.email,
      address: this.state.address
    })
  }

  _handleChange = (event) => {
    const target = event.target
    const value = target.value
    const name = target.name

    this.setState({[name]: value})
  }

  render() {
    return (
      <div className={this.props.className}>
        <div className="field-container">
          <label>Name</label>
          <input
            name="name"
            onChange={this._handleChange}
            value={this.state.name}
          />
        </div>
        <div className="field-container">
          <label>E-Mail</label>
          <input
            name="email"
            type="email"
            onChange={this._handleChange}
            value={this.state.email}
          />
        </div>
        <div className="field-container">
          <label>Address</label>
          <input
            name="address"
            onChange={this._handleChange}
            value={this.state.address}
          />
        </div>
        <div className="field-container">
          <label>Age</label>
          <input
            name="age"
            type="number"
            min="0"
            max="200"
            value={this.state.age}
            onChange={this._handleChange}
          />
        </div>
        <button onClick={this._commitChanges}>
          {this.props.className=='edit-user'?'Save':'Add'}
        </button>
      </div>
    )
  }
}
