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
      setTimeout(() => {
        setError(false);
      }, 1000);
      return;
    }

    setError(false);
    setLoading(true);

    try {
      const res = await shortenUrl({ originalUrl: url });

      if (!res?.data?.shortUrl) {
        setError("Failed to shorten URL");
        setTimeout(() => {
          setError(false);
        }, 1000);
        return;
      }
      setUrl('');
      console.log(res.data.shortUrl);

      setUrlToShow(res?.data?.shortUrl);
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

      if (res.success) {
        setUrlList(res?.data?.urls);
        const totalCount = res?.data?.totalCount;
        setPages(Math.ceil(totalCount / limit));
      }
    } catch (error) {
      setError(error);
    } finally {
      setTimeout(() => {
        setError(false);
      }, 1000);
    }
  }

  const handlePrev = () => {
    if (skip === 0) return;
    setSkip((prev) => prev - limit);
  }

  const handleNext = () => {
    const maxSkip = (pages - 1) * limit;
    if (skip >= maxSkip) return;

    setSkip((prev) => prev + 10);
  }

  const handleDelete = async (urlId) => {
    const res = await deleteUrl(urlId);
    if (res.success) {
      getUrls('');
    }
    else {
      alert("Failed to delete URL..please try again later");
    }
  }

  useEffect(() => {
    getUrls('');
  }, [skip]);

  return (
    <div>
      <p className='text-2xl mt-7 text-center'>Shorten your url here</p>
      <div className='bg-gray-800 p-8 w-5/12 mx-auto my-4 rounded-2xl justify-start'>
        <form className='' onSubmit={handleSubmit}>
          <input type="text" className='p-3 text-white w-full border-2 border-gray-600 transition-colors duration-200 focus:border-purple-600 outline-none rounded-lg ' placeholder='Enter your URL' value={url} onChange={(e) => setUrl(e.target.value)} />
          <Button btnText="Shorten Url" className={`w-full my-3 font-normal ${!url?.trim()?.length || loading} ? 'opacity-50 cursor-not-allowed'`} />
        </form>
      </div>
      {error && <p className='text-red-500 text-sm text-center -mt-3'>{error}</p>}
      <div className='text-center'>
        {urlToShow && <a href={urlToShow} target='_blank' className='text-amber-400 text-lg text-center mt-3'>{urlToShow}</a>}
      </div>
      <div className='p-16'>
        <div className='flex justify-between'>
          <div className='my-3 flex gap-3 grow'>
            <input className='bg-gray-800 w-3/12 px-3 py-2 rounded-lg border-2 border-gray-600 focus:border-purple-600' placeholder='Search' type="text" value={search} onChange={(e) => setSearch(e.target.value)} />
            <button className="p-3 bg-purple-600 rounded-xl cursor-pointer" onClick={() => getUrls(search)}>Search</button>
            <button className="p-3 bg-purple-600 rounded-xl cursor-pointer"
              onClick={() => { setSearch(""); getUrls(""); }}>Reset</button>
          </div>
          <div className='flex gap-2 items-center mx-4'>
            <img src="/assets/prev.svg" className='w-10' alt="prev" onClick={handlePrev} />
            <p>{pages === 0 ? 0 : Math.floor(skip / limit) + 1} / {pages}</p>
            <img src="/assets/next.svg" className='w-10' alt="next" onClick={handleNext} />
          </div>
        </div>
        {
          !urlList.length
            ? <p className='text-2xl font-semibold text-center mt-6'>No urls found</p>
            : <UrlTable urlList={urlList} handleDelete={handleDelete} />
        }
      </div>

    </div>
  )
}

export default Home;