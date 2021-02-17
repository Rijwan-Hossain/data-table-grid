import { useState, useEffect } from 'react';
import {
    Box, Table, Thead, Tbody, 
    Tr, Th, Td, chakra, Button, 
    NumberInput, NumberInputField,
    NumberInputStepper, NumberIncrementStepper,
    NumberDecrementStepper, Flex, Select 
} from '@chakra-ui/react'
import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons"

import { useTable, useSortBy, usePagination, useGlobalFilter } from "react-table"
import GlobalSearch from './GlobalSearch'

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
    // const columnList = useMemo(() => columns, []) 
    // const dataList = useMemo(() => data, []) 

    const [filterText, setFilterText] = useState('') 

    const tableInstance = useTable({ 
            columns, 
            data, 
            initialState: { pageIndex: 0, pageSize: defaultPageSize }, 
            manualPagination: true, 
            pageCount: controlledPageCount, 
            autoResetPage: false 
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
        fetchData({ pageIndex, pageSize }) 
    }, [fetchData, pageIndex, pageSize]) 

    useEffect(() => { 
        console.log({filterText});
    }, [filterText]) 
    
    return ( 
        <Box> 
            <Box p={30} h={tableHeightInPage} overflow="auto"> 
                <GlobalSearch filterText={filterText} setFilterText={setFilterText} /> 

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



            <Box p="30px"> 
            {/* Pagination */} 
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