import { gql } from '@apollo/client'

export const SUBSCRIBE_USER_ADDED = gql`
    subscription {
        newUser {
            name
            age
            married
        }
    }
`

export const SUBSCRIBE_USER_DELETED = gql`
    subscription {
        deleteUser {
            name
        }
    }
`