import { useEffect, useState } from 'react'
import './App.css';

import { useQuery, gql } from '@apollo/client'
import { LOAD_USERS } from './GraphQL/Queries'

import { useMutation } from '@apollo/client'
import { CREATE_USER_MUTATION } from './GraphQL/Mutations'
import { DELETE_USER_MUTATION } from './GraphQL';

import { useSubscription } from '@apollo/client'
import { SUBSCRIBE_USER_ADDED } from './GraphQL/Subscriptions'
import { SUBSCRIBE_USER_DELETED } from './GraphQL/Subscriptions'


function App() {

  const [users, setUsers] = useState([])
  const [form, setForm] = useState({ name: '', age: 0, married: false })

  // add user using GraphQl Mutation 
  const [createUser, { error: mutationErr }] = useMutation(CREATE_USER_MUTATION)
  const addUser = () => {
    console.log("form within addUser",form)
    createUser({
      variables: {
        n: form.name,
        a: Number(form.age),
        m: form.married
      }
    })
    if (error) {
      console.log('Error on Create User:',mutationErr)
    }
  }

  // delete user using GraphQL Mutation
  const [deleteUser, {error: dMutationErr}] = useMutation(DELETE_USER_MUTATION)
  const removeUser = () => {
    console.log("removeUser called")
    console.log("form within removeUser",form)
    deleteUser({variables: {
      n: form.name
    }})

    if (error) {
      console.log("Error deleting user, ",dMutationErr)
    }
  }

  // -- GraphQL SUBSCRIPTION -- Adding user
  const { data: userSubsDasta, error: subscriptionError, loading: subscriptionLoader } = useSubscription(SUBSCRIBE_USER_ADDED)
  useEffect(() => {
    userSubsDasta && console.log('userSubsDasta: ', userSubsDasta)
    if (userSubsDasta) {
      const newAddedUser = userSubsDasta['newUser']
      console.log("newAddedUser",newAddedUser)
      const allusers = [...users]     // old users
      allusers.unshift(newAddedUser); // push
      setUsers(allusers)      // re-render
    }
    // logic (todo)
  }, [userSubsDasta])

  // -- GraphQL SUBSCRIPTION -- Deleting user
  const {data: userSubsData, error: dSubscriptionError, loading: dSubscriptionLoader} = useSubscription(SUBSCRIBE_USER_DELETED)
  useEffect(()=> {
    userSubsData && console.log('userSubsData: ',userSubsData)
    if(userSubsData) {
      const userToDelete = userSubsData['deletedUser']
      const allusers = [...users]
      
      for (var i = allusers.length - 1; i >= 0; i--) {
        if (userToDelete.name === allusers[i].name) {
         allusers.splice(i, 1);
        }
      }

      setUsers(allusers)

    }

    if(dSubscriptionError) {
      console.log("subscription deletion error: ",dSubscriptionError)
    }

    if(dSubscriptionLoader){
      console.log("delete sub is loading")
    }
  },[userSubsData])

  // GraphQL Query
  const { error, loading, data } = useQuery(LOAD_USERS)
  useEffect(() => {
    console.log('dataaaa', data)
    if (data) {
      setUsers(data['getAllUsers'])
    }
  }, [data])

// <input type="button" name="delete" value="Delete" onClick={deleteUser}/>

  if (loading) {
    return (<h1>Loading......</h1>)
  }

  const deleteUserButton= (e) => {
    e.preventDefault();
    removeUser()
  }

  return (
    <div className="App">
      <form onChange={({ target }) => {
        const obj = { ...form };
        obj[target.name] = (target.name == 'married') ? target.checked : target.value
        setForm(obj)
      }} onSubmit={(e) => {
        e.preventDefault();
        addUser()
      }}>
      
        <input type="text" name="name" value={form.name} placeholder="Name" />
        <input type="number" name="age" value={form.age} placeholder="Age" />
        <input type="checkbox" name="married" checked={form.married} /> Married
        <input type="submit" value="Add" />
        {//<input type="button" name="delete" value="Delete" onClick={deleteUserButton}/>
        }
        <button onClick={deleteUserButton}> Delete </button> 
      </form>
      <pre>
        {JSON.stringify(users, null, 2)}
      </pre>
        {console.log("log within App.js ",users)}    
        {userSubsData? console.log("sub sees deleted data: ",userSubsData):console.log("no deleted sub")}  
    </div>
  );
}

export default App;

// getAllUser By Query
// Subscription on NewUser
// Mutation CreateUser

// Mutation DELETE
// SUBSCRITIOPN DELETE


// == CACHING ==
  //   createUser({
  //     variables: {
  //       name: '',
  //       age: 26,
  //       married: false
  //     }, refetechQueries:[{
  //          query: LOAD_USERS
  //     }]
  //   })

  // {
  //   variables: {},
  //   update: (store, { data }) => {
  //     const userData = store.readQuery<UsersQuery>({
  //       query: ''
  //     });

  //     store.writeQuery<UsersQuery>({
  //       query: UsersDocument,
  //       data: {
  //         books: [...userData!.users, daya!.createUser]
  //       }
  //     })
  //   }
  // }