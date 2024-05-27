import { gql } from "@apollo/client";
import createApolloClient from "@/app/server/apollo-client";

export async function getAllUsers() {

    const client = createApolloClient()
    const { data } = await client.query({
        query: gql`
            query {
                allUsers {
                    id
                    username
                    todos {id}
                }
            }
        `
    });
    console.log('ALL USERS:', data.allUsers)
    return { allUsers: data.allUsers }

}

export async function GetUserWithTodosById(id: number) {
    const client = createApolloClient()
    const { data } = await client.query({
        query: gql`
            query GetUserWithTodosById($id: Int!) {
                userWithTodosById(id: $id) {
                    id
                    username
                    email
                    todos {
                        id
                        title
                        description
                        completed
                        createdAt
                        updatedAt
                    }
                }
            }
        `,
        variables: { "id": id }
    })
    console.log('ALL USERS WITH TODO:', data)
    return { user: data }
}