import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import './Logout.css'

export const Logout = () => {
  return (
    <div className="d-flex p-2 flex-row-reverse">
      <div className="topbar-logout-round">
        <FontAwesomeIcon
          icon={faArrowRightFromBracket}
          className="topbar-notification"
        />
      </div> 
    </div>
  );
};
