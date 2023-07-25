import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import { useEffect, useState } from 'react';
import InputMask from 'react-input-mask';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ClientIcon from '../../assets/clientesIcon.svg';
import CloseIcon from '../../assets/closeIcon.svg';
import api from '../../services/api';
import axios from 'axios'
import { formatName, replaceWhiteSpaces, handleFormatCep } from '../../utils/format';
import { getLocalItem } from '../../utils/localStorage';
import { toastError } from '../../utils/toast';
import "./styles.css";

function ModalRegisterClient({ closeModalRegister, openRegister, getAllClients }) {

    const [openAlert, setOpenAlert] = useState(false)
    const [errorCep, setErrorCep] = useState(false)
    const token = getLocalItem('token')
    const headers = {
        Authorization: `Bearer ${token}`
    }

    function closeModal() {
        closeModalRegister(false)
        clearFormik();
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

        async function handleCep(event) {
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
            handleCep
        };
    }

    const formik = useFormik({
        initialValues: {
            userName: '',
            userEmail: '',
            userCpf: '',
            userPhone: '',
            userAdress: '',
            userComplement: '',
            userCep: '',
            userDistrict: '',
            userCity: '',
            userState: ''
        },
        validate: function (values) {
            const errors = {};

            const validateNumber = !isNaN(parseFloat(values.userName)) && isFinite(values.userName);
            const validateAdress = !isNaN(parseFloat(values.userAdress)) && isFinite(values.userAdress);
            const validateDistrict = !isNaN(parseFloat(values.userDistrict)) && isFinite(values.userDistrict);
            const validateCity = !isNaN(parseFloat(values.userCity)) && isFinite(values.userCity);
            const validateEmail = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/gi
            const arrayCpf = values.userCpf.split('')
            const validCpf = arrayCpf.includes('_')
            const arrayPhone = values.userPhone.split('')
            const validPhone = arrayPhone.includes('_')

            if (!values.userName) { errors.userName = 'Este campo é obrigatório' }
            if (values.userName.length > 30) { errors.userName = 'Este campo deve conter no máximo 30 caracteres'; }
            if (validateNumber) { errors.userName = 'Este campo não pode conter apenas números'; }
            if (validateEmail.test(values.userEmail) === false) { errors.userEmail = 'Por favor, digite um email válido' }
            if (!values.userEmail) { errors.userEmail = 'Este campo é obrigatório' }
            if (validCpf) { errors.userCpf = 'Um CPF possui 11 dígitos' }
            if (!values.userCpf) { errors.userCpf = 'Este campo é obrigatório' }
            if (validPhone) { errors.userPhone = 'Preencha o campo com 11 dígitos + DDD + 9' }
            if (!values.userPhone) { errors.userPhone = 'Este campo é obrigatório' }
            if (validateAdress) { errors.userAdress = 'Este campo não pode conter apenas números'; }
            if (values.userCep.length > 0 && values.userCep.length < 8) { errors.userCep = 'Um CEP possui 8 dígitos' }
            if (values.userCep.length > 8) { errors.userCep = 'Um CEP possui 8 dígitos' }
            if (validateDistrict) { errors.userDistrict = 'Este campo não pode conter apenas números'; }
            if (validateCity) { errors.userCity = 'Este campo não pode conter apenas números'; }
            if (values.userState.length == 1) { errors.userState = 'Preencha este campo com 2 caracteres'; }

            return errors;
        }
    });

    function clearFormik() {
        formik.values.userName = ''
        formik.values.userEmail = ''
        formik.values.userCpf = ''
        formik.values.userPhone = ''
        formik.values.userAdress = ''
        formik.values.userComplement = ''
        formik.values.userCep = ''
        formik.values.userDistrict = ''
        formik.values.userCity = ''
        formik.values.userState = ''
        formik.errors.userName = 'Este campo é obrigatório'
        formik.errors.userEmail = 'Este campo é obrigatório'
        formik.errors.userCpf = 'Este campo é obrigatório'
        formik.errors.userPhone = 'Este campo é obrigatório'
    }

    async function handleChangeCep() {

        try {
            if (formik.values.userCep.length === 8) {
                const response = await axios.get(`https://cdn.apicep.com/file/apicep/${handleFormatCep(formik.values.userCep)}.json`)
                setErrorCep(false)
                formik.values.userAdress = response.data.address
                formik.values.userCity = response.data.city
                formik.values.userState = response.data.state
                formik.values.userDistrict = response.data.district
            }
        } catch (error) {
            if (error) {
                toastError('Informe um CEP válido')
                setErrorCep(true)
            }
        }
    }

    async function handleSubmit(event) {
        event.preventDefault();

        if (formik.values.userName == '' || formik.values.userEmail == ''
            || formik.values.userCpf == '' || formik.values.userPhone == '') {
            toastError('Preencha todos os campos obrigatorios!')
            return
        }

        if (formik.errors.userName || formik.errors.userEmail || formik.errors.userCpf
            || formik.errors.userPhone || formik.errors.userCep || formik.errors.userState
            || formik.errors.userDistrict || formik.errors.userCity || formik.errors.userComplement || formik.errors.userAdress) {
            toastError('Atenção, preencha todos os campos corretamentes')
            return
        }

        if (errorCep) {
            toastError('Informe um CEP válido')
            return
        }

        if (formik.values.userAdress.trim().length === 0) {
            formik.values.userAdress = ''
        }
        if (formik.values.userComplement.trim().length === 0) {
            formik.values.userComplement = ''
        }
        if (formik.values.userDistrict.trim().length === 0) {
            formik.values.userDistrict = ''
        }
        if (formik.values.userCity.trim().length === 0) {
            formik.values.userCity = ''
        }

        if (formik.values.userState.length === 0) {
            formik.values.userState = ''
        }

        try {
            const { data } = await api.post('/clients', {
                nome: formatName(formik.values.userName),
                email: formik.values.userEmail,
                cpf: formik.values.userCpf,
                telefone: formik.values.userPhone,
                logradouro: replaceWhiteSpaces(formik.values.userAdress),
                complemento: replaceWhiteSpaces(formik.values.userComplement),
                cep: formik.values.userCep ? handleFormatCep(formik.values.userCep) : '',
                bairro: replaceWhiteSpaces(formik.values.userDistrict),
                cidade: replaceWhiteSpaces(formik.values.userCity),
                estado: formik.values.userState.toUpperCase()
            }, { headers })
            clearFormik();
            getAllClients();
            setOpenAlert(true)
            setTimeout(() => setOpenAlert(false), 3000);
            closeModal();
        } catch (error) {
            toastError(error.response.data.mensagem);
            return
        }
    }

    return (
        <>
            {openRegister &&
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
                    <div className="modalRegister">
                        <h2><img src={ClientIcon} alt="Ícone dos clientes"></img>
                            Cadastro do Cliente</h2>
                        <img
                            src={CloseIcon}
                            alt="Ícone de fechar"
                            className="closeIcon"
                            onClick={() => closeModal()}
                        >
                        </img>
                        <form onSubmit={handleSubmit} className="modal-form-register">
                            <div className='input-register'>
                                <span>Nome*</span>
                                <input maxLength='50px' name="userName" onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.userName}
                                    placeholder='Digite seu nome' />
                                {formik.errors.userName && <p className="erro-register">{formik.errors.userName}</p>}
                            </div>

                            <div className='input-register'>
                                <span>E-mail*</span>
                                <input maxLength='50px' name="userEmail" onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.userEmail.trim()}
                                    placeholder='Digite seu e-mail' />
                                {formik.errors.userEmail && <p className="erro-register">{formik.errors.userEmail}</p>}
                            </div>

                            <div className='container-cpf-tell' >
                                <div className='input-register'>
                                    <span>CPF*</span>
                                    <InputMask name="userCpf" onBlur={formik.handleBlur} onChange={formik.handleChange} type='text' value={formik.values.userCpf}
                                        className='input-mask-register-cpf' mask='999.999.999-99' placeholder='Digite seu CPF' />
                                    {formik.errors.userCpf && <p className="erro-register">{formik.errors.userCpf}</p>}
                                </div>


                                <div className='input-register'>
                                    <span>Telefone*</span>
                                    <InputMask name="userPhone" onBlur={formik.handleBlur} onChange={formik.handleChange} type='text' value={formik.values.userPhone}
                                        className='input-mask-register-tell' mask='(99)99999-9999' placeholder='Digite seu telefone' />
                                    {formik.errors.userPhone && <p className="erro-register">{formik.errors.userPhone}</p>}
                                </div>
                            </div>


                            <div className='input-register'>
                                <span>Endereço</span>
                                <input maxLength='70px' name="userAdress" onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.userAdress}
                                    placeholder='Digite seu endereço' />
                                {formik.errors.userAdress && <p className="erro-register">{formik.errors.userAdress}</p>}
                            </div>

                            <div className='input-register'>
                                <span>Complemento</span>
                                <input maxLength='90px' name="userComplement" onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.userComplement}
                                    placeholder='Digite seu complemento' />
                                {formik.errors.userComplement && <p className="erro-register">{formik.errors.userComplement}</p>}
                            </div>

                            <div className='container-cep-district'>
                                <div className='input-register'>
                                    <span>CEP</span>
                                    <input name="userCep" onBlur={formik.handleBlur} onChange={formik.handleCep} type='number' value={formik.values.userCep}
                                        className='input-mask-cep' onKeyUp={handleChangeCep} placeholder='Digite seu CEP' />
                                    {formik.errors.userCep && <p className="erro-register">{formik.errors.userCep}</p>}
                                </div>

                                <div className='input-register'>
                                    <span>Bairro</span>
                                    <input maxLength='50px' className='input-district' name="userDistrict" onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.userDistrict}
                                        placeholder='Digite seu bairro' />
                                    {formik.errors.userDistrict && <p className="erro-register">{formik.errors.userDistrict}</p>}
                                </div>
                            </div>

                            <div className='container-city-state'>
                                <div className='input-register'>
                                    <span>Cidade</span>
                                    <input maxLength='30px' className='input-city' name="userCity" onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.userCity}
                                        placeholder='Digite sua cidade' />
                                    {formik.errors.userCity && <p className="erro-register">{formik.errors.userCity}</p>}
                                </div>

                                <div className='input-register'>
                                    <span>UF</span>
                                    <InputMask name="userState" onBlur={formik.handleBlur} onChange={formik.handleChange} type='text' value={formik.values.userState.trim()}
                                        className='input-state' maxLength='2' placeholder='Digite a UF' />
                                    {formik.errors.userState && <p className="erro-register">{formik.errors.userState}</p>}
                                </div>
                            </div>

                            <div className='lineBreak'>
                                <button onClick={() => closeModal()} className='btn cancelBtn hover-btn-two'>Cancelar</button>
                                <button type='submit' className='btn applyBtn hover-btn-one'>Aplicar</button>
                            </div>
                        </form>
                    </div>
                </div >
            }
            <div className='alert'>
                {openAlert &&
                    <Stack sx={{
                        width: '25%',
                        position: 'fixed',
                        bottom: '5%',
                        left: '70%'
                    }} spacing={2}>
                        <Alert
                            onClose={() => { }}
                            icon={<CheckCircleOutlineIcon />}
                            color='info'>
                            Cadastro concluído com sucesso
                        </Alert>
                    </Stack>
                }
            </div>
        </>
    )
}
export default ModalRegisterClient