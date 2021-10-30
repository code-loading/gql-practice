import {users} from '../Mock_Data'
import { pubsub } from './index';

export const resolvers = {
    Query: {
        getAllUsers() {
            return users;
        }
    },
    Mutation: {
        createUser(parent, args) {
            const newUser = args;
            users.push(newUser);
            pubsub.publish('TRIGGER_NEW_USER', { newUser });
            return newUser
        },
        deleteUser(parent, args) {
            const deletedUser = users.find(({ name }) => name == args.name) //returns an element from the array
            console.log(deletedUser)
            // delete user logic from an Array <users>
            for (var i = users.length - 1; i >= 0; i--) {
                if (deletedUser.name === users[i].name) {
                 users.splice(i, 1);
                }
            }
            pubsub.publish('TRIGGER_DELETED_USER', { deletedUser });
            return deletedUser
        }
    },
    Subscription: {
        newUser: {
            subscribe: () => pubsub.asyncIterator(['TRIGGER_NEW_USER'])
        },
        deletedUser: {
            subscribe: () => pubsub.asyncIterator(['TRIGGER_DELETED_USER'])
        }
    }

};