import { useState, useRef, useCallback } from 'react'
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
      accessor: 'id'
    }, 
    { 
      Header: 'Name', 
      accessor: 'name'
    }, 
    { 
      Header: 'Email', 
      accessor: 'email'
    },  
    { 
      Header: 'Body', 
      accessor: 'body'
    } 
  ] 

  let sortOn = ['ID', 'Name', 'Email'] 


  const fetchData = useCallback(({ pageSize, pageIndex }) => { 
    console.clear(); 
    const fetchId = ++fetchIdRef.current 

    // use this call 
    // *** axios.get(`API?page=${pageIndex}&limit=${pageSize}`) *** 
    axios.get(`https://jsonplaceholder.typicode.com/comments?_start=${(pageIndex)* pageSize}&_limit=${pageSize}`) 
      .then((res) => { 
        const totalLength = res.length || 500 
        const {data: serverData} = res 

        if (fetchId === fetchIdRef.current) { 
          setData(serverData) 
          setPageCount(Math.ceil(totalLength/pageSize)) 
        } 
      }) 
      .catch(err => console.log(err, 'Data fetch error')) 
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
            defaultPageSize={5}
            tableHeightInPage='75vh'
            selectNoOfRows={[5, 10, 20, 30, 50, 100]} /> 
        </Box> 
      </Container> 
    </Box> 
  ); 
} 

export default App;
