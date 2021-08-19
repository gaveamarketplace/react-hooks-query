import axios from 'axios';


export async function getToken() {
  try {
    const token = await localStorage.getItem('token');
    return token;
  } catch (error) {
    return null;
  }
}


//Todo verificar solução de variáveis de ambiente
const USERS_ENDPOINT = 'https://users.api-dev-aws.marketplace.gavea.com';
const ORDERS_ENDPOINT = 'https://orders.api-dev-aws.marketplace.gavea.com';
const CHATS_ENDPOINT = 'https://chat.api-dev-aws.marketplace.gavea.com';

export const http = axios.create({
  headers: { 'Content-Type': 'application/json' },
});
export const apiUser = axios.create({
  baseURL: USERS_ENDPOINT,
});
export const apiOrder = axios.create({
  baseURL: ORDERS_ENDPOINT,
});
export const apiChat = axios.create({
  baseURL: CHATS_ENDPOINT,
});

http.interceptors.request.use(
  async function (config) {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    config.headers['Content-Type'] = 'application/json';
    return config;
  },
  function (error) {
    return Promise.reject(error);
  },
);

apiUser.interceptors.request.use(
  async function (config) {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    config.headers['Content-Type'] = 'application/json';
    return config;
  },
  function (error) {
    return Promise.reject(error);
  },
);

apiOrder.interceptors.request.use(
  async function (config) {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    config.headers['Content-Type'] = 'application/json';
    return config;
  },
  function (error) {
    return Promise.reject(error);
  },
);

apiChat.interceptors.request.use(
  async function (config) {
    const token = await getToken();
    config.headers['Content-Type'] = 'application/json';
    if (token) {
      config.headers.Authorization = `${token}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  },
);


export const FETCH_CORN_POSITIONS = 'fetch-corn-positions';
export const FETCH_SOY_POSITIONS = 'fetch-soy-positions';

export const positionCornQuery = async (queryParams: any) => {
  const emptyResult = {
    data: {
      1: {}
    }
  }

  const cornReal = apiOrder
    .get('/api/v1/PositionReports/Consolidated', {
      headers: { currencyType: 1, productId: 2, ...queryParams }
    })
    .catch((reason: any) => {
      if (reason && reason.response && reason.response.status == 404)
        return Promise.resolve(emptyResult)

      return Promise.reject(reason)
    })
  const cornDolar = apiOrder
    .get('/api/v1/PositionReports/Consolidated', {
      headers: { currencyType: 2, productId: 2, ...queryParams }
    })
    .catch((reason: any) => {
      if (reason && reason.response && reason.response.status == 404)
        return Promise.resolve(emptyResult)

      return Promise.reject(reason)
    })

  const query = await Promise.all([cornReal, cornDolar])
  return {
    cornReal: query[0],
    cornDolar: query[1]
  }
}

export const positionSoyQuery = async (queryParams:any) => {
  const emptyResult = {
    data: {
      1: {},
    },
  };

  const soyReal = apiOrder
    .get('/api/v1/PositionReports/Consolidated', {
      headers: { currencyType: 1, productId: 1, ...queryParams },
    })
    .catch((reason:any) => {
      if (reason && reason.response && reason.response.status == 404)
        return Promise.resolve(emptyResult);

      return Promise.reject(reason);
    });
  const soyDolar = apiOrder
    .get('/api/v1/PositionReports/Consolidated', {
      headers: { currencyType: 2, productId: 1, ...queryParams },
    })
    .catch((reason:any) => {
      if (reason && reason.response && reason.response.status == 404)
        return Promise.resolve(emptyResult);

      return Promise.reject(reason);
    });

  const query = await Promise.all([soyReal, soyDolar]);
  return {
    soyReal: query[0],
    soyDolar: query[1],
  };
};

// export const useCornPositions = (queryParams) => {
//   return useQuery(
//     [FETCH_CORN_POSITIONS, queryParams],
//     () => positionCornQuery(queryParams),
//   );
// }

// export function useSoyPositions(queryParams) {
//   return useQuery(
//     [FETCH_SOY_POSITIONS, queryParams],
//     () => positionSoyQuery(queryParams),
//   );
// }
