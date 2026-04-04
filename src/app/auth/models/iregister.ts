import { Ilogin } from './ilogin';
export interface Iregister extends Ilogin {
  name: string;
  confirmPassword?: string;
}
