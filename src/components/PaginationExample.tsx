import {
  keepPreviousData,
  useInfiniteQuery,
  useQuery,
} from "@tanstack/react-query";
import { useState } from "react";

interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

interface FetchInfinitePostsParams {
  pageParam?: number;
}

// This function simulates fetching posts for a specific page. It uses the JSONPlaceholder API, which provides a simple way to test pagination by accepting `_page` and `_limit` query parameters.
async function fetchPosts(page: number): Promise<Post[]> {
  const res = await fetch(
    `https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=10`,
  );
  return res.json();
}

// This function simulates fetching posts for infinite scrolling. It accepts an optional `pageParam` which defaults to 1 if not provided. This allows it to be used with React Query's infinite query features, where the next page can be fetched based on the last page's data.
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

      {/* <PaginationExample /> */}
      <InfiniteQueryExample />
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
    staleTime: 1000 * 60, // Keep data fresh for 1 minute
  });

  return (
    <div>
      <h3>Pagination Example</h3>
      <p>
        This uses a normal query, butthe page number is part of the query key.
      </p>

      <div>
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
          <div key={post.id} className="card" style={{ marginBottom: "10px" }}>
            <h4>{post.title}</h4>
            <p>{post.body}</p>
          </div>
        ))}
    </div>
  );
}

function InfiniteQueryExample() {
  const {
    data,
    isLoading,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["infinite-posts"],
    queryFn: fetchInfinitePosts,
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < 5) return undefined;
      return allPages.length + 1;
    },
  });

  return (
    <div>
      <h3>Infinite Query Example</h3>
      <p>
        This loads one page at a time and appends the new results to the bottom
      </p>

      {isLoading && <p>Loading...</p>}
      {isFetching && !isFetchingNextPage && <p>Background fetching...</p>}

      {data?.pages.map((page, pageIndex) => (
        <div key={pageIndex}>
          {page.map((post) => (
            <div
              key={post.id}
              className="card"
              style={{ marginBottom: "10px" }}
            >
              <h4>{post.title}</h4>
              <p>{post.body}</p>
            </div>
          ))}
        </div>
      ))}

      <button
        onClick={() => fetchNextPage()}
        disabled={!hasNextPage || isFetchingNextPage}
      >
        {isFetchingNextPage ? "Loading..." : "Load More"}
      </button>

      {!hasNextPage && <p>No more posts to load</p>}
    </div>
  );
}
