import { requestResponse } from "../redux/actions/requests";
import { store } from "../store/configureStore";

const payloadDefault = {
  url: "",
  method: "GET",
  mode: "cors",
  cache: "no-cache",
  body: null,
  reqId: null
};
export default function fetchApi(payload) {
  const p = Object.assign({}, payloadDefault, payload);
  p.url = `http://localhost:8080${p.url}`;

  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Accept", "application/json; charset=utf-8");

  if (p.body) {
    p.body = JSON.stringify(p.body);
    myHeaders.append("Content-Length", p.body.length.toString());
  }
  p.headers = myHeaders;

  const req = new Request(p.url, p);
  return fetch(req).then(
    async result => {
      if (result.status === 200) {
        return result.json();
      }
      store.dispatch(requestResponse(p.reqId, false, "unknown"));
      return null;
    },
    err => {
      store.dispatch(requestResponse(p.reqId, false, err));
    }
  );
}
