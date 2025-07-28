
import * as ssDing from '../utils/Dingding.js';

  const SensorRequest = {

    GetDDingCode(param, callSuccess, callFail) {
        ssDing.PostDataUrl("Ding_GetMFACode", param, true, respData => {
          callSuccess(respData);
        }, callFail);
      }
  };

  export default SensorRequest;

