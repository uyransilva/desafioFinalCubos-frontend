import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import { useEffect, useState } from 'react';
import InputMask from 'react-input-mask';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CloseIcon from '../../assets/closeIcon.svg';
import paperCharges from '../../assets/paperCharges.svg';
import api from '../../services/api';
import { formatName, replaceWhiteSpaces } from '../../utils/format';
import { getLocalItem } from '../../utils/localStorage';
import { toastError, toastSucess } from '../../utils/toast';
import './styles.css';

export default function ModalRegisterCharges({ nameClientCharge, addCharges, setOpenModalCharges, openEditClient }) {

    const [openAlert, setOpenAlert] = useState(false)
    const [valueCharges, setValuesCharges] = useState(true)
    const clientData = JSON.parse(getLocalItem('ClientData'))
    const token = getLocalItem('token')
    const headers = {
        Authorization: `Bearer ${token}`
    }

    function closeModal() {
        setOpenModalCharges(false)
        setValuesCharges(true)
    }

    function handleChangePayment() {
        setValuesCharges(true)
        formik.values.status = 'pago'
    }
    function handleChangePending() {
        setValuesCharges(false)
        formik.values.status = 'pendente'
    }

    function useFormik({
        initialValues,
        validate
    }) {
        const [touched, setTouchedFields] = useState({});
        const [errors, setErrors] = useState({});
        const [values, setValues] = useState(initialValues);

        useEffect(() => {
            validateValues(values);
        }, [values]);

        function handleChange(event) {
            const fieldName = event.target.getAttribute('name');
            const { value } = event.target;
            setValues({
                ...values,
                [fieldName]: value,
            });
        }

        function handleBlur(event) {
            const fieldName = event.target.getAttribute('name');
            setTouchedFields({
                ...touched,
                [fieldName]: true,
            })
        }

        function validateValues(values) {
            setErrors(validate(values));
        }

        return {
            values,
            errors,
            touched,
            handleBlur,
            setErrors,
            handleChange,
        };
    }

    const formik = useFormik({
        initialValues: {
            userName: nameClientCharge ? nameClientCharge : '',
            userDescription: '',
            userDueDate: '',
            userValue: '',
            status: 'pago'
        },
        validate: function (values) {
            const errors = {};

            const validateNumber = !isNaN(parseFloat(values.userName)) && isFinite(values.userName);
            const validateDescricao = !isNaN(parseFloat(values.userDescription)) && isFinite(values.userDescription);

            if (validateNumber) { errors.userName = 'Este campo não pode conter apenas números'; }
            if (!values.userDescription) { errors.userDescription = 'Este campo é obrigatório' }
            if (validateDescricao) { errors.userDescription = 'Este campo não pode conter apenas números'; }
            if (values.userDueDate == '') { errors.userDueDate = 'Este campo é obrigatório' }
            if (values.userDueDate.length > 10) { errors.userDueDate = 'Preencha o campo ano com 4 dígitos' }
            if (!values.userValue) { errors.userValue = 'Este campo é obrigatório' }
            return errors;
        }
    });

    function clearFormik() {
        formik.values.userName = ''
        formik.values.userDescription = ''
        formik.values.userDueDate = ''
        formik.values.userValue = ''
    }

    async function handleSubmit(event) {
        event.preventDefault();
        formik.values.userName = nameClientCharge

        if (formik.values.userDueDate == '' || formik.values.userDescription == '' || formik.values.userValue == '') {
            toastError('Preencha todos os campos obrigatorios!')
            return
        }

        if (formik.errors.userName || formik.errors.userDescription || formik.errors.userDueDate || formik.errors.userValue) {
            toastError('Atenção, preencha todos os campos corretamentes')
            return
        }

        if (formik.values.userDescription.trim().length === 0) {
            toastError('Por favor, preencha os campos em branco')
            return
        }

        try {
            const response = await api.post('/charges', {
                cliente_id: addCharges ? addCharges.id : clientData.id,
                nome: formatName(formik.values.userName),
                descricao: replaceWhiteSpaces(formik.values.userDescription.trim()),
                vencimento: formik.values.userDueDate,
                valor: formik.values.userValue,
                status: formik.values.status
            }, { headers })
            clearFormik();
            toastSucess('Cobrança adicionada com sucesso!')
            setTimeout(() => window.location.reload(), 3000);
            setTimeout(() => closeModal(), 3000);
        } catch (error) {
            toastError(error.response.data.mensagem)
            return
        }
    }

    return (
        <>
            <div
                className="backdrop"
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
                <div className="modal-register-charges">
                    <h2><img src={paperCharges} alt="Ícone das cobranças"></img>
                        Cadastro de Cobrança</h2>
                    <img
                        src={CloseIcon}
                        alt="Ícone de fechar"
                        className="closeIcon"
                        onClick={() => closeModal()}
                    >
                    </img>
                    <form onSubmit={handleSubmit} className="modal-form-register-charges">
                        <div className='input-register-charges'>
                            <span>Nome*</span>
                            <input className='style' name="userName" onBlur={formik.handleBlur} value={nameClientCharge}
                                placeholder='Digite seu nome' />
                            {formik.errors.userName && <p className="style-erro">{formik.errors.userName}</p>}
                        </div>

                        <div className='input-register-charges'>
                            <span>Descrição*</span>
                            <input maxLength='80px' wrap='hard' className='input-descricao-charges' name="userDescription" onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.userDescription}
                                placeholder='Digite a descrição' />
                            {formik.errors.userDescription && <p className="style-erro-descricao">{formik.errors.userDescription}</p>}
                        </div>

                        <div className='container-cpf-tell-charges' >
                            <div className='input-register-charges'>
                                <span>Vencimento*</span>
                                <InputMask name="userDueDate" onBlur={formik.handleBlur} onChange={formik.handleChange} type='date' value={formik.values.userDueDate}
                                    className='input-mask-register-cpf style' placeholder='Digite o status' />
                                {formik.errors.userDueDate && <p className="style-erro">{formik.errors.userDueDate}</p>}
                            </div>

                            <div className='input-register-charges'>
                                <span>Valor*</span>
                                <InputMask name="userValue" onBlur={formik.handleBlur} onChange={formik.handleChange} type='number' value={formik.values.userValue}
                                    className='input-mask-register-tell value ' placeholder='Digite o valor' />
                                {formik.errors.userValue && <p className="style-erro">{formik.errors.userValue}</p>}
                            </div>
                        </div>

                        <div className='status-charges'>
                            <div className='ok'>
                                <span>Status*</span>
                                <input onClick={() => handleChangePayment()} className={valueCharges ? 'checked style' : 'uncheck style'} type='radio' name="userPayment" onBlur={formik.handleBlur}
                                    placeholder='Digite seu e-mail' />
                                <p>Cobrança Paga</p>
                            </div>

                            <div className='defaulter'>
                                <input onClick={() => handleChangePending()} className={valueCharges ? 'uncheck style' : 'checked style'} type='radio' name="userPending" onBlur={formik.handleBlur}
                                    placeholder='Digite seu e-mail' />
                                <p>Cobrança Pendente</p>
                            </div>
                        </div>

                        <div className='lineBreak'>
                            <button onClick={() => closeModal()} className='btn cancelBtn hover-btn-two'>Cancelar</button>
                            <button type='submit' className='btn applyBtn hover-btn-one'>Aplicar</button>
                        </div>
                    </form>
                </div>
            </div >

            <div className='alert'>
                {openAlert &&
                    <Stack sx={{
                        width: '25%',
                        position: 'absolute',
                        bottom: '5%',
                        left: '70%'
                    }} spacing={2}>
                        <Alert
                            onClose={() => { }}
                            icon={<CheckCircleOutlineIcon />}
                            color='info'>
                            Cobrança cadastrada com sucesso!
                        </Alert>
                    </Stack>
                }
            </div>
        </>
    )
}