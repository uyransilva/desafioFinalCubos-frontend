import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CloseIcon from '../../assets/closeIcon.svg';
import AlertIcon from '../../assets/alert.svg'
import api from '../../services/api';
import { getLocalItem } from '../../utils/localStorage';
import { toastError, toastSucess } from '../../utils/toast';
import './styles.css';

export default function ModalDeleteCharges({ openDeleteModal, setOpenDeleteModal }) {
    const clientData = JSON.parse(getLocalItem('ChargesDelete'))
    const token = getLocalItem('token')

    function closeModal() {
        setOpenDeleteModal(false)
    }

    async function handleSubmit() {
        try {
            const response = await api.delete('/charges', {
                data: {
                    cliente_id: clientData.id_cliente,
                    charge_id: clientData.id,
                    status: clientData.status,
                },
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            toastSucess('Cobrança excluida com sucesso!')
            setTimeout(() => window.location.reload(), 3000);
            setTimeout(() => closeModal(), 3000);
        } catch (error) {
            toastError(error.response.data.mensagem)
        }
    }

    return (
        <div className="backdrop"
            style={{ display: open ? 'flex' : 'none' }}
        >
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
            <div className='container-modal-delete'>
                <img onClick={() => closeModal()} className='close-icon' src={CloseIcon} alt="Ícone de fechar" />
                <img className='alert-icon' src={AlertIcon} alt="Ícone de alerta" />
                <span>Tem certeza que deseja excluir esta cobrança?</span>
                <div className='container-button-delete'>
                    <button onClick={() => closeModal()} className='button-no'>Não</button>
                    <button onClick={() => handleSubmit()} className='button-yes'>Sim</button>
                </div>
            </div>
        </div>
    )
}