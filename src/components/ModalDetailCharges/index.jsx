import './styles.css'
import CloseIcon from '../../assets/closeIcon.svg';
import PaperCharges from '../../assets/paperCharges.svg';
import { getLocalItem } from '../../utils/localStorage'
import { formatValue, formatDate } from '../../utils/format'

export default function ModalDetailCharges({ setOpenModalDetail }) {
    const chargeData = JSON.parse(getLocalItem('ChargesDetail'))

    return (
        <div className='backdrop'>
            <div className='container-modal-detail'>
                <img onClick={() => setOpenModalDetail(false)}
                    className='close-icon-detail'
                    src={CloseIcon}
                    alt="Ícone de fechar" />
                <div className='title-detail'>
                    <img src={PaperCharges} alt="Ícone das cobranças" />
                    <h3>Detalhe da Cobrança</h3>
                </div>
                <div className='name-detail'>
                    <p>Nome</p>
                    <span>{chargeData.nome_cliente}</span>
                </div>
                <div className='description-detail'>
                    <p>Descrição</p>
                    <span>{chargeData.descricao}</span>
                </div>
                <div className='container-footer-detail'>
                    <div>
                        <div className='dueDate-detail'>
                            <p>Vencimento</p>
                            <span>{formatDate(chargeData.vencimento)}</span>
                        </div>
                        <div className='id-detail'>
                            <p>ID cobranças</p>
                            <span>{chargeData.id}</span>
                        </div>
                    </div>
                    <div>
                        <div className='value-detail'>
                            <p>Valor</p>
                            <span>{formatValue(chargeData.valor)}</span>
                        </div>
                        <div className='status-detail'>
                            <p >Status</p>
                            <span className={(chargeData.status) === 'pendente' ? 'status-client-pending' : (chargeData.status) === 'vencida' ? 'status-client-defaulter' : 'status-client-ok'}>{chargeData.status}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}