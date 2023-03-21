export type INavList = INavItem[];
export type MirrorImageScriptType = 'tensorflow' | 'python' | 'pytorch';
export interface INavItem {
  label: string;
  value: MirrorImageScriptType;
  disabled: boolean;
}
export interface IStringMap<T> {
  [key: string]: T;
}
