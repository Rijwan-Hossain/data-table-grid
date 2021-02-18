import { useState, useEffect, useRef, useCallback } from 'react'
import {
  Box, Container 
} from '@chakra-ui/react' 
import axios from 'axios'
import Datagrid from './component/Datagrid'

function App() { 
  const [data, setData] = useState([]) 
  const [pageCount, setPageCount] = useState(0) 
  const fetchIdRef = useRef(0) 

  let columns = [ 
    { 
      Header: 'ID', 
      accessor: '_id'
    }, 
    { 
      Header: 'Name', 
      accessor: 'name'
    }, 
    { 
      Header: 'Route', 
      accessor: 'route'
    },  
    { 
      Header: 'Body', 
      accessor: 'menuType'
    } 
  ] 

  // let sortOn = ['ID', 'Name', 'Email'] 
  let sortOn = ['ID', 'Name', 'Route'] 


  const fetchData = useCallback(({ pageSize, pageIndex, globalFilter, skipPageResetRef }) => { 

    const fetchId = ++fetchIdRef.current 
    let totalLength
    if(globalFilter) { 
      // Filtering on name field
      axios.get(`http://192.168.1.227:3530/api/v1/menus?name=${globalFilter}`) 
        .then((res) => { 

          totalLength = res.length || 500 
          const {data: serverData} = res.data 
          if (fetchId === fetchIdRef.current) { 
            if(serverData.length >= 1) { 
              skipPageResetRef.current = true 
              setData(serverData) 
              setPageCount(Math.ceil(totalLength/pageSize)) 
            } 
          } 
        }) 
        .catch(err => console.log(err, 'Data fetch error')) 
    } 
    else { 
      // Pagination 
      axios.get(`http://192.168.1.227:3530/api/v1/menus?page=${(pageIndex)+1}&limit=${pageSize}`) 
        .then((res) => { 
          totalLength = res.length || 500 
          const {data: serverData} = res.data 
          
          if (fetchId === fetchIdRef.current) { 
            skipPageResetRef.current = true 
            setData(serverData) 
            setPageCount(Math.ceil(totalLength/pageSize)) 
          } 
        }) 
        .catch(err => console.log(err, 'Data fetch error')) 
    }
  }, [])  


  




  return ( 
    <Box bg="#edf2f9" minH="100vh"> 
      <Container maxW="1100px" py={30}> 
        <Box w="100%" bg="white" rounded="lg" boxShadow="lg"> 
          <Datagrid 
            data={data} 
            columns={columns} 
            pageCount={pageCount} 
            fetchData={fetchData} 
            sortOn={sortOn} 
            defaultPageSize={3} 
            tableHeightInPage='75vh' 
            selectNoOfRows={[3, 10, 20, 30, 50, 100]} /> 
        </Box> 
      </Container> 
    </Box> 
  ); 
} 

export default App;
