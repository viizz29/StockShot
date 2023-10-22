import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import AccountInfo from '../components/account-info';
import Favorites from '../components/favorites';
import AdminWidget from '../components/admin-widget';

export default function Home(){
  const token = localStorage.getItem("token");
  const userData = JSON.parse(localStorage.getItem("data"));

  return(
    <Box
    >

          <Typography component="h1" variant="h5">Home</Typography>
          {userData && userData.isAdmin && (
            <div>
              <AdminWidget/>
              </div>
          )}
          {token && (<div>
            <AccountInfo/>
            <Favorites/>
            </div>
          )
          }
          {!token && (
            <div>Home Page Contents Goes here.</div>
          )
          }
          
    </Box>
 
  );
}
