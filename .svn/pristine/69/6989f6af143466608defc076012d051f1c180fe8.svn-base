import Box from '@mui/material/Box';
import MainCard from 'ui-component/cards/MainCard';
import { DataGrid } from '@mui/x-data-grid';
import React ,{useState,useEffect} from 'react'
import axiosInstance from 'hooks/useAuthTokenUrl';
const columns = [
 
   {
    field: 'ministryCode',
    headerName: 'Ministry Code',
    width: 150
  }, 
  {
    field: 'ministryName',
    headerName: 'Ministry Name',
    width: 150,
    editable: true,
  },
  {
    field: 'ministryShortName',
    headerName: 'Ministry Short Name',
    width: 150,
    editable: true,
  },
  {
    field: 'ministryAddress',
    headerName: 'Ministry Address',
    width: 150,
    editable: true,
  },
  {
    field: 'createdBy',
    headerName: 'Created/Modified By',
    width: 150,
    editable: true,
  },
  {
    field: 'creationDate',
    headerName: 'Created/Modified Date',
    width: 150,
    editable: true,
  },
  
  
];


function UpdateMinistry() {
  const [getAllMinistry, setAllMinistry] = useState([])
  const fetchData = async () => {
    const getUrl = '/master-management/findAllMinistryMaster';
    const response = await axiosInstance.get(getUrl)
    if (response.status >= 200 && response.status < 300) {
      return response.data
    } else {
      throw new Error('Ministry Master : Data coud not be fetched : ', response.status)
    }
  }
  useEffect(() => {
    fetchData()
      .then((res) => {
        setAllMinistry(res)
        console.log(res)
      })
      .catch((e) => {
        console.log(e.message)
      })
  }, [])
return (
  <MainCard title="Update User">
  <Box sx={{ height : 400, width: '100%' }}>
    <DataGrid getRowId={(row) => row.ministryCode}
      
      rows={getAllMinistry}
      
      columns={columns}
      initialState={{
        pagination: {
          paginationModel: {
            pageSize: 5,
          },
        },
      }}
      pageSizeOptions={[5]}
      checkboxSelection
      disableRowSelectionOnClick
    />
  </Box>
  </MainCard>
);
}

export default UpdateMinistry