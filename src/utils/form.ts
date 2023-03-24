/**
 * 表单相关方法
 */

// 判断表单是否填写
export const judgeForm = (formRef: any) => {
  let result = true;
  if (formRef) {
    formRef?.validate((res: boolean) => {
      result = res;
    });
  }
  return result;
};
