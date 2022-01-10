import { ConfigProvider } from "antd";
import faIR from "antd/es/locale/fa_IR";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import ProtectedRoute from "components/common/auth/ProtectedRoute";
import ProtectedOfAuthed from "components/common/auth/ProtectedOfAuthed";
import Login from "components/common/auth/Login";
import Panel from "components/common/panel/Panel";
import { useCookies } from "react-cookie";
import axios from "axios";
import ReactNotofication from "react-notifications-component";
import "./App.css";
import "animate.css/animate.css";
import "react-notifications-component/dist/theme.css";

axios.interceptors.response.use(
    (res) => {
        const { data, message, totalrecords } = res.data.result;
        return { data, message, totalrecords };
    },
    (error) => {
        if (!error.response) {
            return Promise.reject("خطای سرور");
        }
        const { status } = error.response;
        if (status === 404 || status === 400 || status === 415) {
            return Promise.reject("بروز خطا");
        }
        if (status === 401) {
            // document.cookie = "token=salam;Max-Age=0"
            // return window.location.href = "/login"
            return Promise.reject("بروز خطا");
        }
        if (status === 500) {
            // window.location.href = "/login"
            // document.cookie = "token=salam;Max-Age=0"
            return Promise.reject("خطای سرور");
        }
        if (error.response) {
            const { errorCode, errorDesc } =
                error.response.data.result.error[0];
            return Promise.reject(`${errorDesc}  (${errorCode})`);
        }

        return Promise.reject("بروز خطا");
    }
);

const App = () => {
    const [cookies, setCookie] = useCookies(["token"]);
    axios.defaults.baseURL = process.env.REACT_APP_API_URL;
    axios.defaults.headers.common["Authorization"] =
        "Bearer " + cookies["token"];
    return (
        <ConfigProvider direction="rtl" locale={faIR}>
            <ReactNotofication />
            <Router>
                <Switch>
                    <ProtectedOfAuthed path="/login" component={Login} />
                    <ProtectedRoute path="/" component={Panel} />
                    <Route path="*">
                        <h1>No Match</h1>
                    </Route>
                </Switch>
            </Router>
        </ConfigProvider>
    );
};

export default App;
