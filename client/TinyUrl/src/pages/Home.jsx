import { useEffect, useState } from 'react';
import Button from "../components/Button";
import UrlTable from '../components/UrlTable';
import { deleteUrl, fetchUrls, shortenUrl } from '../utils/services';
import { urlLimit, urlSkip } from '../constants';

const Home = () => {
  const [url, setUrl] = useState('');
  const [urlToShow, setUrlToShow] = useState(null);
  const [urlList, setUrlList] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [pages, setPages] = useState(1);
  const [limit, setLimit] = useState(urlLimit);
  const [skip, setSkip] = useState(urlSkip);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!url?.trim()?.length) {
      setError("Please enter a valid URL");
      setTimeout(() => setError(false), 1000);
      return;
    }

    setError(false);
    setLoading(true);

    try {
      const res = await shortenUrl({ originalUrl: url });

      if (!res?.data?.shortUrl) {
        setError("Failed to shorten URL");
        setTimeout(() => setError(false), 1000);
        return;
      }

      setUrl('');
      setUrlToShow(res.data.shortUrl);
      setSkip(0);
      await getUrls('');
    } catch (error) {
      console.error(error);
      setError("Something went wrong");
    } finally {
      setLoading(false);
      setTimeout(() => setError(false), 1000);
    }
  };

  const getUrls = async (search) => {
    try {
      const res = await fetchUrls({ limit, skip, search });
      if (!res.success) {
        setError("Something went wrong");
        return;
      }

      setUrlList(res?.data?.urls || []);
      const totalCount = res?.data?.totalCount || 0;
      setPages(Math.ceil(totalCount / limit));
    } catch (error) {
      setError(error.message);
    } finally {
      setTimeout(() => setError(false), 1000);
    }
  };

  const handlePrev = () => {
    if (skip === 0) return;
    setSkip((prev) => prev - limit);
  };

  const handleNext = () => {
    const maxSkip = (pages - 1) * limit;
    if (skip >= maxSkip) return;
    setSkip((prev) => prev + limit);
  };

  const handleDelete = async (urlId) => {
    const res = await deleteUrl(urlId);
    if (res.success) {
      getUrls('');
    } else {
      alert("Failed to delete URL. Please try again later");
    }
  };

  useEffect(() => {
    getUrls('');
  }, [skip]);

  return (
    <div className="min-h-screen bg-gray-900 text-white px-4 sm:px-6 lg:px-10 py-8">
      <p className="text-2xl sm:text-3xl font-semibold text-center mb-6">
        Shorten your URL here
      </p>

      <div className="bg-gray-800 p-6 sm:p-8 w-full max-w-lg mx-auto rounded-2xl shadow-md">
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            className="p-3 text-white w-full border-2 border-gray-600 focus:border-purple-600 outline-none rounded-lg bg-gray-900 placeholder-gray-400"
            placeholder="Enter your URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <Button
            btnText={loading ? "Processing..." : "Shorten URL"}
            className={`w-full sm:w-full  my-2 font-normal ${
              !url?.trim()?.length || loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={!url?.trim()?.length || loading}
          />
        </form>
      </div>

      {error && (
        <p className="text-red-500 text-sm text-center mt-3">{error}</p>
      )}

      {urlToShow && (
        <div className="text-center mt-4">
          <a
            href={urlToShow}
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber-400 text-lg sm:text-xl break-all hover:underline"
          >
            {urlToShow}
          </a>
        </div>
      )}
      <div className="mt-10">
        <div className="flex flex-col sm:flex-row justify-center sm:justify-between items-center gap-4 sm:gap-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <input
              className="bg-gray-800 w-full sm:w-64 px-3 py-2 rounded-lg border-2 border-gray-600 focus:border-purple-600 placeholder-gray-400"
              placeholder="Search"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="flex gap-2">
              <button
                className="px-4 py-2 bg-purple-600 rounded-xl hover:bg-purple-700 transition"
                onClick={() => getUrls(search)}
              >
                Search
              </button>
              <button
                className="px-4 py-2 bg-gray-700 rounded-xl hover:bg-gray-600 transition"
                onClick={() => {
                  setSearch("");
                  getUrls("");
                }}
              >
                Reset
              </button>
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <img
              src="/assets/prev.svg"
              className="w-8 sm:w-10 cursor-pointer hover:opacity-80"
              alt="prev"
              onClick={handlePrev}
            />
            <p className="text-sm sm:text-base">
              {pages === 0 ? 0 : Math.floor(skip / limit) + 1} / {pages}
            </p>
            <img
              src="/assets/next.svg"
              className="w-8 sm:w-10 cursor-pointer hover:opacity-80"
              alt="next"
              onClick={handleNext}
            />
          </div>
        </div>
        {!urlList.length ? (
          <p className="text-xl sm:text-2xl font-semibold text-center mt-10">
            No URLs found
          </p>
        ) : (
          <div className="overflow-x-auto">
            <UrlTable urlList={urlList} handleDelete={handleDelete} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
