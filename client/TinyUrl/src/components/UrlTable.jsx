const UrlTable = ({ urlList = [], handleDelete }) => {
  const copyUrl = (text) => {
    navigator.clipboard.writeText(text);
  }

  return (
    <div className="overflow-x-auto text-center">
      <table className="min-w-full border border-gray-700 rounded-lg overflow-hidden">
        <thead className="bg-gray-800 text-gray-200">
          <tr>
            <th className="px-6 py-3 text-center text-sm font-semibold uppercase tracking-wider border-b border-gray-700">
              Original URL
            </th>
            <th className="px-6 py-3 text-center text-sm font-semibold uppercase tracking-wider border-b border-gray-700">
              Short URL
            </th>
            <th className="px-6 py-3 text-center text-sm font-semibold uppercase tracking-wider border-b border-gray-700">
              Total Clicks
            </th>
            <th className="px-6 py-3 text-center text-sm font-semibold uppercase tracking-wider border-b border-gray-700">
              Unique Clicks
            </th>
          </tr>
        </thead>

        <tbody className="bg-gray-900 text-gray-100">
          {
            urlList.map((url) => (
              <tr
                key={url._id}
                className="hover:bg-gray-800 transition-colors duration-200"
              >
                <td className="px-6 py-3 border-t border-gray-700 truncate max-w-[250px]">
                  <a
                    href={url.originalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline"
                  >
                    {url.originalUrl}
                  </a>
                </td>

                <td className="px-6 py-3 border-t border-gray-700">
                  <div className="flex justify-between items-center">
                    <a
                      href={url.shortUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-400 hover:underline"
                    >
                      {url.shortUrl}
                    </a>
                    <div className="flex gap-4">
                      <img className="w-4 cursor-pointer" onClick={() => copyUrl(url.shortUrl)} src="/assets/copy.svg" alt="copy" />
                      <img className="w-4 cursor-pointer" onClick={() => handleDelete(url._id)} src="/assets/delete.svg" alt="delete" />
                    </div>
                  </div>
                </td>

                <td className="px-6 py-3 border-t border-gray-700 text-center">
                  {url.totalClicks ?? 0}
                </td>

                <td className="px-6 py-3 border-t border-gray-700 text-center">
                  {url.uniqueClicks ?? 0}
                </td>
              </tr>
            ))
          }
        </tbody>
      </table>
    </div>
  )
}

export default UrlTable
