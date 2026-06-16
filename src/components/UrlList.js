import React, { useEffect, useState, useCallback, forwardRef, useImperativeHandle } from 'react';
import { Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { fetchUrls } from '../services/urlService';

const UrlList = forwardRef((props, ref) => {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { getAccessTokenSilently } = useAuth0();

  const fetchUrlsData = useCallback(async () => {
    setLoading(true);
    try {
      const token = await getAccessTokenSilently();
      const data = await fetchUrls(token);
      setUrls(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [getAccessTokenSilently]);

  useImperativeHandle(ref, () => ({
    fetchUrls: fetchUrlsData
  }));

  useEffect(() => {
    fetchUrlsData();
  }, [fetchUrlsData]);

  const [copiedSlug, setCopiedSlug] = useState(null);

  const handleCopy = (text, slug) => {
    navigator.clipboard.writeText(text);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 3000);
  };

  if (loading) return <div>Loading URLs...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="max-w-2xl mx-auto mt-0 p-0">
      {urls.length === 0 ? (
        <p className="text-gray-600">No URLs found</p>
      ) : (
        <ul className="list-none p-0 m-0">
          {urls.map((url) => (
            <li key={url.slug} className="bg-white my-4 p-8 pt-6 rounded-xl shadow border border-gray-200 flex flex-col gap-2">
              <div className="flex items-center justify-between mb-1">
                <Link
                  to={`/links/${url.slug}/details`}
                  className="font-semibold text-base text-gray-900 hover:underline"
                >
                  {url.slug}
                </Link>
                <div className="flex items-center gap-2 ml-2 shrink-0">
                  <Link
                    to={`/links/${url.slug}/details`}
                    title="Details"
                    className="text-gray-400 hover:text-blue-600 transition"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                      <line x1="18" y1="20" x2="18" y2="10"/>
                      <line x1="12" y1="20" x2="12" y2="4"/>
                      <line x1="6" y1="20" x2="6" y2="14"/>
                    </svg>
                  </Link>
                  <Link
                    to={`/links/${url.slug}/edit`}
                    title="Edit"
                    className="text-gray-400 hover:text-blue-600 transition"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                  </Link>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <a
                  className="text-blue-600 text-base break-all hover:underline"
                  href={url.fullUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {url.fullUrl}
                </a>
                <button
                  title="Copy short URL"
                  onClick={() => handleCopy(url.fullUrl, url.slug)}
                  className={`shrink-0 transition ${copiedSlug === url.slug ? 'text-green-500' : 'text-gray-400 hover:text-blue-600'}`}
                >
                  {copiedSlug === url.slug ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1z"/>
                    </svg>
                  )}
                </button>
              </div>
              <div className="flex items-center gap-1.5 text-gray-500 text-sm mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" className="shrink-0">
                  <polyline points="15 9 20 14 15 19"/>
                  <path d="M4 4v7a4 4 0 0 0 4 4h12"/>
                </svg>
                <span className="text-gray-800 break-all">{url.destinationUrl}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
});

export default UrlList;
