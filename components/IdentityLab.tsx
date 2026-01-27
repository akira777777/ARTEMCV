
import React, { useState } from 'react';
import { GeminiService } from '../services/geminiService';

interface Identity {
  name: string;
  tagline: string;
  values: string[];
  uniqueValue: string;
  targetAudience: string;
}

const IdentityLab: React.FC = () => {
  const [businessName, setBusinessName] = useState('');
  const [businessDescription, setBusinessDescription] = useState('');
  const [identity, setIdentity] = useState<Identity | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName.trim() || !businessDescription.trim()) return;

    setLoading(true);
    setIdentity(null);

    try {
      const ai = GeminiService as any;
      const response = await ai.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Analyze this business and create a comprehensive brand identity profile:
        
Business Name: ${businessName}
Description: ${businessDescription}

Generate a JSON response with:
- name: The business name
- tagline: A compelling 1-line brand tagline
- values: Array of 3-4 core brand values
- uniqueValue: What makes this business unique (1-2 sentences)
- targetAudience: Who is the primary audience (1-2 sentences)`,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              tagline: { type: 'string' },
              values: { type: 'array', items: { type: 'string' } },
              uniqueValue: { type: 'string' },
              targetAudience: { type: 'string' }
            },
            required: ['name', 'tagline', 'values', 'uniqueValue', 'targetAudience']
          }
        }
      });

      const result = JSON.parse(response.text || '{}') as Identity;
      setIdentity(result);
    } catch (err) {
      console.error('Identity Lab error:', err);
      alert('Failed to generate identity. Please check your API key and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-32 px-6 lg:px-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-16 text-center">
          <h2 className="text-5xl md:text-6xl font-black text-white mb-6 tracking-tighter">
            Identity Lab
          </h2>
          <p className="text-lg text-zinc-400">
            Discover your brand's core identity with AI-powered analysis
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleGenerate} className="mb-16 space-y-6">
          <div>
            <label htmlFor="business-name" className="block text-sm font-bold text-white mb-3">
              Business Name
            </label>
            <input
              id="business-name"
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="Enter your business name..."
              className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-zinc-600 focus:border-white/30 focus:outline-none transition-all"
            />
          </div>

          <div>
            <label htmlFor="business-desc" className="block text-sm font-bold text-white mb-3">
              Business Description
            </label>
            <textarea
              id="business-desc"
              value={businessDescription}
              onChange={(e) => setBusinessDescription(e.target.value)}
              placeholder="Describe your business, products, and vision..."
              rows={4}
              className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-zinc-600 focus:border-white/30 focus:outline-none transition-all resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !businessName.trim() || !businessDescription.trim()}
            className="w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-zinc-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-3">
                <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                Analyzing Brand...
              </span>
            ) : (
              'Generate Identity'
            )}
          </button>
        </form>

        {/* Results */}
        {identity && (
          <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-2xl p-12 space-y-8 animate-in fade-in duration-500">
            <div>
              <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-2">
                Brand Name
              </h3>
              <p className="text-4xl font-black text-white">{identity.name}</p>
            </div>

            <div>
              <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-2">
                Tagline
              </h3>
              <p className="text-xl text-zinc-200 italic">"{identity.tagline}"</p>
            </div>

            <div>
              <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-3">
                Core Values
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {identity.values.map((value, idx) => (
                  <div key={`${value}-${idx}`} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0" />
                    <span className="text-zinc-300">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-2">
                Unique Value Proposition
              </h3>
              <p className="text-zinc-300 leading-relaxed">{identity.uniqueValue}</p>
            </div>

            <div>
              <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-2">
                Target Audience
              </h3>
              <p className="text-zinc-300 leading-relaxed">{identity.targetAudience}</p>
            </div>

            <button
              onClick={() => {
                setIdentity(null);
                setBusinessName('');
                setBusinessDescription('');
              }}
              className="w-full py-3 border border-white/20 text-white font-bold rounded-xl hover:bg-white/5 transition-all"
            >
              Analyze Another Brand
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default IdentityLab;
