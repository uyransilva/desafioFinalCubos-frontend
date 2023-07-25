import { HeaderCustomer } from "../../components/HeaderCustomer";
import { SideNavBar } from "../../components/SideNavBar";
import api from '../../services/api';
import searchIcon from '../../assets/searchIcon.svg';
import filterIcon from '../../assets/filterIcon.svg';
import orderIcon from '../../assets/orderIcon.svg';
import editIcon from "../../assets/editIcon.svg";
import MagGlass from '../../assets/magnifyingGlass.svg'
import MagPerson from '../../assets/magnifyPerson.svg'
import ModalEditCharges from "../../components/ModalEditCharges";
import ModalDeleteCharges from "../../components/ModalDeleteCharges";
import ModalDetailCharges from "../../components/ModalDetailCharges";
import paperCharges from '../../assets/paperCharges.svg'
import deleteIcon from '../../assets/deleteIcon.svg'
import './styles.css';
import { useState, useEffect } from "react";
import { formatDate, formatValue } from '../../utils/format'
import { clearLocalItem, getLocalItem, setLocalItem } from "../../utils/localStorage";
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';

export function Charges() {
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [openModalDetail, setOpenModalDetail] = useState(false);
    const [customerFilter, setCustomerFilter] = useState('')
    const [chargesData, seChargesData] = useState([]);
    const [order, setOrder] = useState('DSC');
    const [orderId, setOrderId] = useState('DSC');
    const [getApi, setGetApi] = useState(false)
    const token = getLocalItem('token');
    const clients = getLocalItem('currentPage')
    const headers = {
        Authorization: `Bearer ${token}`
    };

    let charges = []

    if (clients == 'pagas') {
        const response = chargesData.filter((item) => {
            return item.status == 'pago'
        })
        charges = response
    } else if (clients == 'vencidas') {
        const response = chargesData.filter((item) => {
            return item.status == 'vencida'
        })
        charges = response
    } else if (clients == 'pendentes') {
        const response = chargesData.filter((item) => {
            return item.status == 'pendente'
        })
        charges = response
    } else if (!clients) {
        charges = chargesData
    }

    function handleChangeEditCharges(item) {
        setLocalItem('ChargesData', JSON.stringify(item))
        setOpenEditModal(true)
    }

    function handleChangeDeleteCharges(item) {
        setLocalItem('ChargesDelete', JSON.stringify(item))
        setOpenDeleteModal(true)
    }

    function handleDetailCharges(item) {
        setLocalItem('ChargesDetail', JSON.stringify(item))
        setOpenModalDetail(true)
    }

    const handleSort = () => {
        const localCharges = [...chargesData];
        if (order === "ASC") {
            localCharges.sort((a, b) => {
                return b.nome_cliente > a.nome_cliente ? 1 : -1;
            })
            setOrder("DSC");
            seChargesData(localCharges);
        }
        if (order === "DSC") {
            localCharges.sort((a, b) => {
                return a.nome_cliente.toLowerCase() > b.nome_cliente.toLowerCase() ? 1 : -1;
            })
            setOrder("ASC");
            seChargesData(localCharges);
        }
    }

    const handleSortId = () => {
        const localCharges = [...chargesData];
        if (orderId === "ASC") {
            localCharges.sort((a, b) => {
                return b.id > a.id ? 1 : -1;
            })
            setOrderId("DSC");
            seChargesData(localCharges);
        }
        if (orderId === "DSC") {
            localCharges.sort((a, b) => {
                return a.id > b.id ? 1 : -1;
            })
            setOrderId("ASC");
            seChargesData(localCharges);
        }
    }

    async function getAllCharges() {
        try {
            const response = await api.get('/charges', { headers })
            seChargesData(response.data)
            setGetApi(true)
        } catch (error) {
            toastError(error.response.data.mensagem)
            if (error.response.data.mensagem == 'Não autorizado') {
                clearLocalItem();
                navigate('/login')
            }
            return
        }
    }

    useEffect(() => {
        getAllCharges();
    }, []);

    const filterCharges = charges.filter((item) => {
        return item.nome_cliente.toLowerCase().startsWith(customerFilter) || String(item.id).includes(String(customerFilter))
    })

    return (
        <div className='container-charges'>
            <SideNavBar activePage='charges' />

            <div className='container-section-header-charges'>
                <HeaderCustomer page='charges' />
                <div className='container-header-charges'>
                    <div className='title-charges font-nunito'>
                        <img src={paperCharges} />
                        <h1>Cobranças</h1>
                    </div>

                    <div className='container-add-charges'>
                        <div className='filter-charges'>
                            <img src={filterIcon} />
                        </div>

                        <div className='search-charges font-nunito'>
                            <input
                                type='text'
                                placeholder='Pesquisa'
                                className='search-input'
                                onChange={(e) => setCustomerFilter(e.target.value)}
                            />
                            <img src={searchIcon} />
                        </div>
                    </div>
                </div>
                {filterCharges.length > 0 &&
                    <div className='container-table-charges font-nunito display-justify-align-center'>
                        <table>
                            <thead className="tableHeader">
                                <tr >
                                    <th onClick={() => handleSort()}>
                                        <div className='order-charges '>
                                            <img src={orderIcon} />
                                            <p>Cliente</p>

                                        </div>
                                    </th>
                                    <th onClick={() => handleSortId()} >
                                        <div className='order-charges-id   '>
                                            <img src={orderIcon} />
                                            <p>ID Cob.</p>
                                        </div>
                                    </th>
                                    <th>Valor</th>
                                    <th>Data de venc.</th>
                                    <th>Status</th>
                                    <th>Descrição</th>
                                </tr>
                            </thead>

                            {customerFilter && filterCharges.map((item) => (
                                <tbody key={item.id}>
                                    <tr >
                                        <td onClick={() => handleDetailCharges(item)}>{item.nome_cliente}</td>
                                        <td onClick={() => handleDetailCharges(item)}>{item.id}</td>
                                        <td onClick={() => handleDetailCharges(item)} className="values">{formatValue(item.valor)}</td>
                                        <td onClick={() => handleDetailCharges(item)}>{formatDate(item.vencimento)}</td>
                                        <td onClick={() => handleDetailCharges(item)}>
                                            <div className={(item.status) === 'pendente' ? 'status-client-pending' : (item.status) === 'vencida' ? 'status-client-defaulter' : 'status-client-ok'}>
                                                {item.status}
                                            </div>
                                        </td>
                                        <td onClick={() => handleDetailCharges(item)} className="description">{item.descricao}</td>
                                        <td className="container-icons-charges">
                                            <div className='addCharge-charges-edit display-justify-align-center'>
                                                <img onClick={() => handleChangeEditCharges(item)} src={editIcon} />
                                                Editar
                                            </div>
                                            <div className='addCharge-charges-delete display-justify-align-center'>
                                                <img onClick={() => handleChangeDeleteCharges(item)} src={deleteIcon} />
                                                Excluir
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            ))}

                            {!customerFilter && charges.map((item) => (
                                <tbody key={item.id}>
                                    <tr>
                                        <td onClick={() => handleDetailCharges(item)}>{item.nome_cliente}</td>
                                        <td onClick={() => handleDetailCharges(item)}>{item.id}</td>
                                        <td onClick={() => handleDetailCharges(item)} className="values">{formatValue(item.valor)}</td>
                                        <td onClick={() => handleDetailCharges(item)}>{formatDate(item.vencimento)}</td>
                                        <td onClick={() => handleDetailCharges(item)}>
                                            <div className={(item.status) === 'pendente' ? 'status-client-pending' : (item.status) === 'vencida' ? 'status-client-defaulter' : 'status-client-ok'}>
                                                {item.status}
                                            </div>
                                        </td>
                                        <td onClick={() => handleDetailCharges(item)} className="description">{item.descricao}</td>
                                        <td className="container-icons-charges">
                                            <div className='addCharge-charges-edit display-justify-align-center'>
                                                <img onClick={() => handleChangeEditCharges(item)} src={editIcon} />
                                                Editar
                                            </div>
                                            <div className='addCharge-charges-delete display-justify-align-center'>
                                                <img onClick={() => handleChangeDeleteCharges(item)} src={deleteIcon} />
                                                Excluir
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            ))}
                        </table>
                    </div>
                }
                {filterCharges.length === 0 && getApi === true &&
                    < div className='emptyTable'>
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
            {openEditModal && <ModalEditCharges setOpenEditModal={setOpenEditModal} openEditModal={openEditModal} getAllCharges={getAllCharges} />}
            {openDeleteModal && <ModalDeleteCharges openDeleteModal={openDeleteModal} setOpenDeleteModal={setOpenDeleteModal} />}
            {openModalDetail && <ModalDetailCharges setOpenModalDetail={setOpenModalDetail} />}
        </div>
    )
}