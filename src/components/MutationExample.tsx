import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

interface NewPost {
  title: string;
  body: string;
}

async function createPost(newPost: NewPost): Promise<NewPost> {
  const res = await fetch("https://jsonplaceholder.typicode.com/posts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify(newPost),
  });

  return res.json();
}

function MutationExample() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const {
    mutate,
    isPending,
    isError,
    error,
    data: newPost,
  } = useMutation({ mutationFn: createPost });

  return (
    <div className="section">
      <h2>2. Mutation</h2>
      <p>Mutations are used to create, update, and delete data</p>

      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        placeholder="Body"
        value={body}
        onChange={(e) => setBody(e.target.value)}
      />

      <button onClick={() => mutate({ title, body })} disabled={isPending}>
        Create Post
      </button>

      {isPending && <p>Creating post...</p>}

      {isError && <p>Error creating post: {error.message}</p>}

      {newPost && (
        <div className="card">
          <h4>{newPost.title}</h4>
          <p>{newPost.body}</p>
        </div>
      )}
    </div>
  );
}

export default MutationExample;
