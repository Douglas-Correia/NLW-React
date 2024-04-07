import { ComponentProps } from "react";

interface TableHeaderProps extends ComponentProps<'th'> {

}

export function TableHeader(props: TableHeaderProps) {
  return (
    <th style={{ width: 48 }} className="py-3 px-4 font-semibold text-left" {...props}></th>
  )
}
