import React, { useState } from 'react';
import Draggable from 'react-draggable';
import { Terminal, FileText, Calculator, X, ShieldAlert, Cpu, Power } from 'lucide-react';
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
  const [isLocked, setIsLocked] = useState(false);

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
      {/* BOOT / LOCK SCREEN OVERLAY */}
      {isLocked && (
        <div className="lock-screen" onClick={() => setIsLocked(false)}>
          <Cpu size={64} color="#00f0ff" className="glow-icon" />
          <h1 className="cyber-title">CYBER OS</h1>
          <p className="cyber-credits">Designed, coded, and made into reality by <span>cyber_anxhu</span></p>
          <button className="unlock-btn">CLICK TO INITIALIZE SYSTEM</button>
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
                {appId === 'notepad' && <NotepadApp />}
                {appId === 'terminal' && <TerminalApp />}
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
              <Power size={14} /> Lock System
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
function NotepadApp() {
  const [text, setText] = useState(
    "SYSTEM MANIFEST:\n========================\nOS NAME: CYBER OS\nARCH: Web-X86-Virtual\n\nDESIGNED, CODED, AND MADE INTO REALITY BY:\n-> cyber_anxhu\n\nNotes:\nDouble-click desktop icons or access the start menu to launch applications."
  );
  return (
    <textarea
      className="notepad-textarea"
      value={text}
      onChange={(e) => setText(e.target.value)}
    />
  );
}

function TerminalApp() {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([
    'CYBER OS Terminal Kernel v1.0 initialized.',
    'System created by cyber_anxhu.',
    'Type "help" or "author" for commands.'
  ]);

  const handleCommand = (e) => {
    if (e.key === 'Enter') {
      const cmd = input.trim().toLowerCase();
      let response = '';

      if (cmd === 'help') response = 'Commands: help, author, system, clear, matrix';
      else if (cmd === 'author') response = 'CYBER OS was designed, coded, and made into reality by cyber_anxhu.';
      else if (cmd === 'system') response = 'CYBER OS v1.0 - Running inside Web Architecture.';
      else if (cmd === 'matrix') response = 'Entering Cyber Grid... Access Granted.';
      else if (cmd === 'clear') {
        setHistory([]);
        setInput('');
        return;
      } else response = `Command not recognized: ${cmd}`;

      setHistory([...history, `> ${input}`, response]);
      setInput('');
    }
  };

  return (
    <div className="terminal-container">
      {history.map((line, i) => (
        <div key={i}>{line}</div>
      ))}
      <div className="terminal-input-row">
        <span>cyber_anxhu@cyber-os:~$</span>
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
