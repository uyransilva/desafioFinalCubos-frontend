import EditIcon from '../../../assets/editIcon.svg'
import DeleteIcon from '../../../assets/deleteIcon.svg'
import OrderIcon from '../../../assets/orderIcon.svg'
import { useEffect, useState } from 'react'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import api from '../../../services/api';
import { getLocalItem, setLocalItem } from '../../../utils/localStorage'
import { formatDate, formatValue } from '../../../utils/format'
import { toastError } from '../../../utils/toast'
import './style.css'
export function CustomerCharges({ setOpenModalDetail, setOpenModalCharges, setOpenNameClient, setOpenEditModal, setOpenDeleteModal }) {

    const [chargesData, seChargesData] = useState([]);
    const [orderId, setOrderId] = useState('DSC');
    const [orderDueDate, setOrderDueDate] = useState('DSC');
    const token = getLocalItem('token');
    const clientData = JSON.parse(getLocalItem('ClientData'))
    const headers = {
        Authorization: `Bearer ${token}`
    };

    function handleChangeLocalStorage() {
        setLocalItem('active', 'true')
        setOpenModalCharges(true)
        setOpenNameClient(clientData.nome)
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

    async function getAllCharges() {
        try {
            const response = await api.get('/charges', { headers })
            seChargesData(response.data)
        } catch (error) {
            toastError(error.response.data.mensagem)
            if (error.response.data.mensagem == 'Não autorizado') {
                clearLocalItem();
                navigate('/login')
            }
            return
        }
    }

    const filtro = chargesData.filter((item) => {
        return item.id_cliente == clientData.id
    })

    const handleSortId = () => {
        const localCharges = [...filtro];
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

    const handleSortDueDate = () => {
        const localCharges = [...filtro];
        if (orderId === "ASC") {
            localCharges.sort((a, b) => {
                return b.vencimento > a.vencimento ? 1 : -1;
            })
            setOrderId("DSC");
            seChargesData(localCharges);
        }
        if (orderId === "DSC") {
            localCharges.sort((a, b) => {
                return a.vencimento > b.vencimento ? 1 : -1;
            })
            setOrderId("ASC");
            seChargesData(localCharges);
        }
    }

    useEffect(() => {
        getAllCharges();
    }, []);

    return (
        <>
            <div className='customerCharges'>
                <ToastContainer
                    position="top-right"
                    autoClose={111111100}
                    hideProgressBar={true}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover />
                <div className='customerChargesHeader'>
                    <h3>Cobranças do Cliente</h3>
                    <button onClick={() => handleChangeLocalStorage()}>+ Nova Cobrança</button>
                </div>
                <div className='customerChargesTable'>
                    <div className='chargesTableHeader'>
                        <strong onClick={() => handleSortId()} className='chargesTableHeaderImg'><img src={OrderIcon} alt="Ícone de ordernar"></img>ID Cob.</strong>
                        <strong onClick={() => handleSortDueDate()} className='chargesTableHeaderImg'><img src={OrderIcon} alt="Ícone de ordenar"></img>Data de venc.</strong>
                        <strong>Valor</strong>
                        <strong>Status</strong>
                        <strong>Descrição</strong>
                        <strong></strong>
                    </div>
                    <div className='chargesTableBody'>
                        {filtro.map((item) => (
                            <div key={item.id} className='chargesTableRow'>
                                <span onClick={() => handleDetailCharges(item)} className='chargeIdCell'>{item.id}</span>
                                <span onClick={() => handleDetailCharges(item)}>{formatDate(item.vencimento)}</span>
                                <span onClick={() => handleDetailCharges(item)}>{formatValue(item.valor)}</span>
                                <span onClick={() => handleDetailCharges(item)} className='statusPago'><div className={(item.status) === 'pendente' ? 'statusPendent' : (item.status) === 'vencida' ? 'statusOverdue' : 'statusPaid'}>{item.status}</div>
                                </span>
                                <span onClick={() => handleDetailCharges(item)}><div className='chargeDescription'>{item.descricao}</div></span>
                                <span className='actionColumn'>
                                    <div onClick={() => handleChangeEditCharges(item)} className='editCharge'><img src={EditIcon} alt="Ícone de editar"></img><p>Editar</p></div>
                                    <div onClick={() => handleChangeDeleteCharges(item)} className='editCharge'><img src={DeleteIcon} alt="Ícone de deletar"></img><p>Excluir</p></div>
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}