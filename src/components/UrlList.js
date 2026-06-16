import React, { useEffect, useState, useCallback, forwardRef, useImperativeHandle } from 'react';
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
              <div className="flex gap-5 items-center text-gray-500 text-sm mt-1">
                <span className="flex items-center gap-1">
                  <svg width="16" height="16" fill="#6b7280" className="mr-0.5" viewBox="0 0 16 16"><path d="M2 8a6 6 0 1112 0A6 6 0 012 8zm6-4.5a.75.75 0 01.75.75v2.25h1.5a.75.75 0 010 1.5h-2.25A.75.75 0 017 7.25V4.25A.75.75 0 018 3.5z"></path></svg>
                  {new Date(url.createdAt).toLocaleDateString()}
                </span>
                <span className="flex items-center gap-1 text-blue-600">
                  <svg width="16" height="16" fill="#2563eb" className="mr-0.5" viewBox="0 0 16 16"><path d="M7.5 1a.5.5 0 01.5.5V3a.5.5 0 01-1 0V1.5A.5.5 0 017.5 1zm4.95 2.05a.5.5 0 01.7.7l-1.06 1.06a.5.5 0 11-.7-.7l1.06-1.06zM15 7.5a.5.5 0 01-.5.5H13a.5.5 0 010-1h1.5a.5.5 0 01.5.5zm-2.05 4.95a.5.5 0 01-.7.7l-1.06-1.06a.5.5 0 11.7-.7l1.06 1.06zM8.5 15a.5.5 0 01-.5-.5V13a.5.5 0 011 0v1.5a.5.5 0 01-.5.5zm-4.95-2.05a.5.5 0 01-.7-.7l1.06-1.06a.5.5 0 11.7.7l-1.06 1.06zM1 8.5a.5.5 0 01.5-.5H3a.5.5 0 010 1H1.5a.5.5 0 01-.5-.5zm2.05-4.95a.5.5 0 01.7-.7l1.06 1.06a.5.5 0 11-.7.7L3.05 3.55z"></path></svg>
                  {url.destinationUrl}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
});

export default UrlList; 