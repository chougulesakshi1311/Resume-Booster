import React, { useState } from 'react';
import axios from 'axios';
import { Rocket, Copy, Check, RefreshCcw, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const App = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const handleBoost = async () => {
    if (!input.trim()) return;
    
    setLoading(true);
    setError('');
    setOutput('');
    
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await axios.post(`${apiUrl}/api/boost`, {
        sentence: input
      });
      setOutput(response.data.boosted);
    } catch (err) {
      console.error(err);
      setError('Something went wrong. Make sure the backend is running and the API key is set.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-premium-bg flex flex-col items-center justify-center p-6 sm:p-12 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 -left-1/4 w-1/2 h-1/2 bg-indigo-500/10 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-0 -right-1/4 w-1/2 h-1/2 bg-purple-500/10 blur-[120px] rounded-full"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-3xl z-10"
      >
        {/* Header */}
        <div className="flex flex-col items-center mb-12 text-center">
          <motion.div 
             whileHover={{ scale: 1.05 }}
             className="w-16 h-16 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20 mb-6"
          >
            <Rocket className="text-white w-8 h-8" />
          </motion.div>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-white mb-4">
            Resume <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">Booster</span>
          </h1>
          <p className="text-premium-muted text-lg max-w-lg">
            Transform ordinary work descriptions into high-impact, professional resume bullet points.
          </p>
        </div>

        {/* Action Area */}
        <div className="glass rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col gap-6">
            <div className="space-y-3">
              <label htmlFor="sentence" className="block text-sm font-medium text-premium-muted px-1">
                Enter your work description
              </label>
              <textarea
                id="sentence"
                rows="4"
                className="w-full bg-premium-bg/50 border border-white/10 rounded-2xl p-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all resize-none"
                placeholder="e.g., I helped customers and solved their issues."
                value={input}
                onChange={(e) => setInput(e.target.value)}
              ></textarea>
            </div>

            <button
              onClick={handleBoost}
              disabled={loading || !input.trim()}
              className={`glow-btn w-full h-14 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-2xl flex items-center justify-center gap-2 font-semibold text-white transition-all transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {loading ? (
                <RefreshCcw className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>Boost My Bullet Point</span>
                </>
              )}
            </button>

            {error && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-start gap-2"
              >
                <span className="mt-0.5">•</span>
                <span>{error}</span>
              </motion.div>
            )}

            {/* Result Section */}
            <AnimatePresence>
              {output && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4 pt-6 border-t border-white/5"
                >
                  <div className="flex items-center justify-between px-1">
                    <span className="text-sm font-medium text-premium-muted">Improved Result</span>
                    <button 
                      onClick={handleCopy}
                      className="text-indigo-400 hover:text-indigo-300 text-sm flex items-center gap-1.5 transition-colors font-medium"
                    >
                      {copied ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>Copy Result</span>
                        </>
                      )}
                    </button>
                  </div>
                  <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-2xl p-6 relative group">
                    <p className="text-white text-lg leading-relaxed italic pr-8">
                      {output}
                    </p>
                    <Rocket className="absolute top-4 right-4 w-5 h-5 text-indigo-500/30 group-hover:text-indigo-500/50 transition-colors" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
            <p className="text-premium-muted text-sm px-4 py-2 bg-white/5 inline-block rounded-full border border-white/5">
                Powered by <span className="text-indigo-400 font-semibold">Gemini AI</span>
            </p>
        </div>
      </motion.div>
    </div>
  );
};

export default App;
