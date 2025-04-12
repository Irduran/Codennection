import React, { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase";
import Swal from "sweetalert2";
import "./CreatePost.css"

const CreatePost = ({ onPostCreated }) => {
  const [text, setText] = useState("");
  const [media, setMedia] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  const userData = JSON.parse(sessionStorage.getItem("userData"));

  const handleMediaUpload = async (files) => {
    setIsUploading(true);
    const uploadedMedia = [];

    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "Codennections"); // Cloudinary preset

      try {
        const res = await fetch("https://api.cloudinary.com/v1_1/dtnvngwew/upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        uploadedMedia.push({
          url: data.secure_url,
          type: file.type.startsWith("video") ? "video" : "image",
        });
      } catch (err) {
        console.error("Error subiendo archivo:", err);
        Swal.fire("Error", "No se pudo subir el archivo", "error");
      }
    }

    setMedia(uploadedMedia);
    setIsUploading(false);
  };

  const handlePost = async () => {
    if (!text.trim()) {
      Swal.fire("Oops", "Escribe algo antes de postear", "warning");
      return;
    }

    try {
      await addDoc(collection(db, "posts"), {
        userId: userData.uid,
        username: userData.nombre || userData.email,
        profilePic: userData.profilePic || null,
        text,
        media,
        quacks: 0,
        comments: [],
        createdAt: serverTimestamp(),
      });

      Swal.fire("Publicado!", "Tu post se subió correctamente", "success");
      setText("");
      setMedia([]);
      onPostCreated();
    } catch (err) {
      console.error("Error guardando el post:", err);
      Swal.fire("Error", "No se pudo guardar tu post", "error");
    }
  };

  return (
    <div className="create-post">
      <textarea
        placeholder="¿Qué estás pensando?"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <input
        type="file"
        multiple
        accept="image/*,video/*"
        onChange={(e) => handleMediaUpload(e.target.files)}
      />
      <button onClick={handlePost} disabled={isUploading}>
        {isUploading ? "Subiendo..." : "Publicar"}
      </button>
    </div>
  );
};

export default CreatePost;
