import React, { useState, useRef, useEffect, useMemo } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { 
  Download, Trash2, Link as LinkIcon, Type, Mail, Phone, Wifi, Image as ImageIcon, 
  Settings2, Palette, ChevronDown, Upload, QrCode, Smile, Copy, Target
} from 'lucide-react';

function App() {
  // Check if we are in "View" mode
  const urlParams = new URLSearchParams(window.location.search);
  
  // Custom Page Params
  const viewEmoji = urlParams.get('emoji');
  const viewText = urlParams.get('text');
  const viewImageUrl = urlParams.get('img');
  const viewCopyText = urlParams.get('copy');
  
  // Festronix Round 3 Params
  const viewFestronix = urlParams.get('festronix');
  const viewNum = urlParams.get('num');
  const viewClue = urlParams.get('clue');

  const [viewCopied, setViewCopied] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  
  // Generate a random string ONCE per session to pad URLs without causing the QR code to flicker or look artificial
  const RANDOM_PAD = useMemo(() => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 1000; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }, []);

  const handleViewCopy = () => {
    if (viewCopyText) {
      navigator.clipboard.writeText(viewCopyText);
      setViewCopied(true);
      setTimeout(() => setViewCopied(false), 2000);
    }
  };

  // Render Festronix 2K26 Round 3 Special Page
  if (viewFestronix) {
    return (
      <div className="min-h-screen text-white flex flex-col items-center justify-center p-6 py-12 text-center font-sans relative overflow-y-auto bg-cover bg-center bg-fixed" style={{ backgroundImage: 'url("/festronix-bg.jpg")' }}>
        <style>{`
          .hide-scrollbar::-webkit-scrollbar { display: none; }
          .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        `}</style>
        
        {/* Dark overlay for readability */}
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm pointer-events-none"></div>
        
        <div className="z-10 bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/20 shadow-2xl max-w-sm w-full">
          <h2 className="text-xl font-bold tracking-widest text-red-200 mb-1">FESTRONIX 2K26</h2>
          <h1 className="text-3xl font-black text-white mb-6 uppercase tracking-wider">Round 3: QR Connection</h1>
          
          <div className="bg-white rounded-2xl p-6 shadow-inner mb-6 w-full max-w-full overflow-hidden border-2 border-red-100 flex flex-col">
            <p className="text-gray-500 font-bold text-sm uppercase mb-3 shrink-0">Secret Data Revealed</p>
            
            <div className="flex flex-col gap-3 w-full">
              {viewNum ? viewNum.split('\n').filter(line => line.trim()).map((line, index) => (
                <div key={index} className="flex items-center bg-[#f4f4f5] rounded-md shadow-sm border border-gray-200 shrink-0">
                  <div className="text-sm md:text-base font-mono text-gray-800 whitespace-nowrap overflow-x-auto p-4 text-left flex-1 hide-scrollbar">
                    {line}
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(line);
                      setCopiedIndex(index);
                      setTimeout(() => setCopiedIndex(null), 2000);
                    }}
                    className="p-4 h-full flex items-center justify-center border-l border-gray-200 hover:bg-gray-200 transition-colors text-gray-500 hover:text-red-600 shrink-0"
                    title="Copy this line"
                  >
                    {copiedIndex === index ? <span className="text-xs font-bold text-red-600 px-1">Copied!</span> : <Copy size={18} />}
                  </button>
                </div>
              )) : (
                <div className="text-sm md:text-base font-mono text-gray-800 whitespace-nowrap overflow-x-auto p-4 text-left bg-[#f4f4f5] rounded-md shadow-sm border border-gray-200 shrink-0 hide-scrollbar">
                  ??
                </div>
              )}
            </div>

            {viewNum && (
              <button
                onClick={() => {
                  navigator.clipboard.writeText(viewNum);
                  setViewCopied(true);
                  setTimeout(() => setViewCopied(false), 2000);
                }}
                className="mt-5 w-full flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-700 py-2.5 rounded-xl font-bold transition-colors border border-red-100"
              >
                <Copy size={18} />
                {viewCopied ? 'Copied All!' : 'Copy All Data'}
              </button>
            )}
          </div>
          
          {viewClue && (
            <div className="bg-black/40 rounded-xl p-5 text-left border border-white/10 mt-6 shadow-lg">
              <p className="text-red-300 text-xs font-bold uppercase mb-2">Technical Clue:</p>
              <p className="text-white font-medium text-lg">{viewClue}</p>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-white/20">
            <p className="text-sm font-bold text-red-200 tracking-wider">SCAN • DECODE • CONNECT</p>
            <p className="text-xs text-gray-300 mt-2">Write this number's meaning in your answer sheet quickly!</p>
          </div>
        </div>
      </div>
    );
  }

  // Render Custom Prank Page
  if (viewEmoji || viewText || viewImageUrl || viewCopyText) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 text-center">
        {viewImageUrl && <img src={viewImageUrl} alt="Custom" className="max-w-full max-h-[50vh] rounded-2xl shadow-xl mb-6" />}
        {!viewImageUrl && viewEmoji && <div className="text-[120px] md:text-[180px] leading-none mb-6 animate-bounce">{viewEmoji}</div>}
        {viewText && <h1 className="text-4xl md:text-6xl font-black text-gray-800 tracking-tight mt-4">{viewText}</h1>}
        
        {viewCopyText && (
          <div className="mt-10 flex flex-col items-center gap-4">
            <div className="bg-white px-8 py-5 rounded-2xl border border-gray-200 shadow-sm text-gray-800 font-mono text-xl max-w-md break-all">
              {viewCopyText}
            </div>
            <button
              onClick={handleViewCopy}
              className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-3.5 rounded-xl font-bold shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Copy size={20} />
              {viewCopied ? 'Copied to Clipboard!' : 'Copy Text'}
            </button>
          </div>
        )}
      </div>
    );
  }

  // --- Generator State ---
  const [activeTab, setActiveTab] = useState('festronix');
  
  // Data States
  const [linkData, setLinkData] = useState('');
  const [textData, setTextData] = useState('');
  const [emailData, setEmailData] = useState({ to: '', subject: '', body: '' });
  const [phoneData, setPhoneData] = useState('');
  const [wifiData, setWifiData] = useState({ ssid: '', password: '', encryption: 'WPA' });
  const [pageData, setPageData] = useState({ emoji: '😌', text: 'better luck next time', imageUrl: '', copyText: '' });
  const [festData, setFestData] = useState({ num: '', clue: '' });
  
  // Style States
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [logoImg, setLogoImg] = useState(null);

  const [qrValue, setQrValue] = useState('');
  const [copied, setCopied] = useState(false);
  const qrRef = useRef(null);
  const logoInputRef = useRef(null);

  const handleCopy = () => {
    if (qrValue) {
      navigator.clipboard.writeText(qrValue);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Generate QR Value based on active tab
  useEffect(() => {
    let value = '';
    switch (activeTab) {
      case 'festronix':
        if (festData.num || festData.clue) {
          let customUrl = new URL(window.location.origin);
          customUrl.searchParams.set('festronix', 'true');
          if (festData.num) customUrl.searchParams.set('num', festData.num);
          if (festData.clue) customUrl.searchParams.set('clue', festData.clue);
          
          // Force all Festronix QR codes to look identical by padding the URL length
          // This prevents participants from distinguishing real vs fake codes by density!
          let currentUrlStr = customUrl.toString();
          let targetLength = 800; 
          if (currentUrlStr.length < targetLength) {
            let paddingAmount = targetLength - currentUrlStr.length - 6; // 6 is for "&_pad="
            if (paddingAmount > 0) {
              customUrl.searchParams.set('_pad', 'X'.repeat(paddingAmount));
            }
          }
          value = customUrl.toString();
        }
        break;
      case 'page':
        if (pageData.emoji || pageData.text || pageData.imageUrl || pageData.copyText) {
          let customUrl = new URL(window.location.origin);
          if (pageData.emoji) customUrl.searchParams.set('emoji', pageData.emoji);
          if (pageData.text) customUrl.searchParams.set('text', pageData.text);
          if (pageData.imageUrl) customUrl.searchParams.set('img', pageData.imageUrl);
          if (pageData.copyText) customUrl.searchParams.set('copy', pageData.copyText);
          
          // Force Custom Page QR codes to also look identical by padding the URL length
          // This ensures the fake 'better luck next time' codes match the real Festronix codes!
          let currentUrlStr = customUrl.toString();
          let targetLength = 800; 
          if (currentUrlStr.length < targetLength) {
            let paddingAmount = targetLength - currentUrlStr.length - 6; // 6 is for "&_pad="
            if (paddingAmount > 0) {
              customUrl.searchParams.set('_pad', 'X'.repeat(paddingAmount));
            }
          }
          
          value = customUrl.toString();
        }
        break;
      case 'link':
        value = linkData;
        break;
      case 'text':
        value = textData;
        break;
      case 'email':
        if (emailData.to) {
          value = `mailto:${emailData.to}?subject=${encodeURIComponent(emailData.subject)}&body=${encodeURIComponent(emailData.body)}`;
        }
        break;
      case 'phone':
        if (phoneData) value = `tel:${phoneData}`;
        break;
      case 'wifi':
        if (wifiData.ssid) {
          value = `WIFI:T:${wifiData.encryption};S:${wifiData.ssid};P:${wifiData.password};;`;
        }
        break;
    }
    setQrValue(value);
  }, [activeTab, linkData, textData, emailData, phoneData, wifiData, pageData, festData]);


  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setLogoImg(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const clearLogo = () => {
    setLogoImg(null);
    if (logoInputRef.current) logoInputRef.current.value = '';
  };

  const handleDownload = () => {
    if (!qrRef.current) return;
    const svg = qrRef.current.querySelector('svg');
    if (!svg) return;
    
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.fillStyle = bgColor; // Use background color
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = "qrcode.png";
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    
    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  };

  const tabs = [
    { id: 'festronix', icon: Target, label: 'Round 3 (Festronix)' },
    { id: 'page', icon: Smile, label: 'Custom Page' },
    { id: 'link', icon: LinkIcon, label: 'Link' },
    { id: 'text', icon: Type, label: 'Text' },
    { id: 'email', icon: Mail, label: 'Email' },
    { id: 'wifi', icon: Wifi, label: 'WiFi' },
  ];

  return (
    <div className="min-h-screen p-4 md:p-8 font-sans bg-cover bg-center bg-fixed relative" style={{ backgroundImage: 'url("/festronix-bg.jpg")' }}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] pointer-events-none"></div>
      
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8 items-start relative z-10">
        
        {/* Left Column - Controls */}
        <div className="w-full lg:w-2/3 bg-white/70 backdrop-blur-xl border border-white/40 shadow-2xl rounded-3xl p-6 md:p-8 transition-all">
          
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-indigo-600 mb-2">
              Festronix2K26 QR
            </h1>
            <p className="text-gray-500 font-medium">Select a type, enter your data, and generate your QR codes.</p>
          </div>

          {/* Type Selector Tabs */}
          <div className="flex flex-wrap gap-2 mb-8 p-1 bg-gray-100/50 rounded-2xl border border-gray-100">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 min-w-[80px] flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl transition-all duration-300 ${
                  activeTab === tab.id 
                    ? (tab.id === 'festronix' ? 'bg-red-600 text-white shadow-md shadow-red-500/30' : 'bg-white text-indigo-600 shadow-md scale-100')
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50 scale-95 hover:scale-100'
                }`}
              >
                <tab.icon size={20} />
                <span className="text-xs font-semibold whitespace-nowrap">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Input Fields based on active tab */}
          <div className="space-y-5 mb-10 min-h-[160px]">
            {activeTab === 'festronix' && (
              <div className="space-y-4">
                <div className="p-4 bg-red-50 text-red-700 rounded-xl text-sm font-bold border border-red-200 flex items-start gap-3 shadow-sm">
                  <span className="text-2xl">🏆</span>
                  <p>Special mode for FESTRONIX 2K26! This creates a stunning themed webpage for participants to scan during "Round 3: QR Connection".</p>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 ml-1">Secret Data (Text, Number, or Binary Block)</label>
                    <textarea 
                      rows="4" placeholder="e.g. 01001001 01101111 01010100" value={festData.num} onChange={e => setFestData({...festData, num: e.target.value})}
                      className="w-full text-center text-lg font-bold px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all outline-none resize-none"
                    ></textarea>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 ml-1">Extra Clue / Meaning (Optional)</label>
                    <input 
                      type="text" placeholder="e.g. Find the logic gate" value={festData.clue} onChange={e => setFestData({...festData, clue: e.target.value})}
                      className="w-full px-4 py-3.5 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'page' && (
              <div className="space-y-4">
                <div className="p-4 bg-indigo-50 text-indigo-700 rounded-xl text-sm font-medium border border-indigo-100">
                  This creates a QR code that opens a webpage on the scanner's phone showing an image (or emoji) and a custom message!
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-2 md:col-span-1">
                    <label className="text-sm font-semibold text-gray-700 ml-1">Emoji</label>
                    <input 
                      type="text" placeholder="😌" value={pageData.emoji} onChange={e => setPageData({...pageData, emoji: e.target.value})}
                      className="w-full text-center text-2xl px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-3">
                    <label className="text-sm font-semibold text-gray-700 ml-1">Message Text</label>
                    <input 
                      type="text" placeholder="better luck next time" value={pageData.text} onChange={e => setPageData({...pageData, text: e.target.value})}
                      className="w-full px-4 py-3.5 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-4 mt-2">
                    <label className="text-sm font-semibold text-gray-700 ml-1">Or Image URL (instead of emoji)</label>
                    <input 
                      type="url" placeholder="https://example.com/image.png" value={pageData.imageUrl} onChange={e => setPageData({...pageData, imageUrl: e.target.value})}
                      className="w-full px-4 py-3.5 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-4 mt-2">
                    <label className="text-sm font-semibold text-gray-700 ml-1">Copyable Text (Adds a 'Copy' button on the prank page)</label>
                    <input 
                      type="text" placeholder="e.g. 01001001 01101111 01010100" value={pageData.copyText} onChange={e => setPageData({...pageData, copyText: e.target.value})}
                      className="w-full px-4 py-3.5 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'link' && (
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 ml-1">Website URL</label>
                <input 
                  type="url" placeholder="https://example.com" value={linkData} onChange={e => setLinkData(e.target.value)}
                  className="w-full px-4 py-3.5 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                />
              </div>
            )}

            {activeTab === 'text' && (
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 ml-1">Plain Text</label>
                <textarea 
                  rows="4" placeholder="Enter your message here..." value={textData} onChange={e => setTextData(e.target.value)}
                  className="w-full px-4 py-3.5 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none resize-none"
                ></textarea>
              </div>
            )}

            {activeTab === 'email' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 ml-1">Email To</label>
                  <input type="email" placeholder="example@mail.com" value={emailData.to} onChange={e => setEmailData({...emailData, to: e.target.value})} className="w-full px-4 py-3.5 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 ml-1">Subject</label>
                  <input type="text" placeholder="Email Subject" value={emailData.subject} onChange={e => setEmailData({...emailData, subject: e.target.value})} className="w-full px-4 py-3.5 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 ml-1">Message Body</label>
                  <textarea rows="2" placeholder="Write your email here..." value={emailData.body} onChange={e => setEmailData({...emailData, body: e.target.value})} className="w-full px-4 py-3.5 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none resize-none"></textarea>
                </div>
              </div>
            )}

            {activeTab === 'wifi' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 ml-1">Network Name (SSID)</label>
                  <input type="text" placeholder="MyWiFiNetwork" value={wifiData.ssid} onChange={e => setWifiData({...wifiData, ssid: e.target.value})} className="w-full px-4 py-3.5 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 ml-1">Password</label>
                    <input type="text" placeholder="Password" value={wifiData.password} onChange={e => setWifiData({...wifiData, password: e.target.value})} className="w-full px-4 py-3.5 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 ml-1">Encryption</label>
                    <select value={wifiData.encryption} onChange={e => setWifiData({...wifiData, encryption: e.target.value})} className="w-full px-4 py-3.5 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none appearance-none">
                      <option value="WPA">WPA/WPA2</option>
                      <option value="WEP">WEP</option>
                      <option value="nopass">None</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          <hr className="border-gray-100 my-8" />

          {/* Styling Options */}
          <div>
            <h2 className="flex items-center gap-2 text-xl font-bold text-gray-800 mb-6">
              <Palette size={22} className="text-indigo-500" />
              Customize Appearance
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Colors */}
              <div className="space-y-5 bg-white/40 p-5 rounded-2xl border border-gray-50">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Colors</h3>
                
                <div className="flex items-center justify-between gap-4">
                  <label className="text-sm font-medium text-gray-700">QR Color</label>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-400 uppercase">{fgColor}</span>
                    <input type="color" value={fgColor} onChange={e => setFgColor(e.target.value)} className="w-10 h-10 rounded-lg cursor-pointer border-0 bg-transparent p-0" />
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <label className="text-sm font-medium text-gray-700">Background</label>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-400 uppercase">{bgColor}</span>
                    <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} className="w-10 h-10 rounded-lg cursor-pointer border-0 bg-transparent p-0" />
                  </div>
                </div>
              </div>

              {/* Logo */}
              <div className="space-y-4 bg-white/40 p-5 rounded-2xl border border-gray-50">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Center Logo</h3>
                
                {!logoImg ? (
                  <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => logoInputRef.current?.click()}>
                    <Upload size={24} className="mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600 font-medium">Click to upload logo</p>
                    <p className="text-xs text-gray-400 mt-1">PNG, JPG or SVG</p>
                    <input type="file" ref={logoInputRef} onChange={handleLogoUpload} accept="image/*" className="hidden" />
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3">
                      <img src={logoImg} alt="Logo preview" className="w-10 h-10 object-contain rounded-md bg-gray-50" />
                      <span className="text-sm font-medium text-gray-700">Custom Logo</span>
                    </div>
                    <button onClick={clearLogo} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                )}
              </div>

            </div>
          </div>
          
        </div>

        {/* Right Column - Preview */}
        <div className="w-full lg:w-1/3 sticky top-8">
          <div className="bg-white/70 backdrop-blur-xl border border-white/40 shadow-2xl rounded-3xl p-6 md:p-8 flex flex-col items-center">
            
            <h2 className="text-lg font-bold text-gray-800 mb-6 self-start w-full text-center">Live Preview</h2>
            
            <div 
              className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-8 transition-transform hover:scale-105 duration-300 w-full aspect-square flex items-center justify-center relative overflow-hidden group"
            >
              {!qrValue ? (
                <div className="text-center p-6 flex flex-col items-center justify-center opacity-40">
                  <QrCode size={64} className="text-gray-300 mb-4" />
                  <p className="text-sm font-medium text-gray-400">Enter data to generate</p>
                </div>
              ) : (
                <div ref={qrRef} className="w-full h-full flex items-center justify-center">
                  <QRCodeSVG 
                    value={qrValue} 
                    size={256}
                    level="H"
                    fgColor={fgColor}
                    bgColor={bgColor}
                    includeMargin={true}
                    style={{ width: '100%', height: '100%' }}
                    imageSettings={logoImg ? {
                      src: logoImg,
                      height: 50,
                      width: 50,
                      excavate: true,
                    } : undefined}
                  />
                </div>
              )}
            </div>

            <div className="flex flex-col gap-3 w-full">
              <button
                onClick={handleDownload}
                disabled={!qrValue}
                className={`w-full flex items-center justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg text-white font-semibold text-lg transition-all duration-300 ${activeTab === 'festronix' ? 'bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 shadow-red-500/30' : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-indigo-500/30'} disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <Download size={20} className="mr-2" />
                Download PNG
              </button>
              
              <button
                onClick={handleCopy}
                disabled={!qrValue}
                className="w-full flex items-center justify-center py-3.5 px-4 border-2 border-indigo-100 rounded-xl text-indigo-600 bg-white hover:bg-indigo-50 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 font-semibold text-lg transition-all duration-300"
              >
                <Copy size={20} className="mr-2" />
                {copied ? 'Copied to clipboard!' : 'Copy Link / Text'}
              </button>
            </div>
            
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;
