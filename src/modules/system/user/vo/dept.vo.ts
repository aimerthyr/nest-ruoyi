export interface DeptTreeItemVO {
  id: bigint;
  label: string;
  disabled: boolean;
  children?: DeptTreeItemVO[];
}
