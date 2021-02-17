import React from 'react'; 
import { Box, Input, Text } from '@chakra-ui/react'; 

function GlobalSearch({filterText, setFilterText}) { 
    return ( 
        <Box my={5}> 
            <Text fontWeight="600">
                Search 
            </Text>
            <Input 
                type="text" 
                maxW="250px" 
                variant="flushed"
                placeholder="Search"
                value={filterText} 
                onChange={(e) => setFilterText(e.target.value)} 
            /> 
        </Box> 
    ) 
} 

export default GlobalSearch; 