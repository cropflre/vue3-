import { INavList, IStringMap, MirrorImageScriptType } from 'application/views/mirror-image/type';
import { Ref } from 'vue';

// eslint-disable-next-line @typescript-eslint/naming-convention
export const arrayNavList: INavList = [
  { label: 'TensorFlow镜像', value: 'tensorflow', disabled: false },
  { label: 'Python镜像', value: 'python', disabled: false },
  { label: 'Pytorch镜像', value: 'pytorch', disabled: false },
];

// eslint-disable-next-line @typescript-eslint/naming-convention
export const ScriptTableColumn = [
  {
    label: '镜像名称',
    prop: 'image_cname',
  },
  {
    label: '镜像描述',
    prop: 'image_desc',
  },
  {
    label: '基础镜像',
    prop: 'base_image',
  },
  {
    label: '更新时间',
    prop: 'updated_at',
  },
  {
    label: '状态',
    prop: 'status',
    slot: true,
  },
  {
    label: '操作',
    prop: 'opacity',
    width: 180,
    slot: true,
  },
];

export function useComputedNavListLabelMapToValue(navList: Ref<INavList>) {
  return function (): IStringMap<MirrorImageScriptType> {
    const result: IStringMap<MirrorImageScriptType> = {};

    navList.value?.forEach((item) => {
      if (!item?.disabled) {
        result[item.label] = item.value;
      }
    });

    return result;
  };
}
