import { useState, useEffect, useMemo, useRef } from 'react';
import {
    Box, Text, Table, Thead, Tbody, 
    Tr, Th, Td, chakra, Button, Input, 
    NumberInput, NumberInputField,
    NumberInputStepper, NumberIncrementStepper,
    NumberDecrementStepper, Flex, Select 
} from '@chakra-ui/react'
import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons"

import { useTable, useSortBy, usePagination, useGlobalFilter, useAsyncDebounce } from "react-table"


// Search component 
function GlobalSearch({ globalFilter, setGlobalFilter }) { 
    const [value, setValue] = useState(globalFilter) 

    const onChange = useAsyncDebounce(value => { 
        // Set undefined to remove the filter entirely 
        setGlobalFilter(value || undefined) 
    }, 200) 

    return ( 
        <Box my={5}> 
            <Text fontWeight="600"> Search </Text> 
            <Input 
                type="text" 
                maxW="250px" 
                variant="flushed" 
                placeholder="Search" 
                value={value || ''} 
                onChange={e => { 
                    setValue(e.target.value); 
                    onChange(e.target.value); 
                }} 
            /> 
        </Box> 
    ) 
} 






function Datagrid( 
    { 
        // props 
        data, 
        columns, 
        fetchData, 
        pageCount: controlledPageCount, 
        sortOn, 
        defaultPageSize, 
        tableHeightInPage, 
        selectNoOfRows 
    }) { 
    const skipPageResetRef = useRef() 

    const columnList = useMemo(() => columns, []) 
    const dataList = useMemo(() => data, []) 

    useEffect(() => { 
        // After the table has updated, always remove the flag 
        skipPageResetRef.current = false 
    }) 
    
    const tableInstance = useTable({ 
            columns, 
            data, 
            initialState: { pageIndex: 0, pageSize: defaultPageSize }, 
            manualPagination: true, 
            pageCount: controlledPageCount, 
            autoResetPage: false, 
            autoResetGlobalFilter: false, 
            
            autoResetFilters: !skipPageResetRef.current, 
            autoResetExpanded: !skipPageResetRef.current,
            autoResetGroupBy: !skipPageResetRef.current,
            autoResetSelectedRows: !skipPageResetRef.current,
            autoResetSortBy: !skipPageResetRef.current,
            autoResetRowState: !skipPageResetRef.current,
            // !skipPageResetRef.current
        }, 
        useGlobalFilter,  
        useSortBy,  
        usePagination  
    ) 

    const { 
        getTableProps, 
        getTableBodyProps, 
        headerGroups, 
        page, 
        previousPage, 
        canPreviousPage, 
        nextPage, 
        canNextPage,
        prepareRow, 
        pageCount, 
        state: { pageIndex, pageSize, globalFilter }, 
        setPageSize, 
        gotoPage, 
        setGlobalFilter
    } = tableInstance; 


    useEffect(() => { 
        fetchData({ pageIndex, pageSize, globalFilter, skipPageResetRef }) 
    }, [fetchData, pageIndex, pageSize, globalFilter]) 

    


    return ( 
        <Box> 
            <Box p={30} h={tableHeightInPage} overflow="auto"> 
                <GlobalSearch 
                    globalFilter={globalFilter} 
                    setGlobalFilter={setGlobalFilter} 
                /> 

                <Table {...getTableProps()}> 
                    <Thead> 
                        { 
                            headerGroups?.map(headerGroup => ( 
                                <Tr {...headerGroup.getHeaderGroupProps()}> 
                                    { 
                                        headerGroup.headers?.map(column => ( 
                                            <Th 
                                                { 
                                                    ...column.getHeaderProps( 
                                                        sortOn.includes(column.Header) 
                                                        && column.getSortByToggleProps() 
                                                    ) 
                                                } 
                                                
                                                sx={{width: column.Header === 'ID' && {base: '', sm: '', md: '14%', lg: '9%'}}} 
                                                > 

                                                {/* Display each cell header */} 
                                                { column.render('Header') } 

                                                {/* Display icons for sorting */} 
                                                <chakra.span pl="10px">
                                                    { 
                                                        column.isSorted 
                                                        ? 
                                                        ( 
                                                            column.isSortedDesc 
                                                            ? <TriangleDownIcon aria-label="sorted descending" /> 
                                                            : <TriangleUpIcon aria-label="sorted ascending" /> 
                                                        ) 
                                                        : null 
                                                    } 
                                                </chakra.span> 
                                            </Th> 
                                        )) 
                                    } 
                                </Tr> 
                            )) 
                        } 
                    </Thead> 

                    <Tbody {...getTableBodyProps()} > 
                        { 
                            page?.map((row, i) => { 
                                prepareRow(row) 
                                return ( 
                                    <Tr 
                                        {...row.getRowProps()} 
                                        _hover={{background: '#0000000a'}}> 
                                        { 
                                            row?.cells?.map(cell => ( 
                                                <Td {...cell.getCellProps()}> 
                                                    { 
                                                        cell.render('Cell') 
                                                    } 
                                                </Td> 
                                            )) 
                                        } 
                                    </Tr> 
                                ) 
                            }) 
                        } 
                    </Tbody> 
                </Table> 
            </Box> 



            {/* Pagination */} 
            <Box p="30px"> 
                <Flex mt="30px" flexWrap="wrap"> 
                    <Button 
                        onClick={() => gotoPage(0)} 
                        size="sm" 
                        mr="10px" colorScheme="teal" 
                        variant="outline"
                        disabled={!canPreviousPage}
                        > 
                        {`<<`} 
                    </Button> 
                    <Button 
                        onClick={() => previousPage()} 
                        size="sm" 
                        mr="10px" colorScheme="teal" 
                        variant="outline"
                        disabled={!canPreviousPage}
                        > 
                        {`<`} 
                    </Button> 
                    <Button 
                        onClick={() => nextPage()} 
                        size="sm" 
                        mr="10px" colorScheme="teal" 
                        variant="outline"
                        disabled={!canNextPage}
                        > 
                        {`>`} 
                    </Button> 
                    <Button 
                        onClick={() => gotoPage(pageCount-1)} 
                        size="sm" 
                        mr="10px" colorScheme="teal" 
                        variant="outline"
                        disabled={!canNextPage}
                        > 
                        {`>>`} 
                    </Button> 
                
                    <chakra.span mr="10px" fontWeight="600"> 
                        {pageIndex+1} of {pageCount} 
                    </chakra.span> 

                    <chakra.span> 
                        | Go to page &nbsp; 
                    </chakra.span> 
                    <NumberInput 
                        defaultValue={pageIndex+1} 
                        min={1} max={pageCount} 
                        onChange={(value) => gotoPage((+value) - 1) } 
                        w="80px" size="sm" mr="20px"> 
                        <NumberInputField /> 
                        <NumberInputStepper> 
                            <NumberIncrementStepper/> 
                            <NumberDecrementStepper/> 
                        </NumberInputStepper> 
                    </NumberInput> 

                    <Box> 
                        <Select 
                            value={pageSize} variant="flushed" size="sm"
                            w="100px" colorScheme="red"
                            onChange={e => setPageSize(Number(e.target.value))}> 
                            { 
                                selectNoOfRows.map(pageSize => ( 
                                    <option key={pageSize} value={pageSize}> 
                                        Show {pageSize} 
                                    </option> 
                                )) 
                            } 
                        </Select> 
                    </Box> 
                </Flex> 
            </Box> 
        </Box> 
    ) 
} 

export default Datagrid;


