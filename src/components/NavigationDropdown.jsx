import React from 'react';
import {Avatar, Button, Dropdown, Space} from "antd";
import {useStateContext} from "../contexts/ContextProvider";
import {DownOutlined} from "@ant-design/icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronDown, faRightFromBracket} from "@fortawesome/free-solid-svg-icons";
import {colors} from "../utils/Colors";

const NavigationDropdown = (props) => {

  const {user} = useStateContext();

  const items = [
    {
      label: (
        <span className="font-medium">{user.name}</span>
      ),
      key: '3',
    },
    {
      type: 'divider',
    },
    {
      key: '1',
      label: (
        <div className="flex">
          <FontAwesomeIcon icon={faRightFromBracket} className="pt-2.5" style={{color:colors.primary}}/>
          <Button type="link" onClick={props.handleLogout}>
            Logout
          </Button>
        </div>
      ),
    }
    ];

  return (
    <div className="flex">
      <div>
        <Avatar src={`${process.env.REACT_APP_API_BASE_URL}/files/upload/${user.image.id}`} />
      </div>
      <Dropdown menu={{ items }} trigger={['click']} className="pl-1">
        <a onClick={(e) => e.preventDefault()}>
          <FontAwesomeIcon icon={faChevronDown} style={{fontSize:"16px"}} />
        </a>
      </Dropdown>
    </div>
  );
};

export default NavigationDropdown;
