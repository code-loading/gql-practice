import { useEffect } from 'react'
import axios from 'axios'

const api = axios.create({
    baseURL: 'https://api.github.com',      // Github
    headers: {
        Authorization: `bearer ${process.env.REACT_APP_GITHUB_ACCESS_TOKEN}`,  // access token
    }
});

function GithubAPI() {

    // const fetchData_js = async (organizationName) => {
    //     const QUERY_ORGANIZATION = `query {
    //         organization(login: "${organizationName}") {
    //             name
    //             description
    //             url
    //             createdAt
    //         }
    //         viewer {
    //             login
    //             email
    //             company
    //             repositories(first: 5) {
    //                 edges {
    //                     node {
    //                         name
    //                     }
    //                 }
    //             }
    //         }
    //     }`;

    //     const res = await api.post('/graphql', { query: QUERY_ORGANIZATION })
    //     console.log('GraphQL Response: ', res);
    // }

    const fetchData_ql = async (abc) => {

        const QUERY_ORGANIZATION = `query queryOrganization($organizationName: String!){
            organization(login: $organizationName) {
                name
                description
                url
                createdAt
            }
            viewer {
                login
                email
                company
                repositories(first: 5) {
                    edges {
                        node {
                            name
                        }
                    }
                }
            }
        }`;

        const {data:{data: {organization,viewer}}} = await api.post('/graphql', {
            query: QUERY_ORGANIZATION,
            variables: {
                organizationName: abc
            }
        })
        // const org = res.data.data.organization;
        // const viewer = res.data.data.viewer;
        console.log('GraphQL Response: ', organization,viewer);
    }

    const addStart = async (repositoryId) => {
        const MUTATION_ADD_START = `mutation AddStarToMyRepo($organizationName: ID!) {
            addStar(input: {starrableId: $organizationName}) {
                starrable {
                    viewerHasStarred
                }
            }
        }`;

        const { data } = await api.post('/graphql', {
            variables: {
                // abc: repositoryId
                organizationName: repositoryId
            },
            query: MUTATION_ADD_START,
        })
        console.log('GraphQL Response: ', data);
    }

    useEffect(() => {
        // fetchData_ql("qutbITech")
        // addStart('MDEwOlJlcG9zaXRvcnkzODc1MTIzNjA=')
        addStart("MDEwOlJlcG9zaXRvcnk0NTU2MDA=") //hhvm repo from fb
        // addStart('facebook')
    }, [])



    return (
        <div>

        </div>
    );
}

export default GithubAPI;
