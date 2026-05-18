import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// This function fetches a list of posts from the JSONPlaceholder API. It limits the results to 5 posts for simplicity. The fetched data will be used to display the posts in the UI and to demonstrate optimistic updates when updating a post title.
async function fetchPosts() {
  const res = await fetch(
    "https://jsonplaceholder.typicode.com/posts?_limit=5",
  );
  return res.json();
}

// This function simulates updating a post title on the server. It sends a PATCH request to the JSONPlaceholder API to update the title of a specific post. If the request fails, it throws an error, which will trigger the onError callback in the mutation.
async function updatePostTitle({
  postId,
  newTitle,
}: {
  postId: number;
  newTitle: string;
}) {
  const res = await fetch(
    `https://jsonplaceholder.typicode.com/posts/${postId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify({ title: newTitle }),
    },
  );

  if (!res.ok) {
    throw new Error("Failed to update post title");
  }

  return res.json();
}

// This component demonstrates optimistic updates using React Query. When a user updates a post title, the UI will immediately reflect the change without waiting for the server response. If the server update fails, the UI will revert to the previous state.
export default function OptimisticUpdatesExample() {
  const queryClient = useQueryClient();

  const {
    data: posts,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts,
  });

  // useMutation is used to handle the post title update. The onMutate callback optimistically updates the UI before the mutation function runs.
  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: updatePostTitle,

    // Optimistically update the UI before the mutation function runs
    onMutate: async (updatedPost) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ["posts"] });

      // Snapshot the previous value
      const previousPosts = queryClient.getQueryData(["posts"]);

      // Optimistically update the posts in the cache
      queryClient.setQueryData(["posts"], (oldPosts: typeof posts) => {
        return oldPosts.map((post: any) =>
          post.id === updatedPost.postId
            ? { ...post, title: updatedPost.newTitle }
            : post,
        );
      });

      return { previousPosts };
    },

    // If the mutation fails, revert to the previous value
    onError: (err, updatedPost, context) => {
      queryClient.setQueryData(["posts"], context?.previousPosts);
    },

    // After the mutation either succeeds or fails, invalidate the posts query to refetch the latest data from the server
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  function handleUpdatePost(postId: number) {
    mutate({ postId, newTitle: `Updated Title ${Date.now()}` });
  }

  return (
    <div className="section">
      <h2>Optimistic Updates Example</h2>
      <p>
        This example demonstrates how to implement optimistic updates with React
        Query. When you update a post title, the UI will immediately reflect the
        change without waiting for the server response.
      </p>

      {isLoading && <p>Loading posts...</p>}
      {isFetching && !isLoading && <p>Fetching updates...</p>}
      {isPending && <p>Updating post...</p>}
      {isError && <p style={{ color: "red" }}>Error: {error.message}</p>}

      {posts &&
        posts.map((post: any) => (
          <div className="container">
            <div key={post.id} className="card">
              <h4>{post.title}</h4>
              <div className="buttonContainer">
                <button
                  className="acceptButton"
                  onClick={() => handleUpdatePost(post.id)}
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}

// 31:31
