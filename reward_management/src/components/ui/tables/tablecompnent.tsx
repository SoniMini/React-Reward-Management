import React from 'react';
import { Link } from 'react-router-dom';

interface TableProps<T> {
    columns: Array<{
        header: string;
        accessor: keyof T;
        link?: string;
    }>;
    data: T[];
    currentPage: number;
    itemsPerPage: number;
    handlePrevPage: () => void;
    handleNextPage: () => void;
    handlePageChange: (pageNumber: number) => void;
    showProductQR?: boolean;
    showProductQREdit?: boolean;
    showProductQRDelete?: boolean;
    showProductQRView?: boolean;
    productQREditLink?: string;
    productQRDeleteLink?: string;
    productQRViewLink?: string;
    showEdit?: boolean;
    showDelete?: boolean;
    showView?: boolean;
    editHeader?: string;
    editProductQR? :string;
    columnStyles?: { [key: string]: string };
    getColumnColorClass?: (value: string, columnAccessor: boolean) => any;
    onEdit?: (item: T) => void;
    onDelete?: (item: T) => void;
    onView?: (item: T) => void;
    iconsConfig?: {
        editIcon?: string;
        deleteIcon?: string;
        viewIcon?: string;
    };
    iconsDisabled?: {
        edit?: (item: T) => boolean;
        delete?: (item: T) => boolean;
        view?: (item: T) => boolean;
    }
}

function stripHtmlTags(html: string): string {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent || div.innerText || "";
}

const TableComponent = <T,>({
    columns,
    data,
    currentPage,
    itemsPerPage,
    handlePrevPage,
    handleNextPage,
    handlePageChange,
    showProductQR = true,
    showProductQREdit = true,
    showProductQRDelete = true,
    showProductQRView = true,
    showEdit = true,
    showDelete = false,
    showView = false,
    editHeader = "Edit",
    editProductQR = "Product QR",
    productQREditLink,
    productQRDeleteLink,
    productQRViewLink,
    columnStyles = {},
    getColumnColorClass = () => '',
    onEdit,
    onDelete,
    onView,
    iconsConfig = {},
    iconsDisabled = {},
}: TableProps<T>) => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(data.length / itemsPerPage);

    const isEditDisabled = (item: T) => iconsDisabled?.edit ? iconsDisabled.edit(item) : false;
    const isDeleteDisabled = (item: T) => iconsDisabled?.delete ? iconsDisabled.delete(item) : false;
    const isViewDisabled = (item: T) => iconsDisabled?.view ? iconsDisabled.view(item) : false;

    return (
        <div>
            <div className="table-responsive pt-2 overflow-y-auto ">
                <table className="table whitespace-nowrap min-w-full">
                    <thead>
                        <tr>
                            <th className="text-start p-3 text-sm text-defaulttextcolor font-semibold border border-gray-300">S.No</th>
                            {columns.map((column) => (
                                <th key={column.header} className="text-start p-3 text-sm text-defaulttextcolor font-semibold border border-gray-300">
                                    {column.header}
                                </th>
                            ))}
                            {showProductQR && (
                                <th className="text-start px-3 py-[6px] text-sm text-defaulttextcolor font-semibold border border-gray-300">{editProductQR}</th>
                            )}
                            {(showEdit || showDelete || showView) && (
                                <th className="text-start px-3 py-[6px] text-sm text-defaulttextcolor font-semibold border border-gray-300">{editHeader}</th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((item, index) => (
                            <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                <td className="p-3 text-defaultsize font-medium text-defaulttextcolor whitespace-nowrap border border-gray-300 ">{indexOfFirstItem + index + 1}</td>
                                {/* {columns.map((column) => (
                                <td
                                    key={column.accessor as string}
                                    className={`p-3  text-defaultsize font-medium whitespace-nowrap border border-gray-300 ${columnStyles[column.header] || 'text-defaulttextcolor'}  ${getColumnColorClass(item[column.accessor], column.accessor)}`}
                                >
                                    {typeof item[column.accessor] === 'string' 
                                        ? stripHtmlTags(item[column.accessor] as string) 
                                        : item[column.accessor]}
                                </td>
                            ))} */}
                                {columns.map((column) => (
                                    <td
                                        key={column.accessor as string}
                                        className={`p-3 text-defaultsize font-medium whitespace-nowrap border border-gray-300 ${columnStyles[column.header] || 'text-defaulttextcolor'} ${getColumnColorClass(item[column.accessor], column.accessor)}`}
                                    >
                                        {column.link ? (
                                            <Link
                                                to={column.link.replace(/:(\w+)/g, (_, key) => {
                                                    const value = item[key];
                                                    return value ? value.replace(/\s+/g, '_') : key;
                                                })}
                                                className="text-defaulttextcolor hover:underline hover:text-primary"
                                            >
                                                {item[column.accessor]}
                                            </Link>
                                        ) : (
                                            item[column.accessor]
                                        )}
                                    </td>
                                ))}
                                {showProductQR && (
                                    <td className="p-3 text-defaultsize font-medium text-defaulttextcolor whitespace-nowrap border border-gray-300 text-center">
                                        {showProductQREdit && (
                                            <Link aria-label="anchor" to={productQREditLink} className="link-icon bg-[var(--bg-primary)] hover:bg-[var(--primaries)] px-[11px] py-[10px]  rounded-full mr-2">
                                                <i className={iconsConfig.editIcon || "ri-edit-line"}></i>
                                            </Link>
                                        )}
                                        {showProductQRDelete && (
                                            <Link aria-label="anchor" to={productQRDeleteLink} className="link-icon bg-[var(--bg-primary)] hover:bg-[var(--primaries)] px-[11px] py-[10px] rounded-full mr-2">
                                                <i className={iconsConfig.deleteIcon || "ri-delete-bin-line"}></i>
                                            </Link>
                                        )}
                                        {showProductQRView && (
                                            <Link aria-label="anchor"   
                                            to={productQRViewLink?.replace(":name", item["name"]?.replace(/\s+/g, '_'))} 
                                            className="link-icon bg-[var(--bg-primary)] hover:bg-[var(--primaries)] px-[11px] py-[10px] rounded-full mr-2">
                                                <i className={iconsConfig.viewIcon || "ti ti-eye-check"}></i>
                                            </Link>
                                        )}
                                    </td>
                                )}

                                {/* {showProductQR && (
                                    <td className="p-3 text-defaultsize font-medium text-defaulttextcolor whitespace-nowrap border border-gray-300 ">
                                        <Link aria-label="anchor" to="#" className="link-icon bg-[var(--bg-primary)] hover:bg-[var(--primaries)] py-[6px] px-[10px] rounded-full mr-2">
                                            <i className={iconsConfig.editIcon || "ri-edit-line"}></i>
                                        </Link>
                                        <Link aria-label="anchor" to="#" className="link-icon bg-[var(--bg-primary)] hover:bg-[var(--primaries)] py-[6px]  px-[10px] rounded-full mr-2">
                                            <i className={iconsConfig.deleteIcon || "ri-delete-bin-line"}></i>
                                        </Link>
                                        <Link aria-label="anchor" to="#" className="link-icon bg-[var(--bg-primary)] hover:bg-[var(--primaries)] py-[6px]  px-[10px] rounded-full mr-2">
                                            <i className={iconsConfig.viewIcon || "ti ti-eye-check"}></i>
                                        </Link>
                                    </td>
                                )} */}
                                {(showEdit || showDelete || showView) && (
                                    <td className="p-3 text-defaultsize font-medium text-defaulttextcolor whitespace-nowrap border border-gray-300">
                                        {showEdit && (
                                            <button
                                                onClick={(e) => {
                                                    if (isEditDisabled(item)) {
                                                        e.preventDefault();
                                                    } else {
                                                        onEdit?.(item);
                                                    }
                                                }} className={`link-icon bg-[var(--bg-primary)] hover:bg-[var(--primaries)] py-[6px] px-[10px] rounded-full mr-2 ${isEditDisabled(item) ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                disabled={isEditDisabled(item)}>
                                                <i className={iconsConfig.editIcon || "ri-edit-line"}></i>
                                            </button>
                                        )}
                                        {showDelete && (
                                            <button onClick={(e) => {
                                                if (isDeleteDisabled(item)) {
                                                    e.preventDefault();
                                                } else {
                                                    onDelete?.(item);
                                                }
                                            }}
                                                className={`link-icon bg-[var(--bg-primary)] hover:bg-[var(--primaries)] py-[6px] px-[10px] rounded-full mr-2 ${isDeleteDisabled(item) ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                disabled={isDeleteDisabled(item)}
                                            >
                                                <i className={iconsConfig.deleteIcon || "ri-delete-bin-line"}></i>
                                            </button>
                                        )}
                                        {showView && (
                                            <button onClick={(e) => {
                                                if (isViewDisabled(item)) {
                                                    e.preventDefault();
                                                } else {
                                                    onView?.(item);
                                                }
                                            }}
                                                className={`link-icon bg-[var(--bg-primary)] hover:bg-[var(--primaries)] py-[6px] px-[10px] rounded-full mr-2 ${isViewDisabled(item) ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                disabled={isViewDisabled(item)}
                                            >
                                                <i className={iconsConfig.viewIcon || "ti ti-eye-check"}></i>
                                            </button>
                                        )}
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {/* table numbers------ */}
            <div className="box-footer p-4   ">
                <div className="sm:flex items-center">
                    <div className="text-defaulttextcolor dark:text-defaulttextcolor/70 font-normal text-defaultsize">
                        Showing {currentItems.length} Entries <i className="bi bi-arrow-right ms-2 font-semibold"></i>
                    </div>

                    <div className="ms-auto">
                        <nav aria-label="Page navigation" className="pagination-style-4">
                            <ul className="ti-pagination flex items-center px-3 mb-0">
                                <li className="page-item px-2">
                                    <button
                                        className="page-link"
                                        onClick={() => handlePageChange(1)}
                                        disabled={currentPage === 1}
                                    >
                                        «
                                    </button>
                                </li>
                                <li className="page-item px-2">
                                    <button
                                        className="page-link"
                                        onClick={handlePrevPage}
                                        disabled={currentPage === 1}
                                    >
                                        Prev
                                    </button>
                                </li>
                                {Array.from({ length: Math.min(5, totalPages) }, (_, idx) => {
                                    const startPage = Math.max(1, currentPage - 2);
                                    const pageNumber = startPage + idx;

                                    return (
                                        pageNumber <= totalPages && (
                                            <li className="page-item px-2" key={pageNumber}>
                                                <button
                                                    className={`page-link px-2 rounded-[5px] ${currentPage === pageNumber
                                                        ? "text-white bg-primary"
                                                        : "bg-[#dee9eb]"
                                                        }`}
                                                    onClick={() => handlePageChange(pageNumber)}
                                                >
                                                    {pageNumber}
                                                </button>
                                            </li>
                                        )
                                    );
                                })}
                                <li className="page-item px-2">
                                    <button
                                        className="page-link"
                                        onClick={handleNextPage}
                                        disabled={currentPage === totalPages}
                                    >
                                        Next
                                    </button>
                                </li>
                                <li className="page-item px-2">
                                    <button
                                        className="page-link"
                                        onClick={() => handlePageChange(totalPages)}
                                        disabled={currentPage === totalPages}
                                    >
                                        »
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>

        </div>
    );
};


export default TableComponent;
