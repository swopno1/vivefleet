export interface Driver {
  id: string;
  name: string;
  phone: string;
  status?: "offline" | "onDuty" | "offDuty";
}
