'use client';

import { Copy, Share2, BarChart3 } from 'lucide-react';

interface EmptyInsightsStateProps {
  username?: string | null;
}

export default function EmptyInsightsState({ username }: EmptyInsightsStateProps) {
  const profileUrl = username ? `/${username}` : '';

  const copyToClipboard = async () => {
    if (profileUrl) {
      const fullUrl = `${window.location.origin}${profileUrl}`;
      try {
        await navigator.clipboard.writeText(fullUrl);
        // You could add a toast notification here
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-16 px-8">
      {/* Icon */}
      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 border border-violet-500/30 flex items-center justify-center mb-6">
        <BarChart3 className="w-10 h-10 text-violet-400" />
      </div>

      {/* Content */}
      <div className="text-center max-w-md">
        <h2 className="text-2xl font-semibold text-white mb-3">No LinkDeck activity yet</h2>
        <p className="text-white/60 text-sm mb-8 leading-relaxed">
          Share your LinkDeck to start tracking visitors and clicks. Once people start visiting your profile and clicking your links, you'll see detailed analytics here.
        </p>

        {/* Copy Link Button */}
        {profileUrl && (
          <button
            onClick={copyToClipboard}
            className="inline-flex items-center gap-3 px-6 py-3 bg-white text-black rounded-full font-medium text-sm hover:bg-gray-200 transition-colors duration-200 group"
          >
            <Share2 className="w-4 h-4" />
            <span>Copy LinkDeck</span>
            <Copy className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          </button>
        )}

        {/* URL Display */}
        {profileUrl && (
          <div className="mt-6 p-3 bg-white/5 rounded-lg border border-white/10 backdrop-blur-sm">
            <p className="text-white/60 text-xs font-mono break-all">
              {window.location.origin}{profileUrl}
            </p>
          </div>
        )}
      </div>

      {/* Features Preview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 w-full max-w-4xl">
        <div className="text-center">
          <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center mx-auto mb-3">
            <div className="w-6 h-6 bg-blue-500 rounded-sm"></div>
          </div>
          <h3 className="text-white font-medium text-sm mb-1">Profile Views</h3>
          <p className="text-white/40 text-xs">Track how many people visit your LinkDeck</p>
        </div>

        <div className="text-center">
          <div className="w-12 h-12 rounded-xl bg-violet-500/20 flex items-center justify-center mx-auto mb-3">
            <div className="w-6 h-6 bg-violet-500 rounded-full"></div>
          </div>
          <h3 className="text-white font-medium text-sm mb-1">Link Clicks</h3>
          <p className="text-white/40 text-xs">Monitor which links get the most engagement</p>
        </div>

        <div className="text-center">
          <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center mx-auto mb-3">
            <div className="w-6 h-1 bg-green-500 rounded-full"></div>
          </div>
          <h3 className="text-white font-medium text-sm mb-1">Performance Insights</h3>
          <p className="text-white/40 text-xs">Analyze trends and optimize your content</p>
        </div>
      </div>
    </div>
  );
}
