import { useEffect, useState } from 'react';
import InputMask from 'react-input-mask';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CloseIcon from '../../assets/closeIcon.svg';
import IconPassword from '../../assets/iconPassword.svg';
import SuccessIcon from '../../assets/success.svg';
import api from '../../services/api';
import { formatName } from '../../utils/format';
import { getLocalItem, removeLocalItem, setLocalItem } from '../../utils/localStorage';
import { toastError } from '../../utils/toast';
import "./styles.css";

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

function ModalEditProfile({ open, handleclose }) {

    const [showPassword, setShowPassword] = useState(false)
    const [showPassword2, setShowPassword2] = useState(false)
    const [success, setSuccess] = useState(false)
    const userName = getLocalItem('UserName')
    const UserEmail = getLocalItem('UserEmail')
    const UserCpf = getLocalItem('UserCpf')
    const UserTell = getLocalItem('UserTell')
    const token = getLocalItem('token')
    const headers = {
        Authorization: `Bearer ${token}`
    }

    function clearPassword() {
        handleclose();
        formik.values.userPassword = ''
        formik.values.userPassword2 = ''
        formik.errors.userName = ''
        formik.errors.userEmail = ''
    }

    const formik = useFormik({
        initialValues: {
            userName: '',
            userEmail: '',
            userCpf: UserCpf ? UserCpf : '',
            userPhone: UserTell ? UserTell : '',
            userPassword: '',
            userPassword2: '',
        },
        validate: function (values) {
            const errors = {};

            const validateNumber = !isNaN(parseFloat(values.userName)) && isFinite(values.userName);
            const validateEmail = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/gi
            const arrayCpf = values.userCpf.split('')
            const validCpf = arrayCpf.includes('_')
            const arrayPhone = values.userPhone.split('')
            const validPhone = arrayPhone.includes('_')

            if (!values.userName) {
                errors.userName = 'Este campo é obrigatório'
            }

            if (values.userName.length > 30) {
                errors.userName = 'Este campo deve conter no máximo 30 caracteres';
            }

            if (validateNumber) {
                errors.userName = 'Este campo não pode conter apenas números';
            }

            if (validateEmail.test(values.userEmail) === false) {
                errors.userEmail = 'Por favor, digite um email válido'
            }

            if (!values.userEmail) {
                errors.userEmail = 'Este campo é obrigatório'
            }

            if (validCpf) {
                errors.userCpf = 'Um CPF possui 11 dígitos'
            }

            if (validPhone) {
                errors.userPhone = 'Preencha o campo com 11 dígitos + DDD + 9'
            }

            if (!values.userPassword) {
                errors.userPassword = 'Este campo é obrigatório'
            }

            if (values.userPassword.length < 4 && values.userPassword.length > 0) {
                errors.userPassword = 'A senha precisa ter mais de 3 caracteres'
            }

            if (values.userPassword2.length < 4 && values.userPassword2.length > 0) {
                errors.userPassword2 = 'A senha precisa ter mais de 3 caracteres'
            }

            if (values.userPassword != values.userPassword2) {
                errors.userPassword2 = 'As senhas não conferem'
            }

            if (!values.userPassword2) {
                errors.userPassword2 = 'Este campo é obrigatório'
            }

            return errors;
        }
    });

    useEffect(() => {
        formik.values.userName = userName
        formik.values.userEmail = UserEmail
        formik.values.userCpf = UserCpf ? UserCpf : ''
        formik.values.userPhone = UserTell ? UserTell : ''
    }, [open])

    async function handleSubmit(event) {
        event.preventDefault();

        if (!formik.values.userName || !formik.values.userEmail || !formik.values.userPassword || !formik.values.userPassword2) {
            toastError('Preencha todos os campos obrigatorios!')
            return
        }

        if (formik.errors.userName || formik.errors.userEmail || formik.errors.userCpf
            || formik.errors.userPhone || formik.errors.userPassword || formik.errors.userPassword2) {
            toastError('Atenção, preencha todos os campos corretamentes')
            return
        }

        try {
            const { data } = await api.put('/usuarios', {
                nome: formatName(formik.values.userName),
                email: formik.values.userEmail,
                senha: formik.values.userPassword,
                cpf: formik.values.userCpf,
                telefone: formik.values.userPhone
            }, { headers })
            formik.values.userPassword = ''
            formik.values.userPassword2 = ''
            removeLocalItem('UserName')
            removeLocalItem('UserCpf')
            removeLocalItem('UserTell')
            removeLocalItem('UserEmail')
            setLocalItem('UserName', formik.values.userName)
            setLocalItem('UserCpf', formik.values.userCpf)
            setLocalItem('UserEmail', formik.values.userEmail)
            setLocalItem('UserTell', formik.values.userPhone)
            setSuccess(true)
            setTimeout(() => handleclose(), 2500)
            setTimeout(() => setSuccess(false), 2500)
            setValues('')
            window.location.reload(true)
        } catch (error) {
            return toastError(error.response.data.mensagem)
        }
    }

    return (
        <>
            {open &&
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
                    {!success ?
                        <div className="modalEdit">
                            <h2>Edite Seu Cadastro</h2>
                            <img
                                src={CloseIcon}
                                alt="Ícone de fechar"
                                className="closeIcon"
                                onClick={() => clearPassword()}
                            >
                            </img>

                            <form onSubmit={handleSubmit} className="modal-form-edit">
                                <div className='input-edit'>
                                    <span>Nome*</span>
                                    <input maxLength='50px' name="userName" onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.userName}
                                        placeholder='Digite seu nome' />
                                    {formik.errors.userName && <p className="erro">{formik.errors.userName}</p>}
                                </div>

                                <div className='input-edit'>
                                    <span>E-mail*</span>
                                    <input name="userEmail" onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.userEmail.trim()}
                                        placeholder='Digite seu e-mail' />
                                    {formik.errors.userEmail && <p className="erro">{formik.errors.userEmail}</p>}
                                </div>

                                <div className='container-cpf-tell' >
                                    <div className='input-edit'>
                                        <span>CPF</span>
                                        <InputMask name="userCpf" onBlur={formik.handleBlur} onChange={formik.handleChange} type='text' value={formik.values.userCpf}
                                            className='input-mask-cpf' mask='999.999.999-99' placeholder='Digite seu CPF' />
                                        {formik.errors.userCpf && <p className="erro-cpf">{formik.errors.userCpf}</p>}
                                    </div>
                                    <div className='input-edit'>
                                        <span>Telefone</span>
                                        <InputMask name="userPhone" onBlur={formik.handleBlur} onChange={formik.handleChange} type='text' value={formik.values.userPhone}
                                            className='input-mask-tell' mask='(99)99999-9999' placeholder='Digite seu telefone' />
                                        {formik.errors.userPhone && <p className="erro">{formik.errors.userPhone}</p>}
                                    </div>
                                </div>

                                <div className='input-edit'>
                                    <span>Nova senha*</span>
                                    <input maxLength='50px' className='erro-input' name="userPassword" onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.userPassword.trim()}
                                        type={showPassword ? 'password' : 'text'} placeholder='********' />
                                    <img onClick={() => setShowPassword(!showPassword)} className='icon-password' src={IconPassword} alt="Ícone da senha" />
                                    {formik.errors.userPassword && <p className="erro">{formik.errors.userPassword}</p>}
                                </div>

                                <div className='input-edit'>
                                    <span>Confirmar senha*</span>
                                    <input maxLength='50px' name="userPassword2" onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.userPassword2.trim()}
                                        type={showPassword2 ? 'password' : 'text'} placeholder='********' />
                                    <img onClick={() => setShowPassword2(!showPassword2)} className='icon-password' src={IconPassword} alt="Ícone da senha" />
                                    {formik.errors.userPassword2 && <p className="erro">{formik.errors.userPassword2}</p>}
                                </div>
                                <button className='pink-btn hover-btn-one'>Aplicar</button>
                            </form>
                        </div>
                        :
                        <div className='modalSucess'>
                            <img
                                src={SuccessIcon}
                                alt="Ícone de sucesso"
                                className="successIcon"></img>
                            <p>Cadastro Alterado com sucesso!</p>
                        </div>
                    }
                </div >
            }
        </>
    )
}
export default ModalEditProfile