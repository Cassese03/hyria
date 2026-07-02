import React, { useState, useEffect, useRef } from "react";
import "../styles/streaming.css";

// Interface for Live Chat messages
interface ChatMessage {
  id: number;
  username: string;
  text: string;
  time: string;
  role: "mod" | "fan" | "viewer";
}

// Interface for Past Matches
interface PastMatch {
  id: number;
  title: string;
  date: string;
  duration: string;
  thumbnail: string;
  videoUrl: string;
}

const LiveBasketMatch: React.FC<{ streamUrl: string }> = ({ streamUrl }) => {
  // Funzione per estrarre il nome del canale (es. "nezak_" o "hyria_basket") dall'URL
  const getChannelName = (url: string) => {
    if (url.includes('twitch.tv/')) {
      return url.split('twitch.tv/')[1].split('/')[0].split('?')[0];
    }
    return 'hyria_basket'; // Fallback di sicurezza
  };

  const channelName = getChannelName(streamUrl);

  // Costruiamo l'URL per l'iframe. 
  // IMPORTANTE: Quando pubblicherai il sito, aggiungi il tuo dominio reale. 
  // Esempio: &parent=localhost&parent=www.iltuosito.it
  const twitchSrc = `https://player.twitch.tv/?channel=${channelName}&parent=hyriabasket.it&parent=www.hyriabasket.it&parent=localhost`;

  return (
    <div className="video-player-wrapper" style={{ position: "relative", paddingTop: "56.25%", backgroundColor: "#000" }}>
      <iframe
        src={twitchSrc}
        height="100%"
        width="100%"
        style={{ height: "100%", position: "absolute", top: 0, left: 0, border: "none" }}
        allowFullScreen
      />
    </div>
  );
};

const Streaming: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"formazioni" | "tabellino">("tabellino");
  const [streamUrl, setStreamUrl] = useState<string>("https://www.twitch.tv/hyria_basket");
  const [inputMessage, setInputMessage] = useState<string>("");
  const [viewersCount, setViewersCount] = useState<number>(342);

  // Initial chat messages
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: 1, username: "Marco_Nola", text: "Forza ragazzi! Stasera si vince!", time: "21:15", role: "fan" },
    { id: 2, username: "BasketLove99", text: "Ma stiamo giocando con le maglie nere o bianche?", time: "21:16", role: "viewer" },
    { id: 3, username: "HyriaStaff", text: "Benvenuti alla diretta streaming! Ricordiamo di mantenere un comportamento corretto in chat.", time: "21:16", role: "mod" },
    { id: 4, username: "coach_gianni", text: "Grande difesa in questo primo quarto, continuiamo così!", time: "21:17", role: "fan" },
    { id: 5, username: "Peppe_88", text: "Sorrentino caldissimo da tre punti oggi! 🔥🏀", time: "21:18", role: "fan" },
  ]);

  const chatMessagesRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat to bottom
  const scrollToBottom = () => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  // Simulate viewer count fluctuation
  useEffect(() => {
    const viewerInterval = setInterval(() => {
      setViewersCount(prev => {
        const change = Math.floor(Math.random() * 9) - 4; // -4 to +4
        return Math.max(150, prev + change);
      });
    }, 8000);
    return () => clearInterval(viewerInterval);
  }, []);

  // Simulated live chat feed from other fans
  const mockComments = [
    { username: "Raffaele_K", text: "Mamma mia che stoppata!!! 😮", role: "viewer" },
    { username: "AntoNola", text: "Forza Hyria! Nola è con voi!", role: "fan" },
    { username: "Laura_basket", text: "Arbitro ma questo era fallo netto!", role: "viewer" },
    { username: "HyriaStaff", text: "Secondo quarto in corso, punteggio equilibrato.", role: "mod" },
    { username: "Salva_N", text: "Sorrentino MVP indiscusso stasera, incredibile.", role: "fan" },
    { username: "Carmine_V", text: "Difesa di ferro raga, non facciamoli tirare da tre!", role: "fan" },
    { username: "Giulia_B", text: "Forza Nola! Dai ragazzi non molliamo! 💪🏀", role: "fan" },
    { username: "GennaroBasket", text: "Che transizione pazzesca! Assist capolavoro.", role: "viewer" },
  ];

  useEffect(() => {
    const chatInterval = setInterval(() => {
      const randomMsg = mockComments[Math.floor(Math.random() * mockComments.length)];
      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

      setChatMessages(prev => [
        ...prev,
        {
          id: Date.now(),
          username: randomMsg.username,
          text: randomMsg.text,
          time: timeStr,
          role: randomMsg.role as any
        }
      ]);
    }, 6000); // New message every 6 seconds

    return () => clearInterval(chatInterval);
  }, []);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newMsg: ChatMessage = {
      id: Date.now(),
      username: "Tu (Tifoso)",
      text: inputMessage.trim(),
      time: timeStr,
      role: "fan"
    };

    setChatMessages(prev => [...prev, newMsg]);
    setInputMessage("");
  };

  // Past matches data
  const pastMatches: PastMatch[] = [
    {
      id: 1,
      title: "Hyria Basket Nola vs Pallacanestro Avellino",
      date: "25 Giugno 2026",
      duration: "1:42:15",
      thumbnail: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&h=340&fit=crop&q=80",
      videoUrl: "https://www.youtube.com/watch?v=F3_S_qS4pP8"
    },
    {
      id: 2,
      title: "Hyria Basket Nola vs Sporting Club Ercolano",
      date: "18 Giugno 2026",
      duration: "1:35:40",
      thumbnail: "https://images.unsplash.com/photo-1519766304817-4f37bda74a27?w=600&h=340&fit=crop&q=80",
      videoUrl: "https://www.youtube.com/watch?v=F3_S_qS4pP8"
    },
    {
      id: 3,
      title: "Basket Caserta vs Hyria Basket Nola",
      date: "11 Giugno 2026",
      duration: "1:51:10",
      thumbnail: "https://images.unsplash.com/photo-1519861531473-9200262188bf?w=600&h=340&fit=crop&q=80",
      videoUrl: "https://www.youtube.com/watch?v=F3_S_qS4pP8"
    }
  ];

  return (
    <div className="streaming-page">
      <div className="streaming-container">

        {/* Left Side: Video + Description + Details */}
        <div className="streaming-main-content">
          <div className="streaming-header">
            <div className="streaming-title-area">
              <div className="live-badge-container">
                <span className="live-badge">
                  <span className="live-pulse-dot"></span>
                  LIVE
                </span>
                <span className="viewer-count">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: "16px", height: "16px" }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>
                  {viewersCount} Spettatori
                </span>
              </div>
              <h1 className="streaming-title">LIVE: Hyria Basket Nola vs Partenope Basket</h1>
            </div>
          </div>

          {/* Video Player */}
          <LiveBasketMatch streamUrl={streamUrl} />

          {/* Details & Info Tabs */}
          <div className="dashboard-tabs">
            <button
              className={`tab-btn ${activeTab === "tabellino" ? "active" : ""}`}
              onClick={() => setActiveTab("tabellino")}
            >
              Tabellino & Stats
            </button>
            <button
              className={`tab-btn ${activeTab === "formazioni" ? "active" : ""}`}
              onClick={() => setActiveTab("formazioni")}
            >
              Formazioni
            </button>
          </div>

          <div className="tab-content">
            {activeTab === "tabellino" && (
              <div className="tab-pane-tabellino">
                {/* Scoreboard Table */}
                <div className="scoreboard-wrapper">
                  <h3 className="scoreboard-title">Punteggio Live</h3>
                  <table className="score-table">
                    <thead>
                      <tr>
                        <th style={{ textAlign: "left" }}>Squadra</th>
                        <th>Q1</th>
                        <th>Q2</th>
                        <th>Q3</th>
                        <th>Q4</th>
                        <th>Tot</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="team-cell-name" style={{ color: "#d96c00" }}>HYRIA BASKET NOLA</td>
                        <td>24</td>
                        <td>18</td>
                        <td>22</td>
                        <td>-</td>
                        <td className="total-score-cell">64</td>
                      </tr>
                      <tr>
                        <td className="team-cell-name">PARTENOPE BASKET</td>
                        <td>20</td>
                        <td>21</td>
                        <td>17</td>
                        <td>-</td>
                        <td className="total-score-cell" style={{ color: "white" }}>58</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Match Statistics */}
                <div className="stats-grid">
                  <div className="stat-box">
                    <h4 className="stat-box-title">Statistiche Squadra</h4>

                    <div className="stat-item">
                      <div className="stat-labels">
                        <span>54%</span>
                        <span>Tiri dal campo</span>
                        <span>48%</span>
                      </div>
                      <div className="stat-bar-container">
                        <div className="stat-bar-home" style={{ width: "54%" }}></div>
                        <div className="stat-bar-guest" style={{ width: "46%" }}></div>
                      </div>
                    </div>

                    <div className="stat-item">
                      <div className="stat-labels">
                        <span>42%</span>
                        <span>Tiri da tre punti</span>
                        <span>35%</span>
                      </div>
                      <div className="stat-bar-container">
                        <div className="stat-bar-home" style={{ width: "42%" }}></div>
                        <div className="stat-bar-guest" style={{ width: "58%" }}></div>
                      </div>
                    </div>

                    <div className="stat-item">
                      <div className="stat-labels">
                        <span>78%</span>
                        <span>Tiri liberi</span>
                        <span>72%</span>
                      </div>
                      <div className="stat-bar-container">
                        <div className="stat-bar-home" style={{ width: "78%" }}></div>
                        <div className="stat-bar-guest" style={{ width: "22%" }}></div>
                      </div>
                    </div>
                  </div>

                  <div className="stat-box">
                    <h4 className="stat-box-title">Confronto di Gioco</h4>

                    <div className="stat-item">
                      <div className="stat-labels">
                        <span>28</span>
                        <span>Rimbalzi</span>
                        <span>24</span>
                      </div>
                      <div className="stat-bar-container">
                        <div className="stat-bar-home" style={{ width: "54%" }}></div>
                        <div className="stat-bar-guest" style={{ width: "46%" }}></div>
                      </div>
                    </div>

                    <div className="stat-item">
                      <div className="stat-labels">
                        <span>14</span>
                        <span>Assist</span>
                        <span>12</span>
                      </div>
                      <div className="stat-bar-container">
                        <div className="stat-bar-home" style={{ width: "54%" }}></div>
                        <div className="stat-bar-guest" style={{ width: "46%" }}></div>
                      </div>
                    </div>

                    <div className="stat-item">
                      <div className="stat-labels">
                        <span>6</span>
                        <span>Palle recuperate</span>
                        <span>8</span>
                      </div>
                      <div className="stat-bar-container">
                        <div className="stat-bar-home" style={{ width: "43%" }}></div>
                        <div className="stat-bar-guest" style={{ width: "57%" }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "formazioni" && (
              <div className="rosters-grid">
                <div className="roster-team-panel">
                  <h3 className="roster-team-name">Hyria Basket Nola</h3>
                  <div className="players-list">
                    <div className="player-row"><span className="player-number">4</span><span className="player-name">Sorrentino A. (C)</span><span className="player-role">Playmaker</span></div>
                    <div className="player-row"><span className="player-number">8</span><span className="player-name">Napolitano R.</span><span className="player-role">Guardia</span></div>
                    <div className="player-row"><span className="player-number">10</span><span className="player-name">Gallo F.</span><span className="player-role">Ala Piccola</span></div>
                    <div className="player-row"><span className="player-number">15</span><span className="player-name">Russo M.</span><span className="player-role">Ala Grande</span></div>
                    <div className="player-row"><span className="player-number">23</span><span className="player-name">Barbato D.</span><span className="player-role">Centro</span></div>
                    <div className="player-row" style={{ borderBottom: "none", color: "rgba(255,255,255,0.6)" }}><span className="player-number">All.</span><span className="player-name">Nobile V.</span><span className="player-role" style={{ backgroundColor: "rgba(255,255,255,0.02)" }}>Coach</span></div>
                  </div>
                </div>

                <div className="roster-team-panel">
                  <h3 className="roster-team-name guest">Partenope Basket</h3>
                  <div className="players-list">
                    <div className="player-row"><span className="player-number">5</span><span className="player-name">Esposito L.</span><span className="player-role">Playmaker</span></div>
                    <div className="player-row"><span className="player-number">7</span><span className="player-name">De Rosa G.</span><span className="player-role">Guardia</span></div>
                    <div className="player-row"><span className="player-number">11</span><span className="player-name">Mancini P.</span><span className="player-role">Ala Piccola</span></div>
                    <div className="player-row"><span className="player-number">14</span><span className="player-name">Vitale F.</span><span className="player-role">Ala Grande</span></div>
                    <div className="player-row"><span className="player-number">18</span><span className="player-name">Giordano R.</span><span className="player-role">Centro</span></div>
                    <div className="player-row" style={{ borderBottom: "none", color: "rgba(255,255,255,0.6)" }}><span className="player-number">All.</span><span className="player-name">Rossi A.</span><span className="player-role" style={{ backgroundColor: "rgba(255,255,255,0.02)" }}>Coach</span></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Chat Panel */}
        <div className="live-chat-panel">
          <div className="chat-header">
            <h3 className="chat-header-title">Live Chat</h3>
            <span style={{ fontSize: "0.75rem", color: "#10b981", display: "flex", alignItems: "center", gap: "0.25rem", fontWeight: "bold" }}>
              <span style={{ width: "6px", height: "6px", backgroundColor: "#10b981", borderRadius: "50%" }}></span>
              Connesso
            </span>
          </div>

          <div className="chat-messages" ref={chatMessagesRef}>
            {chatMessages.map(msg => (
              <div className="chat-message" key={msg.id}>
                <div className="chat-message-meta">
                  {msg.role === "mod" && <span className="badge-mod">MOD</span>}
                  {msg.role === "fan" && <span className="badge-fan">FAN</span>}
                  <span className="chat-username" style={{ color: msg.role === 'mod' ? '#10b981' : msg.role === 'fan' ? '#d96c00' : '#f8fafc' }}>
                    {msg.username}
                  </span>
                  <span className="chat-message-time">{msg.time}</span>
                </div>
                <div className="chat-message-text">{msg.text}</div>
              </div>
            ))}
          </div>

          <div className="chat-input-area">
            <form className="chat-form" onSubmit={handleSendMessage}>
              <input
                type="text"
                className="chat-input"
                placeholder="Invia un messaggio in chat..."
                value={inputMessage}
                onChange={e => setInputMessage(e.target.value)}
                maxLength={150}
              />
              <button type="submit" className="chat-submit-btn" aria-label="Invia messaggio">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: "18px", height: "18px" }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                </svg>
              </button>
            </form>
          </div>
        </div>

      </div>

      {/* Past Streams Section */}
      <div className="past-matches-section">
        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
          <h2 className="past-matches-title">Partite Precedenti (On-Demand)</h2>
          <div className="past-matches-grid">
            {pastMatches.map(match => (
              <div
                key={match.id}
                className="past-match-card"
                onClick={() => setStreamUrl(match.videoUrl)}
              >
                <div className="past-match-thumbnail">
                  <img src={match.thumbnail} alt={match.title} />
                  <div className="play-overlay-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" style={{ width: "20px", height: "20px" }}>
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                  <span className="video-duration">{match.duration}</span>
                </div>
                <div className="past-match-info">
                  <span className="past-match-date">{match.date}</span>
                  <h3 className="past-match-card-title">{match.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Streaming;
