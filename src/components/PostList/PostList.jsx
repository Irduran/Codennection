import React, { useEffect, useState } from "react";
import { db, collection, onSnapshot, doc, updateDoc, deleteDoc } from "../../firebase";
import { getAuth } from "firebase/auth";
import Post from "../Posts/Post";

/* Emojis */
const emojiDictionary = {
  feliz: "😀",
  triste: "😢",
  divertido: "😂",
  enojado: "😡",
  enamorado: "😍",
  cool: "😎",
  pensativo: "🤔",
};

const fileIcons = {
  zip: "📂",
  txt: "📄",
  docx: "📑",
  pdf: "📕",
};

function PostList() {
  const [posts, setPosts] = useState([]);
  const [editingPostId, setEditingPostId] = useState(null);
  const [newContent, setNewContent] = useState({});
  const [selectedPostId, setSelectedPostId] = useState(null);
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "posts"), (snapshot) => {
      const postsArray = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const filteredPosts = postsArray.filter(
        (post) => post.visibility === "public" || post.author === user?.uid
      );

      setPosts(filteredPosts);
    });

    return () => unsubscribe();
  }, [user?.uid]);

  const handleEdit = (postId) => {
    setEditingPostId(postId);
    setNewContent((prev) => ({
      ...prev,
      [postId]: posts.find((post) => post.id === postId)?.content || "",
    }));
  };

  const handleSave = async (postId) => {
    const updatedText = newContent[postId]?.trim();

    if (!updatedText || updatedText === posts.find((post) => post.id === postId)?.content) {
      setEditingPostId(null);
      setNewContent((prev) => ({ ...prev, [postId]: "" }));
      return;
    }

    try {
      await updateDoc(doc(db, "posts", postId), {
        content: updatedText,
      });

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId ? { ...post, content: updatedText } : post
        )
      );

      setEditingPostId(null);
      setNewContent((prev) => ({ ...prev, [postId]: "" }));
    } catch (error) {
      console.error("❌ Error al guardar:", error);
    }
  };

  const handleDelete = async (postId) => {
    try {
      await deleteDoc(doc(db, "posts", postId));
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
      setSelectedPostId(null);
    } catch (error) {
      console.error("Error eliminando la publicación:", error);
    }
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "20px" }}>
      {posts.length === 0 && <p style={emptyMessageStyle}>No hay publicaciones aún.</p>}
      {posts.map((post) => {
        const media = [
          ...(post.images || []).map((url) => ({ type: "image", url })),
          ...(post.videos || []).map((url) => ({ type: "video", url })),
        ];

        return (
          <Post
            key={post.id}
            username={post.authorName}
            time={
              post.createdAt
                ? new Date(post.createdAt.seconds * 1000).toLocaleDateString()
                : "Ahora"
            }
            text={editingPostId === post.id ? newContent[post.id] : post.content}
            media={media}
            quacks={post.likes || 0}
            comments={post.comments || []}
            isEditing={editingPostId === post.id}
            onEdit={() => handleEdit(post.id)}
            onSave={() => handleSave(post.id)}
            onDelete={() => handleDelete(post.id)}
            onChangeEdit={(e) =>
              setNewContent((prev) => ({ ...prev, [post.id]: e.target.value }))
            }
          />
        );
      })}
    </div>
  );
}

/* Estilos */
const emptyMessageStyle = {
  textAlign: "center",
  color: "#fff",
  fontSize: "16px",
};

export default PostList;
