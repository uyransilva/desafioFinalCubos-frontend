import { Table, TableHead, TableBody, TableRow, TableCell, Paper, TableContainer, TableFooter } from '@mui/material'
import './style.css'
import { setLocalItem, removeLocalItem } from '../../../utils/localStorage'
import { useNavigate } from 'react-router-dom'
import ClientIcon from '../../../assets/corrects.svg'

export default function TablesCorrects({ upToDateCustomers }) {

    const navigate = useNavigate();

    function handlePage() {
        removeLocalItem('currentPage')
        setLocalItem('currentPage', 'emDia')
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
                                <img src={ClientIcon} alt="Ícone de clientes" /><h2>Clientes em dia</h2>
                            </div>
                        </TableCell>
                        <TableCell align="center" colSpan={20}>
                            <h3 className='correctsTotals'>{upToDateCustomers.length}</h3>
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
                        upToDateCustomers.slice(0, 4).map(row => (
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
                                <TableCell
                                    sx={{
                                        maxWidth: '108px',
                                        paddin: '5px',
                                        overflow: 'hidden',
                                        whiteSpace: 'nowrap',
                                        textOverflow: 'ellipsis',
                                        ":hover": {
                                            overflow: 'visible',
                                            whiteSpace: 'normal',
                                        }
                                    }}>{row.cpf}</TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
            <p onClick={() => handlePage()}> Ver todos</p>
        </TableContainer>
    )
}

