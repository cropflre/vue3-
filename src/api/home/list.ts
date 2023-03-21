import http from '../../utils/http';
enum Api {
  getTableList = './get_table_list',
}

export const GetTableListApi = (params?: any) => {
  return http.get(Api.getTableList, params);
};
