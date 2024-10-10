import React, { useState, useEffect, createContext, useContext } from 'react';
import './App.css';

// 創建 UserContext 來管理使用者資料
const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [users, setUsers] = useState([]);

  // 新增使用者
  const addUser = (user) => {
    setUsers([...users, user]);
  };

  // 更新使用者資料
  const updateUser = (updatedUser) => {
    setUsers(users.map(user => user.id === updatedUser.id ? updatedUser : user));
  };

  // 刪除使用者
  const deleteUser = (userId) => {
    setUsers(users.filter(user => user.id !== userId));
  };

  return (
    <UserContext.Provider value={{ users, addUser, updateUser, deleteUser }}>
      {children}
    </UserContext.Provider>
  );
};

// 使用者註冊/編輯表單
const UserForm = ({ editingUser, setEditingUser }) => {
  const { addUser, updateUser } = useContext(UserContext);
  const [formData, setFormData] = useState(editingUser || { name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');

  // 使用 useEffect 監聽 editingUser 的變化，並更新表單資料
  useEffect(() => {
    if (editingUser) {
      setFormData(editingUser); // 將 editingUser 的資料填入表單
    } else {
      setFormData({ name: '', email: '', password: '', confirmPassword: '' }); // 清空表單
    }
  }, [editingUser]);

  // 檢查電子郵件格式的正則表達式
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // 處理表單輸入變更
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 表單提交處理
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // 檢查電子郵件格式
    if (!emailRegex.test(formData.email)) {
      setError('Invalid email format');
      return;
    }

    // 檢查密碼長度
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    // 檢查密碼是否一致
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // 清除錯誤信息
    setError('');

    if (editingUser) {
      updateUser(formData); // 編輯使用者
      setEditingUser(null);
    } else {
      addUser({ ...formData, id: Date.now() }); // 新增使用者
    }

    // 重置表單
    setFormData({ name: '', email: '', password: '', confirmPassword: '' });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Name"
        required
      />
      <input
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
        required
      />
      <input
        name="password"
        type="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Password"
        required
      />
      <input
        name="confirmPassword"
        type="password"
        value={formData.confirmPassword}
        onChange={handleChange}
        placeholder="Confirm Password"
        required
      />
      {/* 顯示錯誤訊息 */}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button type="submit">
        {editingUser ? 'Update User' : 'Register User'}
      </button>
    </form>
  );
};

// 顯示使用者列表
const UserList = ({ setEditingUser }) => {
  const { users, deleteUser } = useContext(UserContext);

  // 彈出確認刪除視窗
  const handleDelete = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      deleteUser(userId);
    }
  };

  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>
          {user.name} ({user.email})
          <button onClick={() => setEditingUser(user)}>Edit</button>
          <button onClick={() => deleteUser(user.id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
};

// 主應用
function App() {
  const [editingUser, setEditingUser] = useState(null);

  return (
    <UserProvider>
      <div className="App">
        <header className="App-header">
          <h1>User Registration</h1>
          <UserForm editingUser={editingUser} setEditingUser={setEditingUser} />
          <h2>Registered Users</h2>
          <UserList setEditingUser={setEditingUser} />
        </header>
      </div>
    </UserProvider>
  );
}

export default App;
