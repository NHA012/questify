import axios from 'axios';
import { useState } from 'react';

const useRequest = ({
  url: initialUrl,
  method: initialMethod,
  body: initialBody = null,
  onSuccess,
  onError,
}) => {
  const [errors, setErrors] = useState(null);

  const doRequest = async (config = {}) => {
    const { url = initialUrl, method = initialMethod, body = initialBody } = config;

    try {
      setErrors(null);
      const response = await axios({
        method,
        url,
        data: body,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (onSuccess) {
        onSuccess(response.data);
      }

      return response.data;
    } catch (err) {
      console.log('err', err);

      setErrors(
        <div className="alert alert-danger">
          <ul className="my-0">
            {err.response && err.response.data && err.response.data.errors ? (
              err.response.data.errors.map((err) => <li key={err.message}>{err.message}</li>)
            ) : (
              <li>Something went wrong</li>
            )}
          </ul>
        </div>,
      );

      if (onError) {
        onError(err);
      }
    }
  };

  return { doRequest, errors };
};

export default useRequest;
