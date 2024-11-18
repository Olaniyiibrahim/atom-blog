import { faker } from "@faker-js/faker";
import { createContext, memo, useContext, useMemo, useState } from "react";

const postContext = createContext();

function createRandomPost() {
    return {
        title: `${faker.hacker.adjective()} ${faker.hacker.noun()}`,
        body: faker.hacker.phrase(),
    };
}

const PostProvider = memo( function PostProvider({children}){
        const [posts, setPosts] = useState(() =>
        Array.from({ length: 30 }, () => createRandomPost())
        );
        const [searchQuery, setSearchQuery] = useState("");
        // Derived state. These are the posts that will actually be displayed
        const searchedPosts =
        searchQuery.length > 0
            ? posts.filter((post) =>
                `${post.title} ${post.body}`
                .toLowerCase()
                .includes(searchQuery.toLowerCase())
            )
            : posts;

        function handleAddPost(post) {
        setPosts((posts) => [post , ...posts]);
        }
        function handleClearPosts() {
        setPosts([]);
        }

        const post = useMemo ( () => {
            return {
                posts: searchedPosts,
            }
            },[searchedPosts])
    

        const value = useMemo ( () => {
        return {
            onClearPosts: handleClearPosts,
            onAddPost:handleAddPost,
        }
        },[])


        const search = useMemo ( () => {
            return {
            searchQuery,   
            setSearchQuery,
            }
        },[searchQuery])

    return(
        <postContext.Provider
        value={value} 
        search={search}
        post ={post}
        >
            {children}
        </postContext.Provider>
    )
})

function usePosts(){
    const context = useContext(postContext)
    if(!context)  throw new Error("context not working");
    return context
}
export {PostProvider, usePosts}
