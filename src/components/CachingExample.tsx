import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

// Component to display a list of posts fetched from an API. It uses the useQuery hook to manage data fetching and caching.
function PostList() {
  const { data, isLoading, isFetching, error } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const res = await fetch(
        "https://jsonplaceholder.typicode.com/posts?_limit=5",
      );
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      return res.json();
    },
    staleTime: 1000 * 60, // Data is fresh for 60 seconds
    gcTime: 1000 * 5, // Unused data is garbage collected after 5 seconds
    // refetchOnWindowFocus: true, // Enable refetching on window focus
    // refetchOnReconnect: true, // Enable refetching on network reconnect
    // refetchInterval: 15000, // Automatically refetch data every 15 seconds
  });

  return (
    <div>
      {isLoading && <p>Loading...</p>}
      {isFetching && <p>Updating...</p>}
      {error && <p>Error: {error.message}</p>}

      {data &&
        data.map((post: { id: number; title: string }) => (
          <div key={post.id} className="card">
            <h3>{post.title}</h3>
          </div>
        ))}
      <h2>Posts</h2>
    </div>
  );
}

// This component demonstrates how to use TanStack Query's caching features. It includes a button to invalidate the "posts" query, which forces it to refetch data from the API. The PostList component displays a list of posts and shows loading and error states as needed.
function CachingExample() {
  const [show, setShow] = useState(true);
  const queryClient = useQueryClient();

  // Function to invalidate the "posts" query, forcing it to refetch data
  function invalidateQuery() {
    queryClient.invalidateQueries({
      queryKey: ["posts"],
    });
  }

  return (
    <div className="section">
      <h2>3. Caching Example</h2>
      <p>
        This is an example of how TanStack Query handles caching of API
        responses.
      </p>
      <button onClick={invalidateQuery}>Invalidate Query</button>

      <button onClick={() => setShow((prev) => !prev)}>
        {show ? "Hide" : "Show"} Posts
      </button>
      {show && <PostList />}
    </div>
  );
}

export default CachingExample;
