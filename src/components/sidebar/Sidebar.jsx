import "./Sidebar.css";
import { assets } from "../../assets/assets";
import { useContext, useState } from "react";
import { Context } from "../../context/context";

export default function Sidebar() {
  const [extended, setExtended] = useState(false);
  const { onSent, previousPrompts, setRecentPrompt, newChat } = useContext(Context);

  const loadPrompt = async (prompt) => {
    setRecentPrompt(prompt);
    await onSent(prompt);
  };

  return (
    <div className={`sidebar ${extended ? "extended-sidebar" : "collapsed-sidebar"}`}>
      <div className="top">
        <div className="menu-btn-container" onClick={() => setExtended((prev) => !prev)}>
          <img src={assets.menu} alt="Toggle Menu" className="menu-icon" />
        </div>

        <div onClick={() => newChat()} className={`new-chat ${extended ? "extended" : ""}`}>
          <img src={assets.plus} alt="New Chat" className="plus-icon" />
          {extended && <span>New Chat</span>}
        </div>

        {extended && (
          <div className="recent">
            <p className="recent-title">Recent Chats</p>
            <div className="recent-list">
              {previousPrompts.length === 0 ? (
                <p className="no-chats">No previous chats</p>
              ) : (
                previousPrompts.map((item, index) => (
                  <div key={index} onClick={() => loadPrompt(item)} className="recent-entry" title={item}>
                    <img src={assets.messenger} alt="Chat" />
                    <p>{item.length > 20 ? item.slice(0, 20) + "..." : item}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      <div className="bottom">
        <div className="bottom-item recent-entry">
          <a href="https://gemini.google.com/faq" target="_blank" rel="noopener noreferrer">
            <img src={assets.question} alt="Help" />
            {extended && <span>Help & FAQ</span>}
          </a>
        </div>
        <div className="bottom-item recent-entry">
          <a href="https://myactivity.google.com/product/gemini?utm_source=gemini&pli=1" target="_blank" rel="noopener noreferrer">
            <img src={assets.history} alt="Activity" />
            {extended && <span>Activity</span>}
          </a>
        </div>
        <div className="bottom-item recent-entry">
          <div className="settings-link">
            <img src={assets.setting} alt="Settings" />
            {extended && <span>Settings</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
