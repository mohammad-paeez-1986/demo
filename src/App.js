import { useEffect } from 'react';
import { ConfigProvider } from 'antd';
import faIR from 'antd/es/locale/fa_IR';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import ProtectedRoute from 'components/common/auth/ProtectedRoute';
import ProtectedOfAuthed from 'components/common/auth/ProtectedOfAuthed';
import Login from 'components/common/auth/Login';
import Panel from 'components/common/panel/Panel';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import ReactNotofication from 'react-notifications-component';
import './App.css';
import 'animate.css/animate.css';
import 'react-notifications-component/dist/theme.css';

axios.interceptors.response.use(
    (res) => {
        const { data, message, totalrecords } = res.data.result;
        return { data, message, totalrecords };
    },
    (error) => {
        if (!error.response) {
            return Promise.reject('خطای سرور');
        }
        const { status } = error.response;
        if (status === 404 || status === 400 || status === 415) {
            return Promise.reject('بروز خطا');
        }
        if (status === 401) {
            // document.cookie = "token=salam;Max-Age=0"
            // return window.location.href = "/login"
            return Promise.reject('بروز خطا');
        }
        if (status === 500) {
            // window.location.href = "/login"
            // document.cookie = "token=salam;Max-Age=0"
            return Promise.reject('خطای سرور');
        }
        if (error.response) {
            const { errorCode, errorDesc } =
                error.response.data.result.error[0];
            return Promise.reject(`${errorDesc}  (${errorCode})`);
        }

        return Promise.reject('بروز خطا');
    }
);

const App = () => {

    setTimeout(() => {
        document.body.setAttribute('dark', true)
    }, 3000);
    const [cookies, setCookie] = useCookies(['token']);
    // axios.defaults.baseURL = process.env.REACT_APP_API_URL;
    axios.defaults.baseURL = window.apiURL;
    // axios.defaults.baseURL = 'https://coreapi.ir/';
    axios.defaults.headers.common['Authorization'] =
        'Bearer ' + cookies['token'];

    useEffect(() => {
        const element = document.getElementById('profile');
        if (cookies['token'] && element.innerHTML == '') {
            axios
                .post('User/Profile')
                .then(({ data }) => {
                    // console.log(data);
                    element.innerHTML =
                        '<svg viewBox="64 64 896 896" focusable="false" data-icon="user" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M858.5 763.6a374 374 0 00-80.6-119.5 375.63 375.63 0 00-119.5-80.6c-.4-.2-.8-.3-1.2-.5C719.5 518 760 444.7 760 362c0-137-111-248-248-248S264 225 264 362c0 82.7 40.5 156 102.8 201.1-.4.2-.8.3-1.2.5-44.8 18.9-85 46-119.5 80.6a375.63 375.63 0 00-80.6 119.5A371.7 371.7 0 00136 901.8a8 8 0 008 8.2h60c4.4 0 7.9-3.5 8-7.8 2-77.2 33-149.5 87.8-204.3 56.7-56.7 132-87.9 212.2-87.9s155.5 31.2 212.2 87.9C779 752.7 810 825 812 902.2c.1 4.4 3.6 7.8 8 7.8h60a8 8 0 008-8.2c-1-47.8-10.9-94.3-29.5-138.2zM512 534c-45.9 0-89.1-17.9-121.6-50.4S340 407.9 340 362c0-45.9 17.9-89.1 50.4-121.6S466.1 190 512 190s89.1 17.9 121.6 50.4S684 316.1 684 362c0 45.9-17.9 89.1-50.4 121.6S557.9 534 512 534z"></path></svg> ' +
                        data[0].namefa;
                    element.style.display = 'inline';
                })
        }
    }, []);
    return (
        <ConfigProvider direction='rtl' locale={faIR}>
            <ReactNotofication />
            <Router>
                <Switch>
                    <ProtectedOfAuthed path='/login' component={Login} />
                    <ProtectedRoute path='/' component={Panel} />
                    <Route path='*'>
                        <h1>No Match</h1>
                    </Route>
                </Switch>
            </Router>
        </ConfigProvider>
    );
};

export default App;
