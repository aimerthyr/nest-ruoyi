export interface DeptTreeItemVO {
  id: number;
  label: string;
  disabled: boolean;
  children?: DeptTreeItemVO[];
}
