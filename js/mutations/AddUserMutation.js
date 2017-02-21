import Relay from 'react-relay'

export default class AddUserMutation extends Relay.Mutation {
  static fragments = {
    manager: () => Relay.QL`
      fragment on Manager {
        id
      }
    `
  }

  getMutation() {
    return Relay.QL`mutation{addUser}`;
  }

  getFatQuery() {
    return Relay.QL`
      fragment on AddUserPayload @relay(pattern: true) {
        userEdge,
        manager {
          users {
            edges
          }
        }
      }
    `
  }

  getConfigs() {
    return [{
      type: 'RANGE_ADD',
      parentName: 'manager',
      parentID: this.props.manager.id,
      connectionName: 'users',
      edgeName: 'userEdge',
      rangeBehaviors: () => 'append'
    }];
  }

  getVariables() {
    return {
      name: this.props.name,
      age: this.props.age,
      address: this.props.address,
      email: this.props.email
    };
  }

  getOptimisticResponse() {
    return {
      userEdge: {
        node: {
          name: this.props.name,
          age: this.props.age,
          email: this.props.email,
          address: this.props.address
        },
      },
      manager: {
        id: this.props.manager.id
      }
    }
  }
}
