/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

import {
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from 'graphql';

import {
  connectionArgs,
  connectionDefinitions,
  connectionFromArray,
  fromGlobalId,
  globalIdField,
  mutationWithClientMutationId,
  nodeDefinitions,
} from 'graphql-relay';

import {
  Manager,
  User,
  addUser,
  getManager,
  getUser,
  getUsers,
  modifyUser,
  removeUser,
} from './database';

const {nodeInterface, nodeField} = nodeDefinitions(
  (globalId) => {
    var {type, id} = fromGlobalId(globalId);
    if (type === 'User') {
      return getUser(id)
    } else if (type === 'Manager') {
      return getManager()
    } else {
      return null;
    }
  },
  (obj) => {
    if (obj instanceof User) {
      return userType;
    } else if (obj instanceof Manager) {
      return managerType;
    } else {
      return null;
    }
  }
);

/**
 * Types
 */
const userType = new GraphQLObjectType({
  name: 'User',
  description: 'A user managed by the app',
  fields: () => ({
    id: globalIdField('User'),
    name: {
      type: GraphQLString,
      description: 'Full name of the user',
    },
    age: {
      type: GraphQLInt,
      description: 'Age of the user',
    },
    address: {
      type: GraphQLString,
      description: 'Full address of the user',
    },
    email: {
      type: GraphQLString,
      description: 'E-Mail of the user',
    }
  }),
  interfaces: [nodeInterface],
});

const { connectionType: userConnection, edgeType: GraphQLUserEdge } =
  connectionDefinitions({ name: 'User', nodeType: userType });

const managerType = new GraphQLObjectType({
  name: 'Manager',
  fields: {
    id: globalIdField('Manager'),
    users: {
      description: 'Users managed by manager',
      type: userConnection,
      args: {
        minAge: {
          type: GraphQLInt,
          defaultValue: 0,
        },
        ...connectionArgs
      },
      resolve: (manager, {minAge, ...args}) =>
        connectionFromArray(getUsers({minAge}), args),
    }
  },
  interfaces: [nodeInterface],
});

/**
 * Mutations
 */
const addUserMutation = mutationWithClientMutationId({
  name: 'AddUser',
  inputFields: {
    name: { type: new GraphQLNonNull(GraphQLString) },
    age: { type: new GraphQLNonNull(GraphQLInt) },
    email: { type: new GraphQLNonNull(GraphQLString) },
    address: { type: new GraphQLNonNull(GraphQLString) }
  },
  outputFields: {
    userEdge: {
      type: GraphQLUserEdge,
      resolve: ({localId}) => {
        const user = getUser(localId);
        return {
          cursor: cursorForObjectInConnection(getUsers(), user),
          node: user,
        };
      },
    },
    manager: {
      type: managerType,
      resolve: () => getManager(),
    },
  },
  mutateAndGetPayload: ({name, age, address, email}) => {
    const localId = addUser({name, age, address, email})
    return {localId};
  },
});

const removeUserMutation = mutationWithClientMutationId({
  name: 'RemoveUser',
  inputFields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
  },
  outputFields: {
    deletedUserId: {
      type: GraphQLID,
      resolve: ({id}) => id,
    },
    manager: {
      type: managerType,
      resolve: () => getManager(),
    },
  },
  mutateAndGetPayload: ({id}) => {
    const localTodoId = fromGlobalId(id).id;
    removeUser(localTodoId);
    return {id};
  },
});

const modifyUserMutation = mutationWithClientMutationId({
  name: 'ModifyUser',
  inputFields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    age: { type: new GraphQLNonNull(GraphQLInt) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    address: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) }
  },
  outputFields: {
    user: {
      type: userType,
      resolve: ({localId}) => getUser(localId),
    },
  },
  mutateAndGetPayload: ({id, name, age, address, email}) => {
    const localId = fromGlobalId(id).id;
    modifyUser({id: localId, name, age, address, email});
    return {localId};
  },
});


const queryType = new GraphQLObjectType({
  name: 'Root',
  fields: () => ({
    node: nodeField,
    manager: {
      type: managerType,
      resolve: () => getManager()
    },
  }),
});

const mutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addUser: addUserMutation,
    removeUser: removeUserMutation,
    modifyUser: modifyUserMutation
  },
});

export var Schema = new GraphQLSchema({
  query: queryType,
  mutation: mutationType
});
