
import * as ssDing from '../utils/Dingding.js';


const SensorBorderRequest = {

      // 分页查询展示操作
      fetchOperations(param, callSuccess, callFail) {
        ssDing.PostDataUrl("getAll", param,true, respData => {
          callSuccess(respData);
        }, callFail);
      },

      fetchUserOperations(param, callSuccess, callFail) {
        ssDing.PostDataUrl("getUserAll", param,true, respData => {
          callSuccess(respData);
        }, callFail);
      },


      searchOperations: (query, callSuccess, callFail) => {
        ssDing.PostDataUrl('search',  query, true, respData => {
          callSuccess(respData);
        }, callFail);
      },

      searchUserOperations: (query, callSuccess, callFail) => {
        ssDing.PostDataUrl('searchUser',  query, true, respData => {
          callSuccess(respData);
        }, callFail);
      },

      searchQRCard: (query, callSuccess, callFail) => {
        ssDing.PostDataUrl('searchQRCard',  query, true, respData => {
          callSuccess(respData);
        }, callFail);
      },

      // 更新操作和保存操作
      saveOperation(isEdit, currentId, param, callSuccess, callFail) {
        const url = isEdit ? `/api/card-storage-operations/update/${currentId}` : '/api/card-storage-operations/save';
        const method = isEdit ? 'post' : 'post';

        ssDing.RequestDataUrl1(method, url, param, true, respData => {
          callSuccess(respData);
        }, callFail);
      },

      // 删除操作
      deleteOperation(param, callSuccess, callFail) {
        ssDing.PostDataUrl(`delete`, param,true, respData => {
          callSuccess(respData);
        }, callFail);
      },


      scanOnceOperation(param, callSuccess, callFail) {
        ssDing.PostDataUrl(`scanOnceOperation`, param,true, respData => {
          callSuccess(respData);
        }, callFail);
      },

      scanListOperation(param, callSuccess, callFail) {
        ssDing.PostDataUrl(`scanListOperation`, param,true, respData => {
          callSuccess(respData);
        }, callFail);
      },


      scanResults(param, callSuccess, callFail) {
        ssDing.PostDataUrl(`scanResults`, param,true, respData => {
          callSuccess(respData);
        }, callFail);
      },

      fetchWeldingContent(param, callSuccess, callFail) {
        ssDing.PostDataUrl(`welding`, null,true, respData => {
          callSuccess(respData);
        }, callFail);
      },

      fetchAssembleContent(param, callSuccess, callFail) {
        ssDing.PostDataUrl(`assemble`, null,true, respData => {
          callSuccess(respData);
        }, callFail);
      },

      fetchBelongContent(callSuccess, callFail) {
        ssDing.PostDataUrl(`belong`, null,true, respData => {
          callSuccess(respData);
        }, callFail);
      },

      fetchProductBelongContent(param,callSuccess, callFail) {
        ssDing.PostDataUrl(`productBelong`, param,true, respData => {
          callSuccess(respData);
        }, callFail);
      },

      fetchAssembleOptionContent(param,callSuccess, callFail) {
        ssDing.PostDataUrl(`fetchAssembleOptionContent`, param,true, respData => {
          callSuccess(respData);
        }, callFail);
      },
      fetchWeldingOptionContent(param,callSuccess, callFail) {
        ssDing.PostDataUrl(`fetchWeldingOptionContent`, param,true, respData => {
          callSuccess(respData);
        }, callFail);
      },

      fetchObjectTypeContent(storedProductId, callSuccess, callFail) {
        ssDing.PostDataUrl(`type`, storedProductId,true, respData => {
          callSuccess(respData);
        }, callFail);
      },


      GetTriCardRecords(boardID, callSuccess, callFail) {
        ssDing.PostDataUrl("triCardRecords",boardID,true, respData => {
          callSuccess(respData);
        }, callFail);
      },

      GetCategoryRecords(boardID, callSuccess, callFail) {
        ssDing.PostDataUrl("categoryRecords",boardID,true, respData => {
          callSuccess(respData);
        }, callFail);
      },

      GetPersonRecords(boardID, callSuccess, callFail) {
        ssDing.PostDataUrl("personCardRecords",boardID,true, respData => {
          callSuccess(respData);
        }, callFail);
      },

      SaveAllCardRecords(reqData) {
        return new Promise((resolve, reject) => {
          ssDing.PostDataUrl("save", reqData, true, respData => {
            resolve(respData);
          }, error => {
            reject(error);
          });
        });
      },
};

  export default SensorBorderRequest;

