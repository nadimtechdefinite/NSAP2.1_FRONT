// material-ui
import { Link, Typography, Stack } from '@mui/material';

// ==============================|| FOOTER - AUTHENTICATION 2 & 3 ||============================== //

const AuthFooter = () => (
  <Stack direction="row" justifyContent="space-between">
    <div style={{textAlign:'center',marginLeft:'367px'}}>
    <Typography variant="subtitle2" component={Link} href="https://nsap.nic.in/" target="_blank" underline="hover">
    Site designed and developed by NIC. Contents provided and maintained by Ministry of Rural Development . <span>For any NSAP related issues contact NSAP Division, MoRD</span>
    </Typography>
    </div>
  </Stack>
);

export default AuthFooter;
