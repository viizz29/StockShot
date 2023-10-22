import React, { useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import YearChart from '../components/year-chart';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';


export default function Instrument(){
  const [token, setToken] = React.useState(null);
  const [isFav, setFav] = React.useState(false);
  const [symbol, setSymbol] = React.useState('');

  useEffect(() => {
        const token = localStorage.getItem("token");
        setToken(token);

        const params = new URLSearchParams(window.location.search);
        const symbol = params.get('name');
        setSymbol(symbol);
  
        fetch("/api/is-favorite?symbol="+symbol, {
          method: 'GET',
          headers: {
            'x-access-token': token,
          },
        })
          .then(res => res.json())
          .then(
            (result) => {
              console.log(result);
              if(result.isfav)
                setFav(true);
            },
            (error) => {
              console.log(error);
            }
          );
    return () => {
      
      // Component unmounted
    
    };
  }, []);

  const addToFavorite = () => {
    fetch("/api/add-favorite?symbol="+symbol, {
      method: 'GET',
      headers: {
        'x-access-token': token,
      },
    })
      .then(res => res.json())
      .then(
        (result) => {
          setFav(true);
          //console.log(result);
          
        },
        (error) => {
          console.log(error);
        }
      );
    console.log("added to favorites");
  }
  const removeFavorite = () => {
    console.log("removed from favorites");
    fetch("/api/remove-favorite?symbol="+symbol, {
      method: 'GET',
      headers: {
        'x-access-token': token,
      },
    })
      .then(res => res.json())
      .then(
        (result) => {
          setFav(false);
          //console.log(result);
          
        },
        (error) => {
          console.log(error);
        }
      );

  }



  
  return(
    <Box
    >
          
          {token && (<div>
            <Typography component="h1" variant="h5">One Year of {symbol}
            {!isFav && <FavoriteBorderIcon onClick={addToFavorite} sx={{ml:2}}/>}
            {isFav && <FavoriteIcon  onClick={removeFavorite} sx={{ml:2}}/>}
            </Typography>
            
            <YearChart/>
            </div>
          )
          }
          {!token && (
            <div>You need to login to your account first.</div>
          )
          }
          
    </Box>
 
  );
}
