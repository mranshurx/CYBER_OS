import React, { useState, useEffect, useRef } from 'react';
import Draggable from 'react-draggable';
import { Terminal, FileText, Calculator, X, Cpu, Power, Lock, Key, ShieldCheck, RefreshCw } from 'lucide-react';
import './App.css';

const APPS = [
  { id: 'notepad', title: 'Cyber Note', icon: FileText },
  { id: 'terminal', title: 'Cyber Terminal', icon: Terminal },
  { id: 'calculator', title: 'Cyber Calc', icon: Calculator },
];

export default function App() {
  const [openWindows, setOpenWindows] = useState([]);
  const [activeWindow, setActiveWindow] = useState(null);
  const [startOpen, setStartOpen] = useState(false);
  
  // Security State
  const [isLocked, setIsLocked] = useState(true);
  const [systemPassword, setSystemPassword] = useState('cyber123');
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');

  // Persistent Simulated File System State
  const [fileSystem, setFileSystem] = useState({
    'readme.txt': 'SYSTEM MANIFEST:\n========================\nOS NAME: CYBER OS\nDESIGNED, CODED, AND MADE INTO REALITY BY: cyber_anxhu\n\nDefault Passcode: cyber123\nUse the Terminal to manage files, change passwords, or run diagnostics.',
    'projects.txt': '1. CYBER OS - Virtual Web OS\n2. AI Neural Node\n3. Quantum Grid Engine'
  });

  const handleUnlock = (e) => {
    e.preventDefault();
    if (passwordInput === systemPassword) {
      setIsLocked(false);
      setPasswordInput('');
      setAuthError('');
    } else {
      setAuthError('ACCESS DENIED: Invalid Passcode');
      setPasswordInput('');
    }
  };

  const launchApp = (appId) => {
    if (!openWindows.includes(appId)) {
      setOpenWindows([...openWindows, appId]);
    }
    setActiveWindow(appId);
    setStartOpen(false);
  };

  const closeWindow = (appId) => {
    setOpenWindows(openWindows.filter((id) => id !== appId));
    if (activeWindow === appId) {
      setActiveWindow(null);
    }
  };

  return (
    <div className="os-desktop">
      {/* SECURITY LOCK / BOOT SCREEN OVERLAY */}
      {isLocked && (
        <div className="lock-screen">
          <div className="lock-card">
            <Cpu size={56} color="#00f0ff" className="glow-icon" />
            <h1 className="cyber-title">CYBER OS</h1>
            <p className="cyber-credits">Designed, coded, and made into reality by <span>cyber_anxhu</span></p>

            <form onSubmit={handleUnlock} className="lock-form">
              <div className="input-group">
                <Key size={18} color="#00f0ff" />
                <input
                  type="password"
                  placeholder="Enter Security Passcode..."
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  autoFocus
                />
              </div>
              {authError && <div className="auth-error">{authError}</div>}
              <button type="submit" className="unlock-btn">
                INITIALIZE KERNEL
              </button>
            </form>
            <span className="hint-text">Default Passcode: <b>cyber123</b></span>
          </div>
        </div>
      )}

      {/* DESKTOP ICONS */}
      <div className="desktop-icons">
        {APPS.map((app) => {
          const Icon = app.icon;
          return (
            <div
              key={app.id}
              className="desktop-icon"
              onDoubleClick={() => launchApp(app.id)}
            >
              <Icon size={36} color="#00f0ff" />
              <span>{app.title}</span>
            </div>
          );
        })}
      </div>

      {/* WINDOW MANAGER */}
      {openWindows.map((appId) => {
        const app = APPS.find((a) => a.id === appId);
        const isActive = activeWindow === appId;

        return (
          <Draggable
            key={appId}
            handle=".window-header"
            onMouseDown={() => setActiveWindow(appId)}
          >
            <div
              className={`window ${isActive ? 'active-window' : ''}`}
              style={{ zIndex: isActive ? 10 : 1 }}
            >
              <div className="window-header">
                <div className="window-title">
                  <app.icon size={16} color="#00f0ff" />
                  <span>CYBER OS // {app.title}</span>
                </div>
                <div className="window-controls">
                  <button onClick={() => closeWindow(appId)} className="close-btn">
                    <X size={14} />
                  </button>
                </div>
              </div>

              <div className="window-body">
                {appId === 'notepad' && (
                  <NotepadApp fileSystem={fileSystem} setFileSystem={setFileSystem} />
                )}
                {appId === 'terminal' && (
                  <TerminalApp 
                    fileSystem={fileSystem} 
                    setFileSystem={setFileSystem}
                    systemPassword={systemPassword}
                    setSystemPassword={setSystemPassword}
                  />
                )}
                {appId === 'calculator' && <CalculatorApp />}
              </div>
            </div>
          </Draggable>
        );
      })}

      {/* START MENU */}
      {startOpen && (
        <div className="start-menu">
          <div className="start-header">CYBER OS v1.0</div>
          <div className="start-apps">
            {APPS.map((app) => {
              const Icon = app.icon;
              return (
                <button
                  key={app.id}
                  className="start-item"
                  onClick={() => launchApp(app.id)}
                >
                  <Icon size={20} color="#00f0ff" />
                  <span>{app.title}</span>
                </button>
              );
            })}
          </div>
          <div className="start-footer">
            <p>Made into reality by <b>cyber_anxhu</b></p>
            <button className="lock-btn" onClick={() => { setIsLocked(true); setStartOpen(false); }}>
              <Lock size={12} /> Lock System
            </button>
          </div>
        </div>
      )}

      {/* TASKBAR */}
      <div className="taskbar">
        <button
          className="start-btn"
          onClick={() => setStartOpen(!startOpen)}
        >
          ⚡ CYBER OS
        </button>

        <div className="taskbar-apps">
          {openWindows.map((appId) => {
            const app = APPS.find((a) => a.id === appId);
            return (
              <button
                key={appId}
                className={`taskbar-item ${activeWindow === appId ? 'active' : ''}`}
                onClick={() => setActiveWindow(appId)}
              >
                <app.icon size={16} color="#00f0ff" />
                <span>{app.title}</span>
              </button>
            );
          })}
        </div>

        <div className="taskbar-credit">
          by <span>cyber_anxhu</span>
        </div>
        <div className="taskbar-time">
          {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
}

/* APP COMPONENTS */

function NotepadApp({ fileSystem, setFileSystem }) {
  const [selectedFile, setSelectedFile] = useState('readme.txt');
  const [content, setContent] = useState(fileSystem['readme.txt'] || '');

  const handleSave = () => {
    setFileSystem({ ...fileSystem, [selectedFile]: content });
  };

  return (
    <div className="notepad-container">
      <div className="notepad-toolbar">
        <select value={selectedFile} onChange={(e) => {
          setSelectedFile(e.target.value);
          setContent(fileSystem[e.target.value] || '');
        }}>
          {Object.keys(fileSystem).map((file) => (
            <option key={file} value={file}>{file}</option>
          ))}
        </select>
        <button onClick={handleSave}>Save File</button>
      </div>
      <textarea
        className="notepad-textarea"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
    </div>
  );
}

function TerminalApp({ fileSystem, setFileSystem, systemPassword, setSystemPassword }) {
  const [input, setInput] = useState('');
  const [currentDir, setCurrentDir] = useState('~');
  const [theme, setTheme] = useState('cyan');
  const [history, setHistory] = useState([
    'CYBER OS Advanced Command Shell [v1.0.4]',
    'System created and verified by cyber_anxhu.',
    'Type "help" to list all available system operations.'
  ]);

  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommand = (e) => {
    if (e.key === 'Enter') {
      const fullCmd = input.trim();
      const args = fullCmd.split(' ');
      const cmd = args[0].toLowerCase();
      let response = [];

      if (cmd === '') {
        // Empty submission
      } else if (cmd === 'help') {
        response = [
          'AVAILABLE SYSTEM COMMANDS:',
          '  help               - Display command reference list',
          '  author             - Show developer credits',
          '  ls                 - List directory files',
          '  cat <filename>     - Read contents of a file',
          '  touch <filename>   - Create a new blank file',
          '  rm <filename>      - Delete a file',
          '  passwd <new_pass>  - Update system unlock passcode',
          '  sysinfo            - Output system diagnostic status',
          '  matrix             - Toggle digital stream mode',
          '  clear              - Clear terminal terminal output history'
        ];
      } else if (cmd === 'author') {
        response = ['CYBER OS was designed, coded, and brought to reality by cyber_anxhu.'];
      } else if (cmd === 'ls') {
        const files = Object.keys(fileSystem);
        response = files.length > 0 ? [files.join('   ')] : ['Directory is empty.'];
      } else if (cmd === 'cat') {
        const fileName = args[1];
        if (!fileName) {
          response = ['Usage: cat <filename>'];
        } else if (fileSystem[fileName] !== undefined) {
          response = fileSystem[fileName].split('\n');
        } else {
          response = [`cat: ${fileName}: No such file found.`];
        }
      } else if (cmd === 'touch') {
        const fileName = args[1];
        if (!fileName) {
          response = ['Usage: touch <filename>'];
        } else {
          setFileSystem({ ...fileSystem, [fileName]: '' });
          response = [`File created: ${fileName}`];
        }
      } else if (cmd === 'rm') {
        const fileName = args[1];
        if (!fileName) {
          response = ['Usage: rm <filename>'];
        } else if (fileSystem[fileName] !== undefined) {
          const newFS = { ...fileSystem };
          delete newFS[fileName];
          setFileSystem(newFS);
          response = [`Removed file: ${fileName}`];
        } else {
          response = [`rm: ${fileName}: No such file found.`];
        }
      } else if (cmd === 'passwd') {
        const newPass = args[1];
        if (!newPass) {
          response = [`Current Passcode: ${systemPassword}`, 'Usage: passwd <new_passcode>'];
        } else {
          setSystemPassword(newPass);
          response = [`SUCCESS: System passcode changed to "${newPass}"`];
        }
      } else if (cmd === 'sysinfo') {
        response = [
          'SYSTEM DIAGNOSTICS:',
          '  Kernel: CYBER-OS-v1.0-WebX86',
          '  Host Environment: Web Browser Execution',
          '  Security Protocol: Enforced Passcode Encryption',
          '  Developer: cyber_anxhu',
          `  Status: ACTIVE (Files Loaded: ${Object.keys(fileSystem).length})`
        ];
      } else if (cmd === 'matrix') {
        response = [
          '01000011 01011001 01000010 01000101 01010010 01011111 01001111 01010011',
          'Wake up, Neo...',
          'The Matrix has you.',
          'Cyber Grid Synchronized.'
        ];
      } else if (cmd === 'clear') {
        setHistory([]);
        setInput('');
        return;
      } else {
        response = [`Command non-executable: ${cmd}. Type "help" for valid inputs.`];
      }

      setHistory([...history, `cyber_anxhu@cyber-os:${currentDir}$ ${input}`, ...response]);
      setInput('');
    }
  };

  return (
    <div className={`terminal-container theme-${theme}`}>
      <div className="terminal-logs">
        {history.map((line, i) => (
          <div key={i} className="terminal-line">{line}</div>
        ))}
        <div ref={bottomRef} />
      </div>
      <div className="terminal-input-row">
        <span className="prompt">cyber_anxhu@cyber-os:{currentDir}$</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleCommand}
          autoFocus
        />
      </div>
    </div>
  );
}

function CalculatorApp() {
  const [display, setDisplay] = useState('0');

  const handleClick = (val) => {
    if (val === 'C') setDisplay('0');
    else if (val === '=') {
      try {
        setDisplay(Function(`"use strict"; return (${display})`)().toString());
      } catch {
        setDisplay('Error');
      }
    } else {
      setDisplay((prev) => (prev === '0' ? val : prev + val));
    }
  };

  return (
    <div className="calc-container">
      <div className="calc-display">{display}</div>
      <div className="calc-grid">
        {['7','8','9','/','4','5','6','*','1','2','3','-','C','0','=','+'].map((btn) => (
          <button key={btn} onClick={() => handleClick(btn)}>{btn}</button>
        ))}
      </div>
    </div>
  );
}
