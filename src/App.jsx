import React, { useState, useRef, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { 
  Download, Trash2, Link as LinkIcon, Type, Mail, Phone, Wifi, Image as ImageIcon, 
  Settings2, Palette, ChevronDown, Upload, QrCode, Smile, Copy
} from 'lucide-react';

function App() {
  // Check if we are in "View" mode
  const urlParams = new URLSearchParams(window.location.search);
  const viewEmoji = urlParams.get('emoji');
  const viewText = urlParams.get('text');
  const viewImageUrl = urlParams.get('img');

  if (viewEmoji || viewText || viewImageUrl) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 text-center">
        {viewImageUrl && <img src={viewImageUrl} alt="Custom" className="max-w-full max-h-[50vh] rounded-2xl shadow-xl mb-6" />}
        {!viewImageUrl && viewEmoji && <div className="text-[120px] md:text-[180px] leading-none mb-6 animate-bounce">{viewEmoji}</div>}
        {viewText && <h1 className="text-4xl md:text-6xl font-black text-gray-800 tracking-tight mt-4">{viewText}</h1>}
      </div>
    );
  }

  // --- Generator State ---
  const [activeTab, setActiveTab] = useState('page');
  
  // Data States
  const [linkData, setLinkData] = useState('');
  const [textData, setTextData] = useState('');
  const [emailData, setEmailData] = useState({ to: '', subject: '', body: '' });
  const [phoneData, setPhoneData] = useState('');
  const [wifiData, setWifiData] = useState({ ssid: '', password: '', encryption: 'WPA' });
  
  // Custom Page State
  const [pageData, setPageData] = useState({ emoji: '😌', text: 'better luck next time', imageUrl: '' });
  
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
      case 'page':
        if (pageData.emoji || pageData.text || pageData.imageUrl) {
          // Dynamically use the current domain (e.g., Vercel URL or localhost)
          let customUrl = new URL(window.location.origin);
          if (pageData.emoji) customUrl.searchParams.set('emoji', pageData.emoji);
          if (pageData.text) customUrl.searchParams.set('text', pageData.text);
          if (pageData.imageUrl) customUrl.searchParams.set('img', pageData.imageUrl);
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
  }, [activeTab, linkData, textData, emailData, phoneData, wifiData, pageData]);


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
    { id: 'page', icon: Smile, label: 'Custom Page' },
    { id: 'link', icon: LinkIcon, label: 'Link' },
    { id: 'text', icon: Type, label: 'Text' },
    { id: 'email', icon: Mail, label: 'Email' },
    { id: 'phone', icon: Phone, label: 'Phone' },
    { id: 'wifi', icon: Wifi, label: 'WiFi' },
  ];

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-indigo-100 via-white to-purple-100 font-sans">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8 items-start">
        
        {/* Left Column - Controls */}
        <div className="w-full lg:w-2/3 bg-white/70 backdrop-blur-xl border border-white/40 shadow-2xl rounded-3xl p-6 md:p-8 transition-all">
          
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 mb-2">
              Advanced QR Generator
            </h1>
            <p className="text-gray-500 font-medium">Select a type, enter your data, and style your QR code.</p>
          </div>

          {/* Type Selector Tabs */}
          <div className="flex flex-wrap gap-2 mb-8 p-1 bg-gray-100/50 rounded-2xl border border-gray-100">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 min-w-[80px] flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl transition-all duration-300 ${
                  activeTab === tab.id 
                    ? 'bg-white text-indigo-600 shadow-md scale-100' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50 scale-95 hover:scale-100'
                }`}
              >
                <tab.icon size={20} />
                <span className="text-xs font-semibold">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Input Fields based on active tab */}
          <div className="space-y-5 mb-10 min-h-[160px]">
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

            {activeTab === 'phone' && (
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 ml-1">Phone Number</label>
                <input 
                  type="tel" placeholder="+1 234 567 8900" value={phoneData} onChange={e => setPhoneData(e.target.value)}
                  className="w-full px-4 py-3.5 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                />
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
                className="w-full flex items-center justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg shadow-indigo-500/30 text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-indigo-600 disabled:hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 font-semibold text-lg transition-all duration-300"
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
