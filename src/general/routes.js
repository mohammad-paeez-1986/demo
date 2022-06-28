// admin
import AddUser from 'components/admin/user/AddUser';
import ShowUser from 'components/admin/user/ShowUser';
import AddMessage from 'components/admin/message/AddMessage';
import ShowMessage from 'components/admin/message/ShowMessage';
import ShowReservationReport from 'components/admin/report/ShowReservationReport';
import ShowSettings from 'components/admin/settings/ShowSettings';
import ShowUpdateUserForms from 'components/admin/user/ShowUpdateUserForms';
// import AddDailyProgram from "components/admin/program/AddDailyProgram";
import ShowAddProgramTabs from 'components/admin/program/ShowAddProgramTabs';
import AddWelfareCluster from 'components/admin/welfareCluster/AddWelfareCluster';
import ShowReservationHistory from 'components/admin/program/ShowReservationHistory';
import NextDayReservations from 'components/admin/program/NextDayReservations';
import AdminProfile from 'components/admin/profile/AdminProfile';
import HolidaysCalendar from 'components/admin/calendar/HolidaysCalendar';
import Images from '../components/admin/upload/Images';

// common
import Dashboard from 'components/common/panel/Dashboard';
import NotFound from 'components/common/panel/NotFound';
import SignOut from 'components/common/auth/SignOut';
import ShowProfileTabs from 'components/common/profile/ShowProfileTabs';

// user
import Reserve from 'components/users/reservation/Reserve';
import ClinicReservation from 'components/users/reservation/ClinicReservation';
import ShowUserReservationHistory from 'components/users/reservation/ShowUserReservationHistory';
import ShowRule from 'components/users/rule/ShowRule';
import ShowCalendar from 'components/users/reservation/ShowCalendar';

// operator
import TodayReservations from 'components/operators/TodayReservations';
import ShowReservationReportForOperator from 'components/operators/ShowReservationReportForOperator';

const routes = [
    {
        path: ['/', '/dashboard'],
        exact: true,
        component: Dashboard,
    },
    {
        path: '/user/list',
        exact: true,
        component: ShowUser,
    },
    {
        path: '/user/newuserpersonel',
        exact: true,
        component: AddUser,
    },
    {
        path: ['/message/new', '/rule/new'],
        exact: true,
        component: AddMessage,
    },
    {
        path: [
            '/message/public',
            '/message/gym',
            '/message/cafe',
            '/message/carwash',
            '/message/room',
            '/message/clinic',
            '/rule/public',
            '/rule/gym',
            '/rule/cafe',
            '/rule/carwash',
            '/rule/room',
            '/rule/clinic',
        ],
        exact: true,
        component: ShowMessage,
    },
    {
        path: '/report/reservation',
        exact: true,
        component: ShowReservationReport,
    },
    {
        path: '/:id/setting',
        exact: true,
        component: ShowSettings,
    },
    {
        path: '/:id/history',
        exact: true,
        component: ShowReservationHistory,
    },
    {
        path: [
            '/carwash/new',
            '/saloon/new',
            '/cafe/new',
            '/gym/new',
            '/clinic/new',
        ],
        exact: true,
        component: ShowAddProgramTabs,
    },
    {
        path: [
            '/carwash/get',
            '/saloon/get',
            '/cafe/get',
            '/gym/get',
            '/clinic/get',
        ],
        exact: true,
        component: NextDayReservations,
    },
    {
        path: '/welfared-cluster/new',
        exact: true,
        component: AddWelfareCluster,
    },
    {
        path: '/user/update',
        exact: true,
        component: ShowUpdateUserForms,
    },
    {
        path: '/io',
        exact: true,
        component: Images,
    },
    {
        path: '/signout',
        exact: true,
        component: SignOut,
    },
    {
        path: '/calendar',
        exact: true,
        component: HolidaysCalendar,
    },
    {
        path: '/profile',
        exact: true,
        component: ShowProfileTabs,
    },
    {
        path: '/user/profile',
        exact: true,
        component: ShowProfileTabs,
    },
    {
        path: [
            '/carwash/reservation',
            '/saloon/reservation',
            '/cafe/reservation',
            '/gym/reservation',
        ],
        exact: true,
        component: Reserve,
    },
    {
        path: [
            '/clinic/reservation',
        ],
        exact: true,
        component: ClinicReservation,
    },
    {
        path: [
            '/carwash/gethistory',
            '/saloon/gethistory',
            '/cafe/gethistory',
            '/gym/gethistory',
            '/clinic/gethistory',
        ],
        exact: true,
        component: ShowUserReservationHistory,
    },
    {
        path: [
            '/carwash/calendar',
            '/saloon/calendar',
            '/cafe/calendar',
            '/gym/calendar',
            '/clinic/calendar',
        ],
        exact: true,
        component: ShowCalendar,
    },
    {
        path: [
            '/carwash/rule',
            '/saloon/rule',
            '/cafe/rule',
            '/gym/rule',
            '/clinic/rule',
        ],
        exact: true,
        component: ShowRule,
    },
    // operator
    {
        path: '/operator/gettodayreservation',
        exact: true,
        component: TodayReservations,
    },
    {
        path: '/operator/report',
        exact: true,
        component: ShowReservationReportForOperator,
    },
    // 404
    {
        path: '*',
        // exact: true,
        component: NotFound,
    },
];

export default routes;
