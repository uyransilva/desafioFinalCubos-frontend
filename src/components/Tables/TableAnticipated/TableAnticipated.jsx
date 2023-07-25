import { Table, TableHead, TableBody, TableRow, TableCell, Paper, TableContainer } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { setLocalItem, removeLocalItem } from '../../../utils/localStorage'
import { formatValue } from '../../../utils/format'
import './style.css'

export default function TableAnticipated({ pendingCharges }) {
    const navigate = useNavigate();

    function handlePage() {
        removeLocalItem('currentPage')
        setLocalItem('currentPage', 'pendentes')
        navigate('/charges')
    }

    return (
        <TableContainer className='container-table-anticipated' component={Paper}
            sx={{
                borderRadius: '20px',
                maxWidth: '360px'
            }}>
            <Table stickyHeader aria-label="sticky table">
                <TableHead>
                    <TableRow>
                        <TableCell align="center" colSpan={2}>
                            <h2>Cobranças Previstas</h2>
                        </TableCell>
                        <TableCell align="center" colSpan={3}>
                            <h3 className='anticipatedsTotals'>{pendingCharges.length}</h3>
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell><h4>Nome</h4></TableCell>
                        <TableCell><h4>Id.de cob.</h4></TableCell>
                        <TableCell><h4>Valor</h4></TableCell>
                    </TableRow>
                </TableHead>
                {pendingCharges.slice(0, 4).map(row => (
                    <TableBody key={row.id}
                        sx={{
                            maxWidth: '360px'
                        }}>
                        <TableRow >
                            <TableCell sx={{
                                maxWidth: '100px',
                                paddin: '5px',
                                overflow: 'hidden',
                                whiteSpace: 'nowrap',
                                textOverflow: 'ellipsis',
                                ":hover": {
                                    overflow: 'visible',
                                    whiteSpace: 'normal',
                                }
                            }}>{row.nome_cliente}</TableCell>
                            <TableCell>{row.id}</TableCell>
                            <TableCell
                                sx={{
                                    maxWidth: '100px',
                                    paddin: '5px',
                                    overflow: 'hidden',
                                    whiteSpace: 'nowrap',
                                    textOverflow: 'ellipsis',
                                    ":hover": {
                                        overflow: 'visible',
                                        whiteSpace: 'normal',
                                    }
                                }}>{formatValue(row.valor)}</TableCell>
                        </TableRow>
                    </TableBody>
                ))}
            </Table>
            <p onClick={() => handlePage()}> Ver todos</p>
        </TableContainer>
    )
}

