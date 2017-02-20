import Relay from 'react-relay';

export default class RemoveUserMutation extends Relay.Mutation {
  static fragments = {
    user: () => Relay.QL`
      fragment on User {
        id
      }
    `,
    manager: () => Relay.QL`
      fragment on Manager {
        id
      }
    `,
  };
  getMutation() {
    return Relay.QL`mutation{removeUser}`;
  }
  getFatQuery() {
    return Relay.QL`
      fragment on RemoveUserPayload @relay(pattern: true) {
        deletedUserId,
        manager { id }
      }
    `;
  }
  getConfigs() {
    return [{
      type: 'NODE_DELETE',
      parentName: 'manager',
      parentID: this.props.manager.id,
      connectionName: 'users',
      deletedIDFieldName: 'deletedUserId',
    }];
  }
  getVariables() {
    return {
      id: this.props.user.id,
    };
  }
  getOptimisticResponse() {
    return {
      deletedUserId: this.props.user.id,
      manager: {id: this.props.manager.id},
    };
  }
}
