import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

async function fetchPosts(): Promise<Post[]> {
  const res = await fetch(
    "https://jsonplaceholder.typicode.com/posts?_limit=5",
  );

  return res.json();
}

function QueryExample() {
  const [isLoadData, setIsLoadData] = useState<boolean>(false);
  const {
    data: posts,
    isLoading,
    error,
    refetch,
  } = useQuery<Post[]>({
    queryKey: ["posts"],
    queryFn: fetchPosts,
    enabled: isLoadData,
  });

  return (
    <div className="section">
      <h2>1. Intro and Setup</h2>
      <p>This is our first query without TanStack Query</p>

      {isLoading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>Something went wrong</p>}

      <button onClick={() => setIsLoadData(true)}>Load Data</button>
      <button onClick={() => refetch()}>Refetch</button>

      {posts && (
        <div>
          {posts.map((post: Post) => (
            <div key={post.id} className="card">
              <h4>{post.title}</h4>
              <p>{post.body}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default QueryExample;
