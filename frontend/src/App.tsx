import './App.scss';
import { useState } from 'react';
import UsernameForm from './UsernameForm';
import ChatRoom from './ChatRoom';

function App() {
  const [username, setUsername] = useState<string | null>(null);

  return (
    <div className="app-container">
      {!username ? (
        <UsernameForm onSubmit={setUsername} />
      ) : (
        <ChatRoom username={username} />
      )}
    </div>
  );
}

export default App;
