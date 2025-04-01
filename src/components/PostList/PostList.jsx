import React, { useEffect, useState } from "react";
import { db, collection, onSnapshot, doc, updateDoc, deleteDoc } from "../../firebase";
import { getAuth } from "firebase/auth";
import { height } from "@fortawesome/free-solid-svg-icons/fa0";

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
    <div style={containerStyle}>
      <h2 style={titleStyle}>📌 Publicaciones</h2>
      {posts.length === 0 && <p style={emptyMessageStyle}>No hay publicaciones aún.</p>}

      {posts.map((post) => {
        const hasFiles = post.files && post.files.length > 0;

        return (
          <div
            key={post.id}
            style={{
              ...postContainerStyle,
              border: selectedPostId === post.id ? "2px solid white" : "1px solid #8257e5",
            }}
            onClick={() =>
              setSelectedPostId(selectedPostId === post.id ? null : post.id)
            }
          >
            {/* Contenido de publicación */}
            {editingPostId === post.id ? (
              <textarea
                value={newContent[post.id] !== undefined ? newContent[post.id] : post.content}
                onChange={(e) =>
                  setNewContent((prev) => ({ ...prev, [post.id]: e.target.value }))
                }
                style={editInputStyle}
              />
            ) : (
              <p style={postTextStyle}>{post.content}</p>
            )}

            {/* Imágenes */}
            {post.images && post.images.length > 0 && (
              <div style={mediaContainerStyle}>
                {post.images.map((img, index) => (
                  <img key={index} src={img} alt="Imagen" style={postImageStyle} />
                ))}
              </div>
            )}

            {/* Videos */}
            {post.videos && post.videos.length > 0 && (
              <div style={mediaContainerStyle}>
                {post.videos.map((vid, index) => (
                  <video key={index} controls style={postVideoStyle}>
                    <source src={vid} type="video/mp4" />
                  </video>
                ))}
              </div>
            )}

            {/* Archivos */}
            {hasFiles && (
              <div style={fileContainerStyle}>
                {post.files.map((file, index) => {
                  const fileType = file.name.split(".").pop();
                  return (
                    <div key={index} style={fileItemStyle}>
                      <span style={{ fontSize: "20px" }}>
                        {fileIcons[fileType] || "📁"}
                      </span>
                      <a href={file.url} download={file.name} style={fileLinkStyle}>
                        {file.name}
                      </a>
                    </div>
                  );
                })}
              </div>
            )}

            <small style={visibilityTextStyle}>
              {post.visibility === "public" ? "🌎 Público" : "🔒 Privado"}
            </small>

            {selectedPostId === post.id && (
              <div style={buttonRowStyle}>
                {editingPostId === post.id ? (
                  <button onClick={() => handleSave(post.id)} style={editButtonStyle}>
                    💾 Guardar
                  </button>
                ) : (
                  <button onClick={() => handleEdit(post.id)} style={editButtonStyle}>
                    ✏️ Editar
                  </button>
                )}
                <button onClick={() => handleDelete(post.id)} style={deleteButtonStyle}>
                  🗑 Eliminar
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}








/* Estilos */
const containerStyle = {
  width: "400%",
  maxWidth: "1100px",
  margin: "-12px auto",
  padding: "40px",
  backgroundColor: "#2a2a40",
  borderRadius: "10px",
  boxShadow: "0 4px 10px rgba(255, 255, 255, 0.2)",
  maxHeight: "600px",
  overflowY: "auto",
  textAlign: "center",
  marginLeft: "-300px",
};

const editInputStyle = {
  width: "80%",
  padding: "8px",
  borderRadius: "5px",
  border: "1px solid #8257e5",
  backgroundColor: "#28293d",
  color: "#fff",
  fontSize: "16px",
};


const titleStyle = {
  textAlign: "center",
  color: "#fff",
  fontSize: "22px",
};

const emptyMessageStyle = {
  textAlign: "center",
  color: "#fff",
  fontSize: "16px",
};

const postContainerStyle = {
  backgroundColor: "#1e1e2e",
  padding: "15px",
  margin: "10px auto",
  borderRadius: "8px",
  color: "#fff",
  textAlign: "center",
  width: "95%",
  cursor: "pointer",
  position: "relative",
};

const postTextStyle = {
  fontSize: "18px",
  fontWeight: "bold",
  marginTop: "10px",
};

const mediaContainerStyle = {
  display: "flex",
  gap: "10px",
  flexWrap: "wrap",
  marginTop: "10px",
};

const postImageStyle = {
  width: "100%",
  maxWidth: "1100px", 
  height: "auto",
  borderRadius: "8px",
  marginTop: "-20px",
  objectFit: "cover",
};

const fileContainerStyle = {
  marginTop: "10px",
  textAlign: "center",
};

const fileItemStyle = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  justifyContent: "center",
  fontSize: "18px",
  marginTop: "10px",
};

const fileLinkStyle = {
  color: "#8257e5",
  textDecoration: "none",
};

const visibilityTextStyle = {
  display: "block",
  marginTop: "10px",
  color: "#aaa",
};

const overlayStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  backgroundColor: "rgba(0, 0, 0, 0.8)",
  padding: "10px",
  borderRadius: "8px",
  display: "flex",
  gap: "10px",
  justifyContent: "center",
};

const buttonRowStyle = {
  display: "flex",
  gap: "10px",
  justifyContent: "center",
  marginTop: "10px",
};


const editButtonStyle = {  padding: "8px",
  borderRadius: "5px",
  backgroundColor: "#4CAF50",
  color: "#fff",
  border: "none",
  cursor: "pointer",
  fontSize: "14px"
 };
const deleteButtonStyle = { padding: "8px",
  borderRadius: "5px",
  backgroundColor: "#E53935",
  color: "#fff",
  border: "none",
  cursor: "pointer",
  fontSize: "14px",
 };

const postVideoStyle = {
  width: "100%",
  maxWidth: "1100px",
  borderRadius: "8px",
  marginTop: "-20px",
};



export default PostList;