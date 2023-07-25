import { Table, TableHead, TableBody, TableRow, TableCell, Paper, TableContainer } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { setLocalItem, removeLocalItem } from '../../../utils/localStorage'
import './style.css'
import ClientIcon from '../../../assets/defaulters.svg'

export default function TableDefaulters({ defaulterClients }) {

    const navigate = useNavigate();

    function handlePage() {
        removeLocalItem('currentPage')
        setLocalItem('currentPage', 'inadimplente')
        navigate('/clientes')
    }

    return (
        <TableContainer className='container-table-defaulters' component={Paper}
            sx={{
                borderRadius: '20px',
                maxWidth: '556px'
            }}>
            <Table stickyHeader aria-label="sticky table">
                <TableHead>
                    <TableRow>
                        <TableCell align="center" colSpan={2}>
                            <div className='clients-icon'>
                                <img src={ClientIcon} alt="Ícone de clintes" /><h2>Clientes Inadimplentes</h2>
                            </div>
                        </TableCell>
                        <TableCell align="center" colSpan={3}>
                            <h3 className='defaultersTotals'>{defaulterClients.length}</h3>
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell><h4>Nome</h4></TableCell>
                        <TableCell><h4>Id.do clie.</h4></TableCell>
                        <TableCell><h4>CPF</h4></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody
                    sx={{
                        maxWidth: '556px'
                    }}>
                    {
                        defaulterClients.slice(0, 4).map(row => (
                            <TableRow key={row.id}>
                                <TableCell sx={{
                                    maxWidth: '108px',
                                    paddin: '5px',
                                    overflow: 'hidden',
                                    whiteSpace: 'nowrap',
                                    textOverflow: 'ellipsis',
                                    ":hover": {
                                        overflow: 'visible',
                                        whiteSpace: 'normal',
                                    }
                                }}>{row.nome}</TableCell>
                                <TableCell sx={{
                                    maxWidth: '108px',
                                    paddin: '5px',
                                    overflow: 'hidden',
                                    whiteSpace: 'nowrap',
                                    textOverflow: 'ellipsis',
                                    ":hover": {
                                        overflow: 'visible',
                                        whiteSpace: 'normal',
                                    }
                                }}
                                >{row.id}</TableCell>
                                <TableCell sx={{
                                    maxWidth: '108px',
                                    paddin: '5px',
                                    overflow: 'hidden',
                                    whiteSpace: 'nowrap',
                                    textOverflow: 'ellipsis',
                                    ":hover": {
                                        overflow: 'visible',
                                        whiteSpace: 'normal',
                                    }
                                }}
                                >{row.cpf}</TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
            <p onClick={() => handlePage()}>Ver todos</p>
        </TableContainer>
    )
}

