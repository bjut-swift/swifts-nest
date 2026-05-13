import {
  ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import * as React from 'react';

import clsxm from '@/lib/clsxm';

import Filter from '@/components/table/Filter';
import TBody from '@/components/table/TBody';
import TFoot from '@/components/table/TFoot';
import THead from '@/components/table/THead';

type TableProps<T extends object> = {
  data: T[];
  columns: ColumnDef<T>[];
  omitSort?: boolean;
  withFilter?: boolean;
  withFooter?: boolean;
  withPagination?: boolean;
  pageSize?: number;
} & React.ComponentPropsWithoutRef<'div'>;

export default function Table<T extends object>({
  className,
  columns,
  data,
  omitSort = false,
  withFilter = false,
  withFooter = false,
  withPagination = false,
  pageSize = 20,
  ...rest
}: TableProps<T>) {
  const [globalFilter, setGlobalFilter] = React.useState('');
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize,
  });

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
      sorting,
      ...(withPagination && { pagination }),
    },
    defaultColumn: {
      minSize: 0,
      size: 0,
    },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    ...(withPagination && { onPaginationChange: setPagination }),
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    ...(withPagination && { getPaginationRowModel: getPaginationRowModel() }),
  });

  return (
    <div className={clsxm('flex flex-col', className)} {...rest}>
      {withFilter && <Filter table={table} />}
      <div className='-mx-4 -my-2 mt-2 overflow-x-auto sm:-mx-6 lg:-mx-8'>
        <div className='inline-block min-w-full py-2 align-middle md:px-6 lg:px-8'>
          <div className='ring-opacity-5 overflow-hidden ring-1 ring-black md:rounded-lg dark:ring-gray-800'>
            <table className='min-w-full divide-y divide-gray-200 dark:divide-gray-800'>
              <THead table={table} omitSort={omitSort} />
              <TBody table={table} />
              {withFooter && <TFoot table={table} />}
            </table>
          </div>
        </div>
      </div>
      {withPagination && table.getPageCount() > 1 && (
        <div className='mt-4 flex items-center justify-between text-sm text-gray-600 dark:text-gray-400'>
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className='hover:border-primary-300 hover:text-primary-500 rounded-sm border border-gray-300 px-3 py-1.5 transition-colors disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-600'
          >
            上一页
          </button>
          <span>
            第 {table.getState().pagination.pageIndex + 1} /{' '}
            {table.getPageCount()} 页
          </span>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className='hover:border-primary-300 hover:text-primary-500 rounded-sm border border-gray-300 px-3 py-1.5 transition-colors disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-600'
          >
            下一页
          </button>
        </div>
      )}
    </div>
  );
}
