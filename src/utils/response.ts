/**
 * @param {number} code
 * @param {string} message
 * @param {*} data
 * @returns {}
 */
export const responseSuccess = (code, message = 'Success', data) => {
  let result = {
      meta : {
          code: code,
          success: true,
          message: message
      }
  }

  if (data) {
      result['data'] = data;
  }

  return result;
}

export const responseFormat = (code : number, status : boolean, message : string, data : any, pagination : any = null) => {
  let result = {
      meta : {
          code: code,
          success: true,
          message: message
      }
  }

  if (data) {
      result['data'] = data;
  }

  if (pagination) {
      result['totalData'] = pagination.totalData;
      result['limit'] = pagination.limit;
      result['totalPages'] = pagination.totalPages;
      result['page'] = pagination.page;
      result['hasPrevPage'] = pagination.hasPrevPage;
      result['hasNextPage'] = pagination.hasNextPage;
      result['prevPage'] = pagination.prevPage;
      result['nextPage'] = pagination.nextPage;
  }

  return result;
}

/**
* @param code - number
* @param error - string
* @return {}
*/
export const responseError = (code, error) => {
  let result = {
      meta : {
          code: code,
          success: false,
          message: error.message || error
      }
  }

  return result;
}