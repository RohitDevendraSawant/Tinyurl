const api_base_url = import.meta.env.VITE_SERVER_BASE_URL;

export const register = async ({ email, password, confirmPassword }) => {
  try {
    const res = await fetch(`${api_base_url}/api/user/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, confirmPassword }),
    });

    const data = await res.json();
    return data;
  } catch (err) {
    throw err;
  }
};


export const shortenUrl = async (originalUrl) => {
  try {
    const res = await fetch(`${api_base_url}/api/url/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify( originalUrl ),
      credentials: "include",
    });
  
    const data = await res.json();
    return data;
  } catch (error) {
    throw error;
  }
};

export const fetchUrls = async ({ limit = 10, skip = 0, search = '' }) => {
  try {
    const res = await fetch(`${api_base_url}/api/url/userUrls`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ limit, skip, search }),
      credentials: "include",
    });
  
    const data = await res.json();
  
    return data;
  } catch (error) {
    throw error;
  }
};

export const deleteUrl = async (urlId) => {
  try {
    const response = await fetch(`${api_base_url}/api/url/delete/${urlId}`, {
      method: "GET",
      credentials: "include",
    });

    const data = await response.json();
    return data;
  } catch (error) {
    throw error
  }
}
