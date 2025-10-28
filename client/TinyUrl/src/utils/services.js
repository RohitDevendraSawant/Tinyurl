const api_base_url = import.meta.env.VITE_SERVER_BASE_URL;

const getToken = () => localStorage.getItem('accessToken');

// ---------- REGISTER ----------
export const register = async ({ email, password, confirmPassword }) => {
  try {
    const res = await fetch(`${api_base_url}/api/user/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "authorization": `Bearer ${getToken()}`,
      },
      body: JSON.stringify({ email, password, confirmPassword }),
    });

    return await res.json();
  } catch (err) {
    throw err;
  }
};

// ---------- SHORTEN URL ----------
export const shortenUrl = async (originalUrl) => {
  try {
    const res = await fetch(`${api_base_url}/api/url/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "authorization": `Bearer ${getToken()}`,
      },
      body: JSON.stringify(originalUrl),
      credentials: "include",
    });

    return await res.json();
  } catch (error) {
    throw error;
  }
};

// ---------- FETCH URLS ----------
export const fetchUrls = async ({ limit = 10, skip = 0, search = '' }) => {
  try {
    const res = await fetch(`${api_base_url}/api/url/userUrls`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "authorization": `Bearer ${getToken()}`,
      },
      body: JSON.stringify({ limit, skip, search }),
      credentials: "include",
    });

    return await res.json();
  } catch (error) {
    throw error;
  }
};

// ---------- DELETE URL ----------
export const deleteUrl = async (urlId) => {
  try {
    const res = await fetch(`${api_base_url}/api/url/delete/${urlId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "authorization": `Bearer ${getToken()}`,
      },
      credentials: "include",
    });

    return await res.json();
  } catch (error) {
    throw error;
  }
};
