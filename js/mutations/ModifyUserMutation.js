import Relay from 'react-relay';

export default class ModifyUserMutation extends Relay.Mutation {
  static fragments = {
    user: () => Relay.QL`
      fragment on User {
        id
      }
    `,
  };
  getMutation() {
    return Relay.QL`mutation{modifyUser}`;
  }
  getFatQuery() {
    return Relay.QL`
      fragment on ModifyUserPayload {
        user {
          name,
          age
        }
      }
    `;
  }
  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        user: this.props.user.id,
      }
    }];
  }
  getVariables() {
    return {
      id: this.props.user.id,
      name: this.props.name,
      age: this.props.age,
      address: this.props.address,
      email: this.props.email      
    };
  }
  getOptimisticResponse() {
    return {
      user: {
        id: this.props.user.id,
        name: this.props.name,
        age:  this.props.age,
        email: this.props.email,
        address: this.props.address
      },
    };
  }
}
