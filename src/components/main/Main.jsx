import { useContext } from "react";
import { assets } from "../../assets/assets";
import "./Main.css";
import { Context } from "../../context/context";

export default function Main() {
  const { onSent, recentPrompt, showResult, loading, formattedResultData, setInput, input } = useContext(Context);

  const samplePrompts = [
    {
      title: "Road trip ideas",
      prompt: "Suggest beautiful places to see on an upcoming road trip.",
      icon: assets.compass,
    },
    {
      title: "Urban Planning",
      prompt: "Briefly summarize this concept: Urban Planning",
      icon: assets.lightbulb,
    },
    {
      title: "Team Bonding",
      prompt: "Brainstorm team bonding activities for a remote software team.",
      icon: assets.messenger,
    },
    {
      title: "Code Refactoring",
      prompt: "Improve readability and structure of modern JavaScript code.",
      icon: assets.code,
    },
  ];

  return (
    <div className="main">
      <div className="nav">
        <div className="brand-logo">
          <p className="brand-title">Nova AI</p>
          <span className="badge">v2.5 Flash</span>
        </div>
        <div className="nav-profile">
          <a href="https://shahe-aalam-ansari.netlify.app/" target="_blank" rel="noopener noreferrer">
            <img src={assets.nova} alt="Nova profile" className="avatar-img" />
          </a>
        </div>
      </div>

      <div className="main-container">
        {!showResult ? (
          <>
            <div className="greet">
              <p>
                <span className="gradient-text">Hello, Dev.</span>
              </p>
              <p className="subtitle">How can I help you today?</p>
            </div>

            <div className="cards">
              {samplePrompts.map((item, index) => (
                <div key={index} onClick={() => onSent(item.prompt)} className="card">
                  <p>{item.prompt}</p>
                  <div className="card-icon-wrap">
                    <img src={item.icon} alt={item.title} />
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="result">
            <div className="result-title">
              <div className="avatar-wrap user-avatar">
                <img src={assets.user} alt="User profile" />
              </div>
              <p>{recentPrompt}</p>
            </div>

            <div className="result-data">
              <div className="avatar-wrap nova-avatar">
                <img src={assets.nova} alt="Nova AI" />
              </div>
              {loading ? (
                <div className="loader">
                  <div className="skeleton-bar"></div>
                  <div className="skeleton-bar short"></div>
                  <div className="skeleton-bar medium"></div>
                </div>
              ) : (
                <div
                  className="formatted-content"
                  dangerouslySetInnerHTML={{ __html: formattedResultData }}
                />
              )}
            </div>
          </div>
        )}

        <div className="main-bottom">
          <div className="search-box">
            <input
              onChange={(e) => setInput(e.target.value)}
              value={input}
              type="text"
              placeholder="Ask Nova anything..."
              onKeyDown={(e) => {
                if (e.key === "Enter" && input.trim() !== "") onSent();
              }}
            />

            <div className="input-actions">
              <button className="icon-btn voice-btn" title="Voice input">
                <img src={assets.mic} alt="Voice Input" />
              </button>
              {input.trim() && (
                <button
                  onClick={() => onSent()}
                  className="send-btn"
                  title="Send message"
                >
                  <img src={assets.send} alt="Send" />
                </button>
              )}
            </div>
          </div>

          <p className="bottom-info">
            Nova AI may generate inaccurate info. Verify important details.
          </p>
          <div className="footer-link">
            <a href="https://github.com/shaheaalam244" target="_blank" rel="noopener noreferrer">
              Created by Shahe Aalam • Star on GitHub
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
