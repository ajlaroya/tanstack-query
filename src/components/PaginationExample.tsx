import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useState } from "react";

interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

interface FetchPostsParams {
  page: number;
}

interface FetchInfinitePostsParams {
  pageParam?: number;
}

async function fetchPosts(page: number): Promise<Post[]> {
  const res = await fetch(
    `https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=10`,
  );
  return res.json();
}

async function fetchInfinitePosts({
  pageParam = 1,
}: FetchInfinitePostsParams): Promise<Post[]> {
  const res = await fetch(
    `https://jsonplaceholder.typicode.com/posts?_page=${pageParam}&_limit=10`,
  );
  return res.json();
}

export default function PaginationInfiniteQueriesExample() {
  return (
    <div className="section">
      <h2>Pagination & Infinite Queries</h2>
      <p>
        Pagination allows users to navigate through large datasets by displaying
        a subset of items per page. Infinite queries enable loading more data as
        the user scrolls, providing a seamless experience without the need for
        explicit pagination controls.
      </p>

      <PaginationExample />
    </div>
  );
}

function PaginationExample() {
  const [page, setPage] = useState(1);

  const {
    data: posts,
    isLoading,
    isFetching,
    isPlaceholderData,
  } = useQuery({
    queryKey: ["posts", page],
    queryFn: () => fetchPosts(page),
    placeholderData: keepPreviousData,
  });

  return (
    <div className="card">
      <h3>Pagination Example</h3>
      <p>
        This uses a normal query, butthe page number is part of the query key.
      </p>

      <div style={{ marginBottom: "10px" }}>
        <button onClick={() => setPage((prev) => Math.max(prev - 1, 1))}>
          Previous
        </button>
        <button onClick={() => setPage((prev) => prev + 1)}>Next</button>
      </div>

      <p>Current Page: {page}</p>

      {isLoading && <p>Loading...</p>}
      {isFetching && <p>Fetching...</p>}
      {isPlaceholderData && <p>Showing placeholder data...</p>}

      {posts &&
        posts.map((post) => (
          <div key={post.id} className="card">
            <h4>{post.title}</h4>
            <p>{post.body}</p>
          </div>
        ))}
    </div>
  );
}

// 36:13
