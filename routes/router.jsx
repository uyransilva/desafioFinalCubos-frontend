import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { Customers } from '../src/pages/Customers';
import { Details } from '../src/pages/Details';
import { Home } from "../src/pages/Home";
import { Login } from "../src/pages/Login";
import { Charges } from '../src/pages/Charges'
import { SignUp } from "../src/pages/SignUp";
import { getLocalItem } from '../src/utils/localStorage';

function ProtectedRoutes({ redirectTo }) {
    const isAuthenticated = getLocalItem('token');

    return isAuthenticated ? <Outlet /> : <Navigate to={redirectTo} />
}

const PreventDuplicatedLoginRoutes = ({ redirectTo }) => {
    const isAthenticated = getLocalItem('token');

    return isAthenticated ? <Navigate to={redirectTo} /> : <Outlet />;
}

export function MainRoutes() {

    return (
        <Routes>
            <Route element={<ProtectedRoutes redirectTo='/login' />}>
                <Route path='/'>
                    <Route path='/' element={<Home />} />
                    <Route path='/home' element={<Home />} />
                    <Route path='/clientes' element={<Customers />} />
                    <Route path='/charges' element={<Charges />} />
                    <Route path='/details' element={<Details />} />
                </Route>
            </Route>

            <Route path='/signup' element={<SignUp />} />

            <Route
                element={
                    <PreventDuplicatedLoginRoutes
                        redirectTo='/home'
                    />}>
                <Route
                    path='/'
                    element={<Home />}
                />
                <Route
                    path='/login'
                    element={<Login />}
                />
            </Route>
        </Routes>
    )
}