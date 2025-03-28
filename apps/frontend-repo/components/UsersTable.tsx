'use client'
import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

export default function UsersTable({rows}:{rows:any[]}) {
    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell align="right">Email</TableCell>
                        <TableCell align="right">Total Average Weight Ratings</TableCell>
                        <TableCell align="right">Number Of Rents</TableCell>
                        <TableCell align="right">Recently Active</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {Array.isArray(rows) && rows?.map((row) => (
                        <TableRow
                            key={row.id}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                {row?.name || '-'}
                            </TableCell>
                            <TableCell align="right">{row?.email || '-'}</TableCell>
                            <TableCell align="right">{row?.totalAverageWeightRatings || '-'}</TableCell>
                            <TableCell align="right">{row?.numberOfRents || '-'}</TableCell>
                            <TableCell align="right">{row?.recentlyActive ? new Date(row?.recentlyActive * 1000).toDateString() : '-'}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}