import { useEffect, useState } from "react";
import {
  db,
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "../../firebase";
import "./AdminPanel.css";

function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [userReports, setUserReports] = useState([]);
  const [postReports, setPostReports] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState("users");
  const [showOnlyReportedPosts, setShowOnlyReportedPosts] = useState(false);
  const [userSearch, setUserSearch] = useState("");

  useEffect(() => {
    const userData = JSON.parse(sessionStorage.getItem("userData"));

    if (userData /*&& userData.role === "admin"*/) { 
      setCurrentUser(userData);
      fetchUsers();
      fetchPosts();
      fetchUserReports();
      fetchPostReports();
    } else {
      alert("No tienes permisos para acceder aquí.");
    }
  }, []);

  const fetchUsers = async () => {
    const snapshot = await getDocs(collection(db, "users"));
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setUsers(data);
  };

  const fetchPosts = async () => {
    const snapshot = await getDocs(collection(db, "posts"));
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setPosts(data);
  };

  const fetchUserReports = async () => {
    const snapshot = await getDocs(collection(db, "reports"));
    const data = snapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .filter((report) => report.reportedUserId);
    setUserReports(data);
  };

  const fetchPostReports = async () => {
    const snapshot = await getDocs(collection(db, "reports"));
    const data = snapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .filter((report) => report.postId);
    setPostReports(data);
  };

  const handleSuspendUser = async (uid) => {
    await updateDoc(doc(db, "users", uid), { suspended: true });
    fetchUsers();
  };

  const handleReactivateUser = async (uid) => {
    await updateDoc(doc(db, "users", uid), { suspended: false });
    fetchUsers();
  };

  const handleDeletePost = async (postId) => {
    await deleteDoc(doc(db, "posts", postId));
    fetchPosts();
  };

  const getUserReportCount = (uid) => {
    return userReports.filter((r) => r.reportedUserId === uid).length;
  };

  const getPostReportCount = (postId) => {
    return postReports.filter((r) => r.postId === postId).length;
  };

  if (!currentUser) return <p>Cargando...</p>;

  return (
    <div className="admin-panel">
      <aside className="admin-sidebar">
        <div className="logo">{`{<>}`}</div>
        <button
          className={activeTab === "users" ? "active" : ""}
          onClick={() => setActiveTab("users")}
        >
          👤 User Report
        </button>
        <button
          className={activeTab === "posts" ? "active" : ""}
          onClick={() => setActiveTab("posts")}
        >
          📄 Posts
        </button>
      </aside>

      <main className="admin-content">
        {activeTab === "users" && (
          <>
            <h3 className="admin-section-title">Usuarios</h3>

            <input
              type="text"
              placeholder="Buscar por email"
              className="admin-search-bar"
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value.toLowerCase())}
            />

            <div className="admin-card-grid">
              {users
                .filter(
                  (user) =>
                    user.email?.toLowerCase().includes(userSearch) ||
                    user.nombre?.toLowerCase().includes(userSearch)
                )
                .map((user) => (
                  <div key={user.id} className="admin-user-card">
                    {getUserReportCount(user.id) > 0 && (
                      <div className="admin-warning-icon">
                        ⚠️ {getUserReportCount(user.id)}
                      </div>
                    )}

                    <div className="admin-user-avatar">
                      {user.profilePic ? (
                        <img src={user.profilePic} alt="Avatar" />
                      ) : (
                        <div className="admin-default-avatar">👤</div>
                      )}
                    </div>
                    <div className="admin-user-info">
                      <p className="admin-user-email">{user.email}</p>
                    </div>

                    {user.suspended ? (
                      <button
                        className="admin-reactivate-btn"
                        onClick={() => handleReactivateUser(user.id)}
                      >
                        ✅ Reactivar
                      </button>
                    ) : (
                      <button
                        className="admin-suspend-btn"
                        onClick={() => handleSuspendUser(user.id)}
                      >
                        🚫 Suspender
                      </button>
                    )}
                  </div>
                ))}
            </div>
          </>
        )}

        {activeTab === "posts" && (
          <>
            <button
              className="admin-filter-btn"
              onClick={() => setShowOnlyReportedPosts(!showOnlyReportedPosts)}
            >
              {showOnlyReportedPosts ? "Mostrar todas" : "Solo con reportes"}
            </button>

            <h3 className="admin-section-title">Publicaciones</h3>
            <div className="admin-card-grid">
              {posts
                .filter(
                  (post) =>
                    !showOnlyReportedPosts || getPostReportCount(post.id) > 0
                )
                .map((post) => (
                  <div key={post.id} className="admin-user-card">
                    {getPostReportCount(post.id) > 0 && (
                      <div className="admin-warning-icon">
                        ⚠️ {getPostReportCount(post.id)}
                      </div>
                    )}

                    {post.media?.[0]?.type === "image" && (
                      <div className="admin-post-image">
                        <img src={post.media[0].url} alt="Post" />
                      </div>
                    )}

                    <div className="admin-user-avatar">
                      {post.media?.[0]?.profilePic ? (
                        <img src={post.media[0].profilePic} alt="Avatar" />
                      ) : (
                        <div className="admin-default-avatar">👤</div>
                      )}
                    </div>

                    <div className="admin-user-info">
                      <p className="admin-user-email">
                        {post.username || "Usuario Desconocido"}
                      </p>
                    </div>

                    <p className="admin-post-text">
                      {post.text || "(Sin contenido)"}
                    </p>

                    <button
                      className="admin-suspend-btn"
                      onClick={() => handleDeletePost(post.id)}
                    >
                      🗑 Eliminar
                    </button>
                  </div>
                ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default AdminPanel;
