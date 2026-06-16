import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { fetchUrls } from '../services/urlService';

function LinkDetails() {
  const { slug } = useParams();
  const { getAccessTokenSilently } = useAuth0();
  const [url, setUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadUrl = useCallback(async () => {
    try {
      const token = await getAccessTokenSilently();
      const data = await fetchUrls(token);
      const match = data.find((u) => u.slug === slug);
      setUrl(match || null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [getAccessTokenSilently, slug]);

  useEffect(() => {
    loadUrl();
  }, [loadUrl]);

  if (loading) return <div className="mt-8 p-4 text-gray-600">Loading...</div>;
  if (error) return <div className="mt-8 p-4 text-red-600">Error: {error}</div>;
  if (!url) return <div className="mt-8 p-4 text-gray-600">Not found.</div>;

  return (
    <div className="mt-8 p-4">
      <div className="max-w-2xl mx-auto mb-6">
        <Link to="/" className="text-sm text-gray-500 hover:text-gray-700 hover:underline">
          ← Back
        </Link>
      </div>
      <div className="max-w-2xl mx-auto">
        <ul className="list-none p-0 m-0">
          <li className="bg-white my-4 p-8 pt-6 rounded-xl shadow border border-gray-200 flex flex-col gap-2">
            <div className="font-semibold text-base text-gray-900 mb-1">{url.slug}</div>
            <div className="flex items-center gap-2">
              <a
                className="text-blue-600 text-base break-all hover:underline"
                href={url.fullUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {url.fullUrl}
              </a>
            </div>
            <div className="flex items-center gap-1.5 text-gray-500 text-sm mt-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" className="shrink-0">
                <polyline points="15 9 20 14 15 19"/>
                <path d="M4 4v7a4 4 0 0 0 4 4h12"/>
              </svg>
              <span className="text-gray-800 break-all">{url.destinationUrl}</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default LinkDetails;
