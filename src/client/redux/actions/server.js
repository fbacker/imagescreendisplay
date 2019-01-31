import fetchApi from "../../utils/fetch";
import {
  ASSETS_PREVIEW_LOAD,
  ASSETS_LOAD,
  ASSETS_CONNECTIONS_LOAD,
  ASSET_CONNECTION_ADD,
  ASSET_CONNECTION_DELETE,
  ASSET_SENT,
  USERS_LOAD,
  USER_DELETE,
  USERS_CONNECTION_LOAD,
  USER_CONNECTION_ADD,
  USER_CONNECTION_DELETE,
  ASSET_DISPLAY,
  ASSETS_HISTORY_LOAD
} from "../types";
import { requestBegin, requestResponse } from "./requests";

export const assetsLoad = () => (dispatch, getState) => {
  const { settings } = getState();
  const reqId = "assets";
  dispatch(requestBegin(reqId));
  return fetchApi({
    url: `/api/assets?from=${settings.assetsFilterDateFrom}&to=${
      settings.assetsFilterDateTo
    }&users=${settings.assetsFilterUsers.join(",")}`,
    reqId
  }).then(json => {
    if (!json) return;
    dispatch({
      type: ASSETS_LOAD,
      payload: json
    });
    dispatch(requestResponse(reqId, true));
  });
};

export const assetDelete = id => dispatch => {
  const reqId = "assetsDelete";
  dispatch(requestBegin(reqId));
  return fetchApi({
    url: `/api/assets/${id}`,
    reqId,
    method: "DELETE"
  }).then(json => {
    if (!json) return;

    dispatch(requestResponse(reqId, true));
  });
};

export const assetsConnectionsLoad = () => dispatch => {
  const reqId = "assetsConnections";
  dispatch(requestBegin(reqId));
  return fetchApi({ url: "/api/assets/connections", reqId }).then(json => {
    if (!json) return;
    dispatch({
      type: ASSETS_CONNECTIONS_LOAD,
      payload: json
    });
    dispatch(requestResponse(reqId, true));
  });
};

export const assetsHistory = numOfDays => dispatch => {
  const reqId = "assetsHistory";
  dispatch(requestBegin(reqId));
  return fetchApi({ url: `/api/assets/history?days=${numOfDays}`, reqId }).then(
    json => {
      if (!json) return;
      dispatch({
        type: ASSETS_HISTORY_LOAD,
        payload: json
      });
      dispatch(requestResponse(reqId, true));
    }
  );
};

export const assetDisplay = (id, displayIndex) => dispatch => {
  const reqId = "assetDisplay";
  dispatch(requestBegin(reqId));
  const payload = { display: displayIndex };
  return fetchApi({
    url: `/api/assets/${id}/display`,
    reqId,
    method: "POST",
    body: payload
  }).then(json => {
    if (!json) return;
    dispatch({
      type: ASSET_DISPLAY,
      id,
      displayIndex
    });
    dispatch(requestResponse(reqId, true));
  });
};

export const assetSendToParents = id => dispatch => {
  const reqId = "assetSendToParents";
  dispatch(requestBegin(reqId));
  return fetchApi({
    url: `/api/assets/${id}/send`,
    reqId,
    method: "POST"
  }).then(json => {
    if (!json) return;
    dispatch({
      type: ASSET_SENT,
      id
    });
    dispatch(requestResponse(reqId, true));
  });
};

export const usersLoad = () => dispatch => {
  const reqId = "users";
  dispatch(requestBegin(reqId));
  return fetchApi({ url: "/api/users", reqId }).then(json => {
    if (!json) return;
    dispatch({
      type: USERS_LOAD,
      payload: json
    });
    dispatch(requestResponse(reqId, true));
  });
};

export const usersConnectionsLoad = () => dispatch => {
  const reqId = "usersConnections";
  dispatch(requestBegin(reqId));
  return fetchApi({ url: "/api/users/connections", reqId }).then(json => {
    if (!json) return;
    dispatch({
      type: USERS_CONNECTION_LOAD,
      payload: json
    });
    dispatch(requestResponse(reqId, true));
  });
};

export const userCreate = (name, isParent, email) => dispatch => {
  const reqId = "userCreate";
  let payload = {
    isParent,
    name,
    email
  };
  console.log("create new user", payload);
  dispatch(requestBegin(reqId));
  return fetchApi({
    url: `/api/users`,
    reqId,
    method: "POST",
    body: payload
  }).then(json => {
    if (!json) return;
    dispatch(requestResponse(reqId, true));
  });
};

export const userUpdate = (id, name, email) => dispatch => {
  const reqId = "userUpdate";
  let payload = {
    name,
    email
  };
  console.log("update user", payload);
  dispatch(requestBegin(reqId));
  return fetchApi({
    url: `/api/users/${id}`,
    reqId,
    method: "POST",
    body: payload
  }).then(json => {
    if (!json) return;
    dispatch(requestResponse(reqId, true));
  });
};

export const userDelete = userId => dispatch => {
  const reqId = "userDelete";
  dispatch(requestBegin(reqId));
  return fetchApi({
    url: `/api/users/${userId}`,
    reqId,
    method: "DELETE"
  }).then(json => {
    if (!json) return;
    dispatch({
      type: USER_DELETE,
      payload: userId
    });
    dispatch(requestResponse(reqId, true));
  });
};

export const userConnectionModify = (userId, userIdTo, add) => dispatch => {
  const reqId = "userConnectionModify";
  dispatch(requestBegin(reqId));
  const method = add ? "POST" : "DELETE";
  let payload = {
    id: userIdTo
  };
  console.log("create connection", payload);
  return fetchApi({
    url: `/api/users/${userId}/connection`,
    method,
    body: payload,
    reqId
  }).then(json => {
    if (!json) return;
    dispatch({
      type: add ? USER_CONNECTION_ADD : USER_CONNECTION_DELETE,
      userId,
      userIdTo
    });
    dispatch(requestResponse(reqId, true));
  });
};

export const assetConnectionModify = (assetId, userIdTo, add) => dispatch => {
  const reqId = "assetConnectionModify";
  dispatch(requestBegin(reqId));
  const method = add ? "POST" : "DELETE";
  let payload = {
    id: userIdTo
  };
  console.log("create connection", assetId, userIdTo, add);
  return fetchApi({
    url: `/api/assets/${assetId}/connection`,
    method,
    body: payload,
    reqId
  }).then(json => {
    if (!json) return;
    dispatch({
      type: add ? ASSET_CONNECTION_ADD : ASSET_CONNECTION_DELETE,
      assetId,
      userIdTo
    });
    dispatch(requestResponse(reqId, true));
  });
};

export const loadPreviewAssets = () => dispatch => {
  const reqId = "previewassets";
  dispatch(requestBegin(reqId));
  return fetchApi({
    url: `/api/assets/preview`,
    reqId
  }).then(json => {
    if (!json) return;
    dispatch({
      type: ASSETS_PREVIEW_LOAD,
      payload: json
    });
    dispatch(requestResponse(reqId, true));
  });
};
