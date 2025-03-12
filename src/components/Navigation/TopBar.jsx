import Navbar from 'react-bootstrap/Navbar';
import logo from './../../assets/codennectionlogo_white.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import './TopBar.css';

const TopBar = () => {

    return (
        <div className='position-absolute w-100'>
            <Navbar className="justify-content-between">
                <div className='d-flex flex-row'>
                    <img src={logo} className='topbar-logo'/>
                    <span className='topbar-name'>codennections</span>
                    <input type="text" placeholder="Search" className="topbar-search"/>
                </div>
                <div className='d-flex flex-row'>
                    <div className='topbar-notification-round'>
                        <FontAwesomeIcon icon={faBell} className='topbar-notification'/>
                    </div>
                </div>
            </Navbar>
        </div>
    );
}
 
export default TopBar;