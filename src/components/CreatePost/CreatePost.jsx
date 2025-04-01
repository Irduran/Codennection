import { useState, useRef, useEffect } from "react";
import { db, collection, addDoc, getDocs } from "../../firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";

function CreatePost() {
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [files, setFiles] = useState([]);
  const [link, setLink] = useState("");
  const [visibility, setVisibility] = useState("public");
  const [loading, setLoading] = useState(false);
  const [showEmojiPopup, setShowEmojiPopup] = useState(false);
  const [showVideoPopup, setShowVideoPopup] = useState(false);
  const [recording, setRecording] = useState(false);
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [fileKey, setFileKey] = useState(Date.now());
  const [showModal, setShowModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const videoRef = useRef(null);
  const mediaRecorder = useRef(null);
  const recordedChunks = useRef([]);

  const emojis = [
    { symbol: "😀", description: "Feliz" },
    { symbol: "😢", description: "Triste" },
    { symbol: "😂", description: "Divertido" },
    { symbol: "😡", description: "Enojado" },
    { symbol: "😍", description: "Enamorado" },
    { symbol: "😎", description: "Cool" },
    { symbol: "🤔", description: "Pensativo" },
  ];

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    fetchPosts();
    return () => unsubscribe();
  }, []);

  const fetchPosts = async () => {
    const querySnapshot = await getDocs(collection(db, "posts"));
    const postsData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setPosts(postsData);
  };

  const handleEmojiClick = (emoji) => {
    setContent((prev) => prev + " " + emoji.symbol);
    setShowEmojiPopup(false);
  };

  const handleFileUpload = (e) => {
    const selectedFiles = Array.from(e.target.files);
  
    const newImages = selectedFiles
      .filter((file) => file.type.startsWith("image/"))
      .map((file) => URL.createObjectURL(file));
  
    const newVideos = selectedFiles
      .filter((file) => file.type.startsWith("video/"))
      .map((file) => URL.createObjectURL(file));
  
    const newFiles = selectedFiles
      .filter((file) => !file.type.startsWith("image/") && !file.type.startsWith("video/"))
      .map((file) => ({
        name: file.name,
        url: URL.createObjectURL(file),
      }));
  
    const descriptions = [];
    if (newImages.length > 0) descriptions.push(`🖼 Imagen (${newImages.length})`);
    if (newVideos.length > 0) descriptions.push(`🎥 Video (${newVideos.length})`);
    if (newFiles.length > 0) descriptions.push(`📄 Archivo (${newFiles.length})`);
  
    setContent((prev) => prev + (prev ? "\n" : "") + descriptions.join(" + "));
  
    setImages((prev) => [...prev, ...newImages]);
    setVideos((prev) => [...prev, ...newVideos]);
    setFiles((prev) => [...prev, ...newFiles]);
    setFileKey(Date.now());
  };
  

  const startCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    if (videoRef.current) videoRef.current.srcObject = stream;
    mediaRecorder.current = new MediaRecorder(stream);
    mediaRecorder.current.ondataavailable = (event) => {
      if (event.data.size > 0) recordedChunks.current.push(event.data);
    };
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const startRecording = () => {
    recordedChunks.current = [];
    mediaRecorder.current.start();
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorder.current.stop();
    setRecording(false);
  
    mediaRecorder.current.onstop = () => {
      const blob = new Blob(recordedChunks.current, { type: "video/mp4" });
      const videoURL = URL.createObjectURL(blob);
  
      setVideos((prevVideos) => [...prevVideos, videoURL]);
  
      setContent((prev) => prev + " 🎥 Grabación en vivo añadida");
    };
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!content.trim() && images.length === 0 && videos.length === 0 && files.length === 0) {
      alert("⚠️ Debes escribir algo o subir archivos.");
      setLoading(false);
      return;
    }

    if (!user) {
      alert("❌ Debes iniciar sesión para publicar.");
      setLoading(false);
      return;
    }

    try {
      await addDoc(collection(db, "posts"), {
        content,
        images,
        videos,
        files,
        link,
        visibility,
        author: user.uid,
        authorName: user.displayName || "",
        authorEmail: user.email,
        createdAt: new Date(),
      });

      setShowSuccessModal(true);
      setShowModal(false);
      setContent("");
      setImages([]);
      setVideos([]);
      setFiles([]);
      setLink("");
      setVisibility("public");
    } catch (error) {
      console.error("Error al publicar:", error);
      alert("❌ Error al publicar. Revisa la consola.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Muestra el Modal */}
      <div
        onClick={() => setShowModal(true)}
        style={{
          backgroundColor: "#1e1e2e",
          borderRadius: "10px",
          padding: "15px",
          margin: "20px auto",
          width: "100%",
          maxWidth: "600px",
          cursor: "pointer",
          color: "gray",
          display: "flex",
          alignItems: "center"
        }}
      >
        <img
          src="https://via.placeholder.com/40"
          alt="User"
          style={{ width: "40px", height: "40px", borderRadius: "50%", marginRight: "10px" }}
        />
        ¿Qué estás pensando?
      </div>

      {/* Modal principal */}
      {showModal && (
        <div className="modal fade show" tabIndex="-1" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.6)" }}>
          <div className="modal-dialog modal-dialog-centered modal-md">
            <div className="modal-content bg-dark text-white">
              <div className="modal-header">
                <h5 className="modal-title">Crear publicación</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit}>
                  <textarea
                    className="form-control mb-3 bg-secondary text-white"
                    rows="3"
                    placeholder="¿Qué estás pensando?"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  />
                  <div className="d-flex justify-content-between gap-2">
                    <label className="btn btn-outline-light w-100">
                      📷 Fotos/Archivos
                      <input
                        type="file"
                        accept="image/*,video/*,.pdf,.txt,.zip,.docx"
                        multiple
                        key={fileKey}
                        onChange={handleFileUpload}
                        style={{ display: "none" }}
                      />
                    </label>
                    <button type="button" className="btn btn-outline-light w-100" onClick={() => setShowVideoPopup(true)}>
                      🎥 Grabar en Vivo
                    </button>
                    <button type="button" className="btn btn-outline-light w-100" onClick={() => setShowEmojiPopup(!showEmojiPopup)}>
                      😊 Como te sientes?
                    </button>
                  </div>

                  {showEmojiPopup && (
                    <div className="bg-secondary rounded p-2 my-2">
                      {emojis.map((emoji, idx) => (
                        <span
                          key={idx}
                          onClick={() => handleEmojiClick(emoji)}
                          style={{ fontSize: "24px", margin: "5px", cursor: "pointer" }}
                        >
                          {emoji.symbol}
                        </span>
                      ))}
                    </div>
                  )}

            {showVideoPopup && (
              <div style={videoPopupStyle}>
              <video ref={videoRef} autoPlay style={videoPreviewStyle}></video>
                <div style={buttonRowStyle}>
              <button type="button" style={videoButtonStyle} onClick={startCamera}>
             Encender cámara
            </button>
            <button
            type="button"
               style={recording ? videoButtonDisabledStyle : videoButtonStyle}
                  onClick={startRecording}
                 disabled={recording}
                      >
                    Iniciar grabación
                       </button>
                    <button
                   type="button"
                      style={!recording ? videoButtonDisabledStyle : videoButtonStyle}
                        onClick={stopRecording}
                          disabled={!recording}
                >
                         Detener grabación
                                   </button>
                                 <button
                             type="button"
                           style={videoButtonStyle}
                          onClick={() => {
                          stopCamera();
                         setShowVideoPopup(false);
                       }}
                >
                        Cerrar
                    </button>
                   </div>
                  </div>
                  )}

                  <select
                    className="form-select my-3 bg-secondary text-white"
                    value={visibility}
                    onChange={(e) => setVisibility(e.target.value)}
                  >
                    <option value="public">🌍 Público</option>
                    <option value="private">🔒 Privado</option>
                  </select>

                  <button type="submit" className="btn btn-success w-100" disabled={loading}>
                    {loading ? "Publicando..." : "Publicar"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de éxito */}
      {showSuccessModal && (
        <div className="modal fade show" tabIndex="-1" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.6)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content bg-dark text-white">
              <div className="modal-header">
                <h5 className="modal-title">Publicación Exitosa</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowSuccessModal(false)}></button>
              </div>
              <div className="modal-body">
                🎉 Tu publicación ha sido creada exitosamente.
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}







// 💅 Estilos
const containerStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  width: "300%",
  maxWidth: "1200px",
  margin: "40px auto",
  padding: "20px",
  backgroundColor: "#2a2a40",
  borderRadius: "15px",
  boxShadow: "0 4px 10px rgba(255, 255, 255, 0.2)",
  marginLeft: "-300px",
};

const formStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "5px",
  width: "100%",
};

const inputContainer = {
  display: "flex",
  alignItems: "center",
  backgroundColor: "#28293d",
  padding: "12px",
  borderRadius: "10px",
  border: "1px solid #444",
  width: "100%",
};

const userAvatarStyle = {
  width: "40px",
  height: "40px",
  borderRadius: "50%",
  marginRight: "10px",
};

const textareaStyle = {
  flex: "1",
  height: "50px",
  border: "none",
  backgroundColor: "transparent",
  color: "#fff",
  fontSize: "16px",
  resize: "none",
  outline: "none",
};

const iconRowStyle = {
  display: "flex",
  gap: "10px",
  justifyContent: "center",
  width: "100%",
};

const iconInputContainer = {
  display: "flex",
  alignItems: "center",
  backgroundColor: "#28293d",
  padding: "12px",
  borderRadius: "8px",
  border: "1px solid #555",
  flex: "1",
  minWidth: "100px",
  cursor: "pointer",
};

const iconStyle = {
  color: "white",
  fontSize: "22px",
  marginRight: "10px",
};

const hiddenInputStyle = {
  flex: "1",
  padding: "8px",
  border: "none",
  backgroundColor: "transparent",
  color: "#fff",
  outline: "none",
  textAlign: "center",
};

const buttonRowStyle = {
  display: "flex",
  gap: "10px",
  justifyContent: "center",
  width: "100%",
};

const selectStyle = {
  flex: "1",
  padding: "10px",
  borderRadius: "8px",
  border: "1px solid #555",
  backgroundColor: "#1e1e2e",
  color: "#fff",
  textAlign: "center",
  width: "150px",
};

const submitButtonStyle = {
  padding: "10px",
  borderRadius: "8px",
  backgroundColor: "#8257e5",
  color: "#fff",
  fontWeight: "bold",
  border: "none",
  cursor: "pointer",
  width: "120px",
};

const messageStyle = {
  marginTop: "10px",
  textAlign: "center",
  color: "#fff",
  fontSize: "14px",
};

const emojiPopupStyle = {
  position: "absolute",
  top: "60px",
  right: "10px",
  backgroundColor: "#333",
  color: "#fff",
  padding: "10px",
  borderRadius: "8px",
  boxShadow: "0px 4px 6px rgba(0,0,0,0.3)",
  maxWidth: "200px",
  zIndex: 100,
};

const emojiItemStyle = {
  padding: "5px",
  cursor: "pointer",
  borderBottom: "1px solid #555",
};

//  **Estilos de video**
const videoPopupStyle = {
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  backgroundColor: "#2a2a40",  
  padding: "20px",
  borderRadius: "12px",
  boxShadow: "0px 4px 8px rgba(255, 255, 255, 0.2)",
  zIndex: 1000,
  color: "white",
  textAlign: "center",
  width: "400px",
};

const videoPreviewStyle = {
  width: "100%",
  height: "200px",
  backgroundColor: "black",
  borderRadius: "8px",
  marginBottom: "10px",
};

const videoButtonStyle = {
  padding: "10px",
  borderRadius: "8px",
  backgroundColor: "#8257e5",  
  color: "#fff",
  fontWeight: "bold",
  border: "none",
  cursor: "pointer",
  width: "100px",
  transition: "background 0.3s",
};

const videoButtonDisabledStyle = {
  ...videoButtonStyle,
  backgroundColor: "#555",  
  cursor: "not-allowed",
};


export default CreatePost;