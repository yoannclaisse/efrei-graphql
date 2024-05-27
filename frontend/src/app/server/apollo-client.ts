import { ApolloClient, NormalizedCacheObject, ApolloCache, InMemoryCache } from "@apollo/client";

const createApolloClient = () => {
    return new ApolloClient({
        uri: "http://localhost:3001/graphql",
        cache: new InMemoryCache()
    });
};

export default createApolloClient;