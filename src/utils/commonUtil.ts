import { ReactNode } from "react";

export const APP_NAME = 'LUISA LPG TRADING'
export const ADDRESS = 'Mambog, City of Malolos, Bulacan'
export const CONTACT = '09335275665/09065169488'

export type Column<T> = {
  id: string;
  header: ReactNode;
  accessor: (row: T) => ReactNode;
  className?: string;
  headerClassName?: string;
};