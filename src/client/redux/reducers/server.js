import _ from "lodash";
import moment from "moment";
import {
  USERS_LOAD,
  ASSETS_LOAD,
  ASSETS_PREVIEW_LOAD,
  ASSET_DISPLAY,
  USERS_CONNECTION_LOAD,
  USER_DELETE,
  USER_CONNECTION_ADD,
  USER_CONNECTION_DELETE,
  ASSET_SENT,
  ASSETS_CONNECTIONS_LOAD,
  ASSET_CONNECTION_ADD,
  ASSET_CONNECTION_DELETE,
  ASSETS_HISTORY_LOAD
} from "../types";

const initialState = {
  users: [],
  usersConnections: [],
  assets: [],
  assetsConnections: [],
  previews: [],
  history: []
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ASSET_SENT:
      const assetsSent = [...state.assets];
      const indexSent = _.findIndex(assetsSent, item => item.id === action.id);
      assetsSent[indexSent].sent += 1;
      return {
        ...state,
        assets: assetsSent
      };

    case ASSET_DISPLAY:
      const assetsDisplay = [...state.assets];
      const indexDisplay = _.findIndex(
        assetsDisplay,
        item => item.id === action.id
      );
      assetsDisplay[indexDisplay].display = action.displayIndex;
      return {
        ...state,
        assets: assetsDisplay
      };

    case ASSETS_CONNECTIONS_LOAD:
      return {
        ...state,
        assetsConnections: action.payload
      };

    case ASSETS_LOAD:
      const assets = action.payload;
      _.map(assets, asset => {
        asset.created = moment.unix(asset.created);
        return asset;
      });
      return {
        ...state,
        assets: assets
      };

    case ASSETS_PREVIEW_LOAD:
      const previews = action.payload;
      _.map(previews, asset => {
        asset.created = moment.unix(asset.created);
        return asset;
      });
      return { ...state, previews };

    case ASSETS_HISTORY_LOAD:
      return { ...state, history: action.payload };

    case USERS_LOAD:
      return {
        ...state,
        users: _.sortBy(action.payload, ["name"])
      };

    case USERS_CONNECTION_LOAD:
      return {
        ...state,
        usersConnections: action.payload
      };

    case ASSET_CONNECTION_ADD:
      const aConnAdd = [...state.assetsConnections];
      aConnAdd.push({
        id: 0,
        idKid: action.userIdTo,
        idAsset: action.assetId
      });
      console.log("added");
      return {
        ...state,
        assetsConnections: aConnAdd
      };

    case ASSET_CONNECTION_DELETE:
      const aConnRemove = [...state.assetsConnections];
      const indexAssetRemove = _.findIndex(
        aConnRemove,
        item => item.idAsset === action.assetId
      );
      console.log("deleted", indexAssetRemove);
      aConnRemove.splice(indexAssetRemove, 1);
      return {
        ...state,
        assetsConnections: aConnRemove
      };

    case USER_CONNECTION_ADD:
      const uConnsAdd = [...state.usersConnections];
      uConnsAdd.push({
        id: 0,
        idParent: action.userIdTo,
        idKid: action.userId
      });
      return {
        ...state,
        usersConnections: uConnsAdd
      };

    case USER_CONNECTION_DELETE:
      const uConnsRemove = [...state.usersConnections];
      const indexUserRemove = _.findIndex(
        uConnsRemove,
        item => item.idParent === action.userIdTo
      );
      uConnsRemove.splice(indexUserRemove, 1);
      return {
        ...state,
        usersConnections: uConnsRemove
      };

    case USER_DELETE:
      const deleteIndex = _.findIndex(
        state.users,
        user => user.id === action.payload
      );
      const users = [...state.users];
      users.splice(deleteIndex, 1);
      return {
        ...state,
        users
      };
    default:
      return state;
  }
};
