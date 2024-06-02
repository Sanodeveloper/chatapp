import { createBrowserRouter } from 'react-router-dom';
import SignUp from '../components/signUp/SignUp';
import Login from "../components/login/Login"
import Home from '../components/home/Home';
import CreateRoom from "../components/createRoom/CreateRoom";
import RoomDetail from '../components/roomDetail/RoomDetail';
import RoomWrapper from '../components/room/RoomWrapper';

const route = createBrowserRouter([
    { path: '/home', element: <Home /> },
    { path: '/signup', element: <SignUp /> },
    { path: '/login', element:  <Login />},
    { path: '/createRoom', element: <CreateRoom /> },
    { path: '/home/room/detail/:roomId', element: <RoomDetail /> },
    { path: '/room/:roomId', element: <RoomWrapper /> }
]);

export default route;