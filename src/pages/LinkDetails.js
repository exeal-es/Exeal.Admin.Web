import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { QRCodeSVG } from 'qrcode.react';
import { fetchUrlStats } from '../services/urlService';
import { RedirectIcon, CopyIcon, CheckIcon } from '../components/icons';

function LinkDetails() {
  const { slug } = useParams();
  const { getAccessTokenSilently } = useAuth0();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const loadStats = useCallback(async () => {
    try {
      const token = await getAccessTokenSilently();
      const data = await fetchUrlStats(token, slug);
      setStats(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [getAccessTokenSilently, slug]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  if (loading) return <div className="mt-8 p-4 text-gray-600">Loading...</div>;
  if (error) return <div className="mt-8 p-4 text-red-600">Error: {error}</div>;
  if (!stats) return <div className="mt-8 p-4 text-gray-600">Not found.</div>;

  return (
    <div className="mt-8 p-4">
      <div className="max-w-2xl mx-auto mb-6">
        <Link to="/" className="text-sm text-gray-500 hover:text-gray-700 hover:underline">
          ← Back
        </Link>
      </div>
      <div className="max-w-2xl mx-auto flex flex-col gap-4">
        <div className="bg-white p-8 pt-6 rounded-xl shadow border border-gray-200 flex flex-col gap-2">
          <div className="flex items-center justify-between mb-1">
            <span className="font-semibold text-base text-gray-900">{stats.slug}</span>
          </div>
          <div className="flex items-center gap-2">
            <a
              className="text-blue-600 text-base break-all hover:underline"
              href={stats.fullUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {stats.fullUrl}
            </a>
            <button
              title="Copy short URL"
              onClick={() => handleCopy(stats.fullUrl)}
              className={`shrink-0 transition ${copied ? 'text-green-500' : 'text-gray-400 hover:text-blue-600'}`}
            >
              {copied ? <CheckIcon /> : <CopyIcon />}
            </button>
          </div>
          <div className="flex items-center gap-1.5 text-gray-500 text-sm mt-1">
            <RedirectIcon />
            <span className="text-gray-800 break-all">{stats.destinationUrl}</span>
          </div>
        </div>

        <div className="bg-white p-8 pt-6 rounded-xl shadow border border-gray-200">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Stats</h3>
          <div className="flex gap-8">
            <div className="flex flex-col gap-1">
              <span className="text-3xl font-bold text-gray-900">{stats.clickCount}</span>
              <span className="text-sm text-gray-500">Total clicks</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-3xl font-bold text-gray-900">{stats.uniqueVisitorCount}</span>
              <span className="text-sm text-gray-500">Unique visitors</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 pt-6 rounded-xl shadow border border-gray-200">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">QR Code</h3>
          <QRCodeSVG value={stats.fullUrl} size={160} />
        </div>
      </div>
    </div>
  );
}

export default LinkDetails;
