import React from 'react';
import MainCard from 'ui-component/cards/MainCard';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Divider } from '@mui/material';
import ArrowBack from '@mui/icons-material/ArrowBack';
const useStyles = makeStyles({
  tableContainer: {
    borderRadius: '1px', // Adjust the border-radius value as needed
    overflow: 'hidden' // Ensure overflow is hidden to prevent content from overflowing the rounded corners
  },

  table: {
    minWidth: 650,
    borderCollapse: 'collapse'
  },
  tableHeaderCell: {
    border: '1px solid black',
    padding: '8px'
  },
  tableRow: {
    '& > *': {
      border: '1px solid black',
      padding: '8px'
    }
  },
  oddRow: {
    backgroundColor: 'rgba(0, 0, 0, 0.04)'
  },
  evenRow: {
    backgroundColor: 'white'
  }
});
const MonthlyProgressDataReport = ({ formData, dataReport, setMonthClicked }) => {
  const classes = useStyles();
  const backButton = () => {
    setMonthClicked(false);
  };
  return (
    <>
      <div style={{ marginTop: '20px' }}>
        <MainCard>
          <Typography variant="h4">
            MONTHLY PROGRESS REPORT ({formData.reportTypeCode === 1 ? 'National Level' : 'State Level'})
            {formData.reportTypeCode === 1 && (
              <Button
                size="small"
                variant="contained"
                color="primary"
                style={{ float: 'right' }}
                onClick={backButton}
                startIcon={<ArrowBack />}
              >
                Back
              </Button>
            )}
          </Typography>
          <Divider style={{ marginTop: '30px' }} />
          <TableContainer component={Paper} className={classes.tableContainer}>
            <Table className={classes.table} aria-label="simple table">
              <TableHead className={classes.tableHeaderCell}>
                <TableRow className={classes.tableHeaderCell}>
                  <TableCell className={classes.tableHeaderCell}>MPR For {dataReport.stateName}</TableCell>
                  <TableCell className={classes.tableHeaderCell} colSpan={7}>
                    Year : {dataReport.year} | Month : {dataReport.monthCode}
                  </TableCell>
                </TableRow>
                <TableRow className={classes.tableHeaderCell}>
                  <TableCell className={classes.tableHeaderCell}>
                    Opening 1. Opening Balance of Centrally Sponsored Scheme(CSS) under NSAP as on 1st April {dataReport.year}:
                  </TableCell>
                  <TableCell className={classes.tableHeaderCell} colSpan={7}>
                    {dataReport.openingBalance}
                  </TableCell>
                </TableRow>

                <TableRow className={classes.tableHeaderCell}>
                  <TableCell className={classes.tableHeaderCell}>2. CSS released for NSAP upto month of reporting(in lakh) :</TableCell>
                  <TableCell className={classes.tableHeaderCell} colSpan={7}>
                    {dataReport.cssReleaseBal}
                  </TableCell>
                </TableRow>

                <TableRow className={classes.tableHeaderCell}>
                  <TableCell className={classes.tableHeaderCell}>3. Total available funds NSAP(1+2)(in lakh) :</TableCell>
                  <TableCell className={classes.tableHeaderCell} colSpan={7}></TableCell>
                </TableRow>

                <TableRow className={classes.tableHeaderCell}>
                  <TableCell className={classes.tableHeaderCell}>4. Expenditure for NSAP upto the month of reporting(in lakh) :</TableCell>
                  <TableCell className={classes.tableHeaderCell} colSpan={7}>
                    {dataReport.expUptoMonth}
                  </TableCell>
                </TableRow>

                <TableRow className={classes.tableHeaderCell}>
                  <TableCell className={classes.tableHeaderCell}>
                    5. Closing balance at the end of month of reporting (3-4)(in lakh) <span style={{ color: 'red' }}>(-/+)</span>:
                  </TableCell>
                  <TableCell className={classes.tableHeaderCell} colSpan={7}></TableCell>
                </TableRow>
              </TableHead>
              <br></br>
              <TableHead style={{ marginTop: '20px' }}>
                <TableRow className={classes.tableHeaderCell}>
                  <TableCell className={classes.tableHeaderCell}>ITEM</TableCell>
                  <TableCell className={classes.tableHeaderCell}>IGNOAPS</TableCell>
                  <TableCell className={classes.tableHeaderCell}>IGNWPS</TableCell>
                  <TableCell className={classes.tableHeaderCell}>IGNDPS</TableCell>
                  <TableCell className={classes.tableHeaderCell}>NFBS</TableCell>
                  <TableCell className={classes.tableHeaderCell}>ANNAPURNA</TableCell>
                  <TableCell className={classes.tableHeaderCell}></TableCell>
                </TableRow>
              </TableHead>
              <TableBody className={classes.tableHeaderCell}>
                <TableRow>
                  <TableCell className={classes.tableHeaderCell}>1. Physical Coverage (in numbers)</TableCell>
                  <TableCell className={classes.tableHeaderCell}>{dataReport.phyCoverageIGNOAPS}</TableCell>
                  <TableCell className={classes.tableHeaderCell}>{dataReport.phyCoverageIGNWPS}</TableCell>
                  <TableCell className={classes.tableHeaderCell}>{dataReport.phyCoverageIGNDPS}</TableCell>
                  <TableCell className={classes.tableHeaderCell}>{dataReport.phyCoverageNFBS}</TableCell>
                  <TableCell className={classes.tableHeaderCell}>{dataReport.phyCoverageANNA}</TableCell>
                  <TableCell className={classes.tableHeaderCell}></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className={classes.tableHeaderCell} colSpan={7} style={{ fontWeight: 'bold' }}>
                    2. Expenditure Monthly Cumulator
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className={classes.tableHeaderCell}>(a) Expenditure of Month(rupees in lakh)</TableCell>
                  <TableCell className={classes.tableHeaderCell}>{dataReport.monthlyExpIGNOAPS}</TableCell>
                  <TableCell className={classes.tableHeaderCell}>{dataReport.monthlyExpIGNWPS}</TableCell>
                  <TableCell className={classes.tableHeaderCell}>{dataReport.monthlyExpIGNDPS}</TableCell>
                  <TableCell className={classes.tableHeaderCell}>{dataReport.monthlyExpNFBS}</TableCell>
                  <TableCell className={classes.tableHeaderCell}>{dataReport.monthlyExpANNA}</TableCell>
                  <TableCell className={classes.tableHeaderCell}></TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className={classes.tableHeaderCell}>b. Cumulative funds utilised (in lakh)</TableCell>
                  <TableCell className={classes.tableHeaderCell}>{dataReport.comulativeIGNOAPS}</TableCell>
                  <TableCell className={classes.tableHeaderCell}>{dataReport.comulativeIGNWPS}</TableCell>
                  <TableCell className={classes.tableHeaderCell}>{dataReport.comulativeIGNDPS}</TableCell>
                  <TableCell className={classes.tableHeaderCell}>{dataReport.comulativeNFBS}</TableCell>
                  <TableCell className={classes.tableHeaderCell}>{dataReport.comulativeANNA}</TableCell>
                  <TableCell className={classes.tableHeaderCell}></TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className={classes.tableHeaderCell} colSpan={7} style={{ fontWeight: 'bold' }}>
                    3. Reported/Covered no. of beneficiaries
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className={classes.tableHeaderCell}>(a) Female</TableCell>
                  <TableCell className={classes.tableHeaderCell}>{dataReport.femaleIGNOAPS}</TableCell>
                  <TableCell className={classes.tableHeaderCell}>{dataReport.femaleIGNWPS}</TableCell>
                  <TableCell className={classes.tableHeaderCell}>{dataReport.femaleIGNDPS}</TableCell>
                  <TableCell className={classes.tableHeaderCell}>{dataReport.femaleNFBS}</TableCell>
                  <TableCell className={classes.tableHeaderCell}>{dataReport.femaleANNA}</TableCell>
                  <TableCell className={classes.tableHeaderCell}></TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className={classes.tableHeaderCell}>(b) Male</TableCell>
                  <TableCell className={classes.tableHeaderCell}>{dataReport.maleIGNOAPS}</TableCell>
                  <TableCell className={classes.tableHeaderCell}>{dataReport.maleIGNWPS}</TableCell>
                  <TableCell className={classes.tableHeaderCell}>{dataReport.maleIGNDPS}</TableCell>
                  <TableCell className={classes.tableHeaderCell}>{dataReport.maleNFBS}</TableCell>
                  <TableCell className={classes.tableHeaderCell}>{dataReport.maleANNA}</TableCell>
                  <TableCell className={classes.tableHeaderCell}></TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className={classes.tableHeaderCell}>(c) Trans Gender</TableCell>
                  <TableCell className={classes.tableHeaderCell}>{dataReport.transIGNOAPS}</TableCell>
                  <TableCell className={classes.tableHeaderCell}>{dataReport.transIGNWPS}</TableCell>
                  <TableCell className={classes.tableHeaderCell}>{dataReport.transIGNDPS}</TableCell>
                  <TableCell className={classes.tableHeaderCell}>{dataReport.transNFBS}</TableCell>
                  <TableCell className={classes.tableHeaderCell}>{dataReport.transANNA}</TableCell>
                  <TableCell className={classes.tableHeaderCell}></TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className={classes.tableHeaderCell}>Total</TableCell>
                  <TableCell className={classes.tableHeaderCell}></TableCell>
                  <TableCell className={classes.tableHeaderCell}></TableCell>
                  <TableCell className={classes.tableHeaderCell}></TableCell>
                  <TableCell className={classes.tableHeaderCell}></TableCell>
                  <TableCell className={classes.tableHeaderCell}></TableCell>
                  <TableCell className={classes.tableHeaderCell}></TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className={classes.tableHeaderCell} colSpan={7} style={{ fontWeight: 'bold' }}>
                    4. Beneficiaries opted disbursement mode(in numbers)
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className={classes.tableHeaderCell} colSpan={7}>
                    a. Bank Account
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className={classes.tableHeaderCell}>(1) ABP</TableCell>
                  <TableCell className={classes.tableHeaderCell}>{dataReport.apbIGNOAPS}</TableCell>
                  <TableCell className={classes.tableHeaderCell}>{dataReport.apbIGNWPS}</TableCell>
                  <TableCell className={classes.tableHeaderCell}>{dataReport.apbIGNDPS}</TableCell>
                  <TableCell className={classes.tableHeaderCell}>{dataReport.apbNFBS}</TableCell>
                  <TableCell className={classes.tableHeaderCell}>{dataReport.apbANNA}</TableCell>
                  <TableCell className={classes.tableHeaderCell}></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className={classes.tableHeaderCell}>(2) NEFT</TableCell>
                  <TableCell className={classes.tableHeaderCell}>{dataReport.neftIGNOAPS}</TableCell>
                  <TableCell className={classes.tableHeaderCell}>{dataReport.neftIGNWPS}</TableCell>
                  <TableCell className={classes.tableHeaderCell}>{dataReport.neftIGNDPS}</TableCell>
                  <TableCell className={classes.tableHeaderCell}>{dataReport.neftNFBS}</TableCell>
                  <TableCell className={classes.tableHeaderCell}>{dataReport.neftANNA}</TableCell>
                  <TableCell className={classes.tableHeaderCell}></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className={classes.tableHeaderCell}>Total</TableCell>
                  <TableCell className={classes.tableHeaderCell}></TableCell>
                  <TableCell className={classes.tableHeaderCell}></TableCell>
                  <TableCell className={classes.tableHeaderCell}></TableCell>
                  <TableCell className={classes.tableHeaderCell}></TableCell>
                  <TableCell className={classes.tableHeaderCell}></TableCell>
                  <TableCell className={classes.tableHeaderCell}></TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className={classes.tableHeaderCell}>b. Post Office Account</TableCell>
                  <TableCell className={classes.tableHeaderCell}>{dataReport.poIGNOAPS}</TableCell>
                  <TableCell className={classes.tableHeaderCell}>{dataReport.poIGNWPS}</TableCell>
                  <TableCell className={classes.tableHeaderCell}>{dataReport.poIGNDPS}</TableCell>
                  <TableCell className={classes.tableHeaderCell}>{dataReport.poNFBS}</TableCell>
                  <TableCell className={classes.tableHeaderCell}>{dataReport.poANNA}</TableCell>
                  <TableCell className={classes.tableHeaderCell}></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className={classes.tableHeaderCell}>c. Cash</TableCell>
                  <TableCell className={classes.tableHeaderCell}>{dataReport.cashIGNOAPS}</TableCell>
                  <TableCell className={classes.tableHeaderCell}>{dataReport.cashIGNWPS}</TableCell>
                  <TableCell className={classes.tableHeaderCell}>{dataReport.cashIGNDPS}</TableCell>
                  <TableCell className={classes.tableHeaderCell}>{dataReport.cashNFBS}</TableCell>
                  <TableCell className={classes.tableHeaderCell}>{dataReport.cashANNA}</TableCell>
                  <TableCell className={classes.tableHeaderCell}></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className={classes.tableHeaderCell}>d. Money Order</TableCell>
                  <TableCell className={classes.tableHeaderCell}>{dataReport.moIGNOAPS}</TableCell>
                  <TableCell className={classes.tableHeaderCell}>{dataReport.moIGNWPS}</TableCell>
                  <TableCell className={classes.tableHeaderCell}>{dataReport.moIGNDPS}</TableCell>
                  <TableCell className={classes.tableHeaderCell}>{dataReport.moNFBS}</TableCell>
                  <TableCell className={classes.tableHeaderCell}>{dataReport.moANNA}</TableCell>
                  <TableCell className={classes.tableHeaderCell}></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className={classes.tableHeaderCell}>Grand Total</TableCell>
                  <TableCell className={classes.tableHeaderCell}></TableCell>
                  <TableCell className={classes.tableHeaderCell}></TableCell>
                  <TableCell className={classes.tableHeaderCell}></TableCell>
                  <TableCell className={classes.tableHeaderCell}></TableCell>
                  <TableCell className={classes.tableHeaderCell}></TableCell>
                  <TableCell className={classes.tableHeaderCell}></TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className={classes.tableHeaderCell} style={{ fontWeight: 'bold' }}>
                    5. Disbursement Details
                  </TableCell>
                  <TableCell className={classes.tableHeaderCell} style={{ fontWeight: 'bold' }}>
                    APB
                  </TableCell>
                  <TableCell className={classes.tableHeaderCell} style={{ fontWeight: 'bold' }}>
                    NEFT
                  </TableCell>
                  <TableCell className={classes.tableHeaderCell} style={{ fontWeight: 'bold' }}>
                    PO
                  </TableCell>
                  <TableCell className={classes.tableHeaderCell} style={{ fontWeight: 'bold' }}>
                    MO
                  </TableCell>
                  <TableCell className={classes.tableHeaderCell} style={{ fontWeight: 'bold' }}>
                    CASH
                  </TableCell>
                  <TableCell className={classes.tableHeaderCell} style={{ fontWeight: 'bold' }}>
                    Total
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className={classes.tableHeaderCell} colSpan={7}>
                    (a) IGNOAPS
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className={classes.tableHeaderCell}>(i.) No. of Transactions for the month</TableCell>
                  <TableCell className={classes.tableHeaderCell}>{dataReport.noOfTransIgnoapsAPB}</TableCell>
                  <TableCell className={classes.tableHeaderCell}>{dataReport.noOfTransIgnoapsNEFT}</TableCell>
                  <TableCell className={classes.tableHeaderCell}>{dataReport.noOfTransIgnoapsPO}</TableCell>
                  <TableCell className={classes.tableHeaderCell}>{dataReport.noOfTransIgnoapsMo}</TableCell>
                  <TableCell className={classes.tableHeaderCell}>{dataReport.noOfTransIgnoapsCASH}</TableCell>
                  <TableCell className={classes.tableHeaderCell}></TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className={classes.tableHeaderCell}>(ii.) Cumulative no. of transactions</TableCell>
                  <TableCell className={classes.tableHeaderCell}>{dataReport.transComulIgnoapsAPB}</TableCell>
                  <TableCell className={classes.tableHeaderCell}>{dataReport.transComulIgnoapsNEFT}</TableCell>
                  <TableCell className={classes.tableHeaderCell}>{dataReport.transComulIgnoapsPO}</TableCell>
                  <TableCell className={classes.tableHeaderCell}>{dataReport.transComulIgnoapsMo}</TableCell>
                  <TableCell className={classes.tableHeaderCell}>{dataReport.transComulIgnoapsCASH}</TableCell>
                  <TableCell className={classes.tableHeaderCell}></TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className={classes.tableHeaderCell} colSpan={7}>
                    (a1) Amount(rupees in lakh)
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className={classes.tableHeaderCell}>(i.) Monthly(Rs.) </TableCell>
                  <TableCell className={classes.tableHeaderCell}>{dataReport.monthlyAmtIgnoapsAPB}</TableCell>
                  <TableCell className={classes.tableHeaderCell}>{dataReport.monthlyAmtIgnoapsNEFT}</TableCell>
                  <TableCell className={classes.tableHeaderCell}>{dataReport.monthlyAmtIgnoapsPO}</TableCell>
                  <TableCell className={classes.tableHeaderCell}>{dataReport.monthlyAmtIgnoapsMo}</TableCell>
                  <TableCell className={classes.tableHeaderCell}>{dataReport.monthlyAmtIgnoapsCASH}</TableCell>
                  <TableCell className={classes.tableHeaderCell}></TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className={classes.tableHeaderCell}>(ii.) Cumulative(Amt.) </TableCell>
                  <TableCell className={classes.tableHeaderCell}>{dataReport.monthlyAmtComulIgnoapsAPB}</TableCell>
                  <TableCell className={classes.tableHeaderCell}>{dataReport.monthlyAmtComulIgnoapsNEFT}</TableCell>
                  <TableCell className={classes.tableHeaderCell}>{dataReport.monthlyAmtComulIgnoapsPO}</TableCell>
                  <TableCell className={classes.tableHeaderCell}>{dataReport.monthlyAmtComulIgnoapsMo}</TableCell>
                  <TableCell className={classes.tableHeaderCell}>{dataReport.monthlyAmtComulIgnoapsCASH}</TableCell>
                  <TableCell className={classes.tableHeaderCell}></TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className={classes.tableHeaderCell} colSpan={7}>
                    (b) IGNWPS
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className={classes.tableHeaderCell}>(i.) No. of Transactions for the month </TableCell>
                  <TableCell className={classes.tableHeaderCell}>{dataReport.noOfTransIgnwpsAPB}</TableCell>
                  <TableCell className={classes.tableHeaderCell}>{dataReport.noOfTransIgnwpsNEFT}</TableCell>
                  <TableCell className={classes.tableHeaderCell}>{dataReport.noOfTransIgnwpsPO}</TableCell>
                  <TableCell className={classes.tableHeaderCell}>{dataReport.noOfTransIgnwpsMo}</TableCell>
                  <TableCell className={classes.tableHeaderCell}>{dataReport.noOfTransIgnwpsCASH}</TableCell>
                  <TableCell className={classes.tableHeaderCell}></TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className={classes.tableHeaderCell}>(ii.) Cumulative no. of transactions </TableCell>
                  <TableCell className={classes.tableHeaderCell}>{dataReport.transComulIgnwpsAPB}</TableCell>
                  <TableCell className={classes.tableHeaderCell}>{dataReport.transComulIgnwpsNEFT}</TableCell>
                  <TableCell className={classes.tableHeaderCell}>{dataReport.transComulIgnwpsPO}</TableCell>
                  <TableCell className={classes.tableHeaderCell}>{dataReport.transComulIgnwpsMo}</TableCell>
                  <TableCell className={classes.tableHeaderCell}>{dataReport.transComulIgnwpsCASH}</TableCell>
                  <TableCell className={classes.tableHeaderCell}></TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className={classes.tableHeaderCell} colSpan={7}>
                    (b1) Amount(rupees in lakh)
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className={classes.tableHeaderCell}>(i.) Monthly(Rs.) </TableCell>
                  <TableCell className={classes.tableHeaderCell}>{dataReport.monthlyAmtIgnwpsAPB}</TableCell>
                  <TableCell className={classes.tableHeaderCell}>{dataReport.monthlyAmtIgnwpsNEFT}</TableCell>
                  <TableCell className={classes.tableHeaderCell}>{dataReport.monthlyAmtIgnwpsPO}</TableCell>
                  <TableCell className={classes.tableHeaderCell}>{dataReport.monthlyAmtIgnwpsMo}</TableCell>
                  <TableCell className={classes.tableHeaderCell}>{dataReport.monthlyAmtIgnwpsCASH}</TableCell>
                  <TableCell className={classes.tableHeaderCell}></TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className={classes.tableHeaderCell}>(ii.) Cumulative(Amt.) </TableCell>
                  <TableCell className={classes.tableHeaderCell}>{dataReport.monthlyAmtComulIgnwpsAPB}</TableCell>
                  <TableCell className={classes.tableHeaderCell}>{dataReport.monthlyAmtComulIgnwpsNEFT}</TableCell>
                  <TableCell className={classes.tableHeaderCell}>{dataReport.monthlyAmtComulIgnwpsPO}</TableCell>
                  <TableCell className={classes.tableHeaderCell}>{dataReport.monthlyAmtComulIgnwpsMo}</TableCell>
                  <TableCell className={classes.tableHeaderCell}>{dataReport.monthlyAmtComulIgnwpsCASH}</TableCell>
                  <TableCell className={classes.tableHeaderCell}></TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className={classes.tableHeaderCell} colSpan={7}>
                    (c) IGNDPS
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className={classes.tableHeaderCell}>(i.) No. of Transactions for the month </TableCell>
                  <TableCell className={classes.tableHeaderCell}>{dataReport.noOfTransIgndpsAPB}</TableCell>
                  <TableCell className={classes.tableHeaderCell}>{dataReport.noOfTransIgndpsNEFT}</TableCell>
                  <TableCell className={classes.tableHeaderCell}>{dataReport.noOfTransIgndpsPO}</TableCell>
                  <TableCell className={classes.tableHeaderCell}>{dataReport.noOfTransIgndpsMo}</TableCell>
                  <TableCell className={classes.tableHeaderCell}>{dataReport.noOfTransIgndpsCASH}</TableCell>
                  <TableCell className={classes.tableHeaderCell}></TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className={classes.tableHeaderCell}>(ii.) Cumulative no. of transactions </TableCell>
                  <TableCell className={classes.tableHeaderCell}>{dataReport.transComulIgndpsAPB}</TableCell>
                  <TableCell className={classes.tableHeaderCell}>{dataReport.transComulIgndpsNEFT}</TableCell>
                  <TableCell className={classes.tableHeaderCell}>{dataReport.transComulIgndpsPO}</TableCell>
                  <TableCell className={classes.tableHeaderCell}>{dataReport.transComulIgndpsMo}</TableCell>
                  <TableCell className={classes.tableHeaderCell}>{dataReport.transComulIgndpsCASH}</TableCell>
                  <TableCell className={classes.tableHeaderCell}></TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className={classes.tableHeaderCell} colSpan={7}>
                    (c1) Amount(rupees in lakh)
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className={classes.tableHeaderCell}>(i.) Monthly(Rs.) </TableCell>
                  <TableCell className={classes.tableHeaderCell}>{dataReport.monthlyAmtIgndpsAPB}</TableCell>
                  <TableCell className={classes.tableHeaderCell}>{dataReport.monthlyAmtIgndpsNEFT}</TableCell>
                  <TableCell className={classes.tableHeaderCell}>{dataReport.monthlyAmtIgndpsPO}</TableCell>
                  <TableCell className={classes.tableHeaderCell}>{dataReport.monthlyAmtIgndpsMo}</TableCell>
                  <TableCell className={classes.tableHeaderCell}>{dataReport.monthlyAmtIgndpsCASH}</TableCell>
                  <TableCell className={classes.tableHeaderCell}></TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className={classes.tableHeaderCell}>(ii.) Cumulative(Amt.) </TableCell>
                  <TableCell className={classes.tableHeaderCell}>{dataReport.monthlyAmtComulIgndpsAPB}</TableCell>
                  <TableCell className={classes.tableHeaderCell}>{dataReport.monthlyAmtComulIgndpsNEFT}</TableCell>
                  <TableCell className={classes.tableHeaderCell}>{dataReport.monthlyAmtComulIgndpsPO}</TableCell>
                  <TableCell className={classes.tableHeaderCell}>{dataReport.monthlyAmtComulIgndpsMo}</TableCell>
                  <TableCell className={classes.tableHeaderCell}>{dataReport.monthlyAmtComulIgndpsCASH}</TableCell>
                  <TableCell className={classes.tableHeaderCell}></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </MainCard>
      </div>
    </>
  );
};

export default MonthlyProgressDataReport;
