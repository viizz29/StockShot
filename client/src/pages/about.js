import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';


class About extends React.Component {
    render() {
        return (
           
             
              <Box
                sx={{
                  marginTop: 8,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >

              <Typography component="h1" variant="h3">
                  About
              </Typography>
              <Typography >
                  Write something here, provide contact details
              </Typography>
                
              </Box>
             
           
        );
      
    }
  }
  

export default About; 
