import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import addChargeIcon from '../../assets/addChargeIcon.svg'
import addIcon from '../../assets/addIcon.svg'
import customersIcon from '../../assets/clientesIcon.svg'
import filterIcon from '../../assets/filterIcon.svg'
import orderIcon from '../../assets/orderIcon.svg'
import searchIcon from '../../assets/searchIcon.svg'
import MagGlass from '../../assets/magnifyingGlass.svg'
import MagPerson from '../../assets/magnifyPerson.svg'
import { HeaderCustomer } from '../../components/HeaderCustomer'
import ModalRegisterCharges from '../../components/ModalRegisterCharges'
import ModalRegisterClient from '../../components/ModalRegisterClient/index'
import ModalEditClient from '../../components/ModalEditClient'
import { SideNavBar } from '../../components/SideNavBar'
import api from '../../services/api'
import { formatName } from '../../utils/format'
import { clearLocalItem, getLocalItem, setLocalItem } from '../../utils/localStorage'
import { toastError } from '../../utils/toast'
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import './styles.css'

export function Customers() {

    const [openRegister, setOpenRegister] = useState(false)
    const [openModalCharges, setOpenModalCharges] = useState(false)
    const [customersData, setCustomersData] = useState([])
    const [orderedCustomers, setOrderedCustomers] = useState([]);
    const [nameClientCharge, setNameClientCharge] = useState(null)
    const navigate = useNavigate();
    const [asc, setAsc] = useState(true);
    const [clientDataEdit, setClientDataEdit] = useState({})
    const [customerFilter, setCustomerFilter] = useState('')
    const [addCharges, setAddCharges] = useState({})
    const [getApi, setGetApi] = useState(false)
    const token = getLocalItem('token')
    const clients = getLocalItem('currentPage')
    const headers = {
        Authorization: `Bearer ${token}`
    }

    let customers = []

    if (clients == 'inadimplente') {
        const response = customersData.filter((item) => {
            return item.counterstatus != 0
        })
        customers = response
    } else if (clients == 'emDia') {
        const response = customersData.filter((item) => {
            return item.counterstatus == 0
        })
        customers = response
    } else {
        customers = customersData
    }

    function openModalRegister() {
        setOpenRegister(true)

    }

    function closeModalRegister() {
        setOpenRegister(false)
    }

    function handleChangeAddCharge(item) {
        setOpenModalCharges(true)
        setAddCharges(item)
        setNameClientCharge(item.nome)
    }
    function handleCustomerData(item) {
        setClientDataEdit(item)
        setLocalItem('ClientData', JSON.stringify(item))
    }

    async function getAllClients() {
        try {
            const response = await api.get('/clients', { headers })
            setCustomersData(response.data)
            setGetApi(true)
        } catch (error) {
            console.log(error.response.data)
            toastError(error.response.data.mensagem)
            if (error.response.data.mensagem == 'Não autorizado') {
                clearLocalItem();
                navigate('/login')
            }
            return
        }
    }

    useEffect(() => {
        getAllClients();
        const localCustomers = [...customers];
        if (asc) {
            localCustomers.sort(function (a, b) {
                if (a.nome < b.nome) {
                    return -1;
                }
                if (a.nome > b.nome) {
                    return 1;
                }
                return 0;
            })
            setOrderedCustomers([...localCustomers])

        }
        if (!asc) {
            localCustomers.sort(function (a, b) {
                if (b.nome < a.nome) {
                    return -1;
                }
                if (b.nome > a.nome) {
                    return 1;
                }
                return 0;
            })
            setOrderedCustomers([...localCustomers])
        }
    }, [asc, customers])

    const filteredCustomer = orderedCustomers.filter((item) => {
        return item.nome.toLowerCase().startsWith(customerFilter) || item.email.toLowerCase().includes(customerFilter) || String(item.cpf).includes(customerFilter)
    })


    return (

        <div className='container-customers'>
            <SideNavBar activePage='customers' />
            <div className='container-section-header'>
                <HeaderCustomer page='customers' />
                <div className='container-header-customers'>
                    <div className='title-customers font-nunito'>
                        <img src={customersIcon} />
                        <h1>Clientes</h1>
                    </div>

                    <div className='container-add'>
                        <div onClick={() => openModalRegister()} className='add-customers font-nunito display-justify-align-center'>
                            <img src={addIcon} />
                            <span className='' >Adicionar Cliente</span>
                        </div>
                        <div className='filter-customers'>
                            <img src={filterIcon} />
                        </div>

                        <div className='search-customers font-nunito'>
                            <input
                                className='inputFilter'
                                type='text'
                                placeholder='Pesquisa'
                                onChange={(e) => setCustomerFilter(e.target.value)} />
                            <img src={searchIcon} />
                        </div>
                    </div>
                </div>
                {filteredCustomer.length > 0 &&
                    <div className='container-table-customers font-nunito display-justify-align-center'>
                        <table>
                            <thead>
                                <tr>
                                    <th
                                        className={(!customerFilter) ? 'order-customers  ' : 'order-customers orderFix '}
                                        onClick={() => setAsc(!asc)}
                                    >
                                        <img src={orderIcon} />
                                        <p>Cliente</p>
                                    </th>
                                    <th>CPF</th>
                                    <th>E-mail</th>
                                    <th>Telefone</th>
                                    <th className='statusFix'>Status</th>
                                    <th className='textCenter'>Criar Cobrança</th>
                                </tr>
                            </thead>
                            {customerFilter && filteredCustomer.map((item) => (
                                < tbody key={item.id} >
                                    <tr>
                                        <Link to='/details' >
                                            <td className='tableRowNameFilter' onClick={() => handleCustomerData(item)}>{formatName(item.nome)}</td>
                                        </Link>
                                        <td>{item.cpf}</td>
                                        <td>{item.email}</td>
                                        <td>{item.telefone}</td>
                                        <td>
                                            <div className={item.counterstatus == 0 ? 'status-client-ok-customers display-justify-align-center' : 'status-client-defaulter-customers display-justify-align-center'}>
                                                {item.counterstatus == 0 ? 'Em dia' : 'Inadimplente'}
                                            </div>
                                        </td>
                                        <td>
                                            <div onClick={() => handleChangeAddCharge(item)} className='addCharge-customers display-justify-align-center'>
                                                <img src={addChargeIcon} />
                                                Cobrança
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            ))
                            }
                            {!customerFilter && orderedCustomers.map((item) => (
                                < tbody key={item.id} >
                                    <tr>
                                        <Link to='/details'>
                                            <td className='tableRowName' onClick={() => handleCustomerData(item)}>{formatName(item.nome)}</td>
                                        </Link>
                                        <td>{item.cpf}</td>
                                        <td>{item.email}</td>
                                        <td>{item.telefone}</td>
                                        <td>
                                            <div className={item.counterstatus == 0 ? 'status-client-ok-customers display-justify-align-center' : 'status-client-defaulter-customers display-justify-align-center'}>
                                                {item.counterstatus == 0 ? 'Em dia' : 'Inadimplente'}
                                            </div>
                                        </td>
                                        <td>
                                            <div onClick={() => handleChangeAddCharge(item)} className='addCharge-customers display-justify-align-center'>
                                                <img src={addChargeIcon} />
                                                Cobrança
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>

                            ))
                            }

                        </table>
                    </div>
                }

                {filteredCustomer.length === 0 && getApi === true &&
                    <div className='emptyTable'>
                        <img className='magPerson' src={MagPerson}></img>
                        <img className='magGlass' src={MagGlass}></img>
                        <h1 className='emptyOrangeText'>Nenhum resultado foi encontrado!</h1>
                        <h1 className='emptyGreyText'>Verifique se escrita está correta</h1>
                    </div>
                }
                {getApi === false &&
                    <div className="backdrop">
                        <div className='progressCircle'>
                            <Stack sx={{ color: '#e91e63' }} direction="row" >
                                <CircularProgress color="inherit" />
                            </Stack>
                        </div>
                    </div>
                }
            </div>
            {openModalCharges && <ModalRegisterCharges nameClientCharge={nameClientCharge} addCharges={addCharges} setOpenModalCharges={setOpenModalCharges} />}
            <ModalRegisterClient getAllClients={getAllClients} openModalRegister={openModalRegister} closeModalRegister={closeModalRegister} openRegister={openRegister} setOpenRegister={setOpenRegister} />
        </div >

    )
}

