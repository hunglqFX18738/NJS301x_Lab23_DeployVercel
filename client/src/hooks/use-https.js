import { useCallback, useState } from 'react';
import axios from 'axios';

const useHttp = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const sendRequest = useCallback(async (requestConfig, applyData) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios(requestConfig.url, {
        method: requestConfig.method ? requestConfig.method : 'GET',
        headers: requestConfig.headers ? requestConfig.headers : {},
        withCredentials: true,
        data: requestConfig.data
          ? !requestConfig.formData
            ? JSON.stringify(requestConfig.data)
            : requestConfig.data
          : null,
      });
      const data = await res.data;
      applyData(data);
      setLoading(false);
    } catch (err) {
      setError(err.message || 'Something went wrong!');
    }
  }, []);
  return {
    sendRequest,
    error,
    loading,
  };
};

export default useHttp;
