const getBrowserApi = async (requestConfig, feRequestConfig) => {
  return new Promise((resolve) => {
    let fetching = false;

    const intervalId = setInterval(() => {
      console.log({ fetching });

      if (fetching === false) {
        fetching = true;
        fetch(
          feRequestConfig.url,
          Object.assign(requestConfig, {
            headers: {
              ...requestConfig.headers,
              "content-type": feRequestConfig.headers["content-type"],
            },
            method: feRequestConfig.method,
            body: feRequestConfig.body,
          }),
        )
          .then((response) => response.json())
          .then((response) => {
            resolve(response);
            clearInterval(intervalId);
          });
      }
    }, 1000);
  });
};

module.exports = {
  getBrowserApi,
};
