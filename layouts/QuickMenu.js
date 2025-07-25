'use client';
// import node module libraries
import Link from 'next/link';
import { Fragment, useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { Row, Col, Image, Dropdown, ListGroup } from 'react-bootstrap';

// simple bar scrolling used for notification item scrolling
import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';

// import data files
import NotificationList from 'data/Notification';

// import hooks
import useMounted from 'hooks/useMounted';
import Cookies from 'js-cookie';
import { parseJwt } from 'lib/decodeToken';

const QuickMenu = () => {
  const hasMounted = useMounted();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const token = Cookies.get('token');
    console.log(token);
    if (token) {
      const decoded = parseJwt(token);
      setUserData(decoded);
    }
  }, []);

  console.log(userData);

  const isDesktop = useMediaQuery({
    query: '(min-width: 1224px)',
  });

  const Notifications = () => {
    return (
      <SimpleBar style={{ maxHeight: '300px' }}>
        <ListGroup variant="flush">
          {NotificationList.map(function (item, index) {
            return (
              <ListGroup.Item
                className={index === 0 ? 'bg-light' : ''}
                key={index}
              >
                <Row>
                  <Col>
                    <Link href="#" className="text-muted">
                      <h5 className=" mb-1">{item.sender}</h5>
                      <p className="mb-0"> {item.message}</p>
                    </Link>
                  </Col>
                </Row>
              </ListGroup.Item>
            );
          })}
        </ListGroup>
      </SimpleBar>
    );
  };

  const QuickMenuDesktop = () => {
    return (
      <ListGroup
        as="ul"
        bsPrefix="navbar-nav"
        className="navbar-right-wrap ms-auto d-flex nav-top-wrap"
      >
        <Dropdown as="li" className="ms-2">
          <Dropdown.Toggle
            as="a"
            bsPrefix=" "
            className="rounded-circle"
            id="dropdownUser"
          >
            <div className="avatar avatar-md avatar-indicators avatar-online">
              <Image
                alt="avatar"
                src="/images/avatar/avatar-0.png"
                className="rounded-circle"
              />
            </div>
          </Dropdown.Toggle>
          <Dropdown.Menu
            className="dropdown-menu dropdown-menu-end "
            align="end"
            aria-labelledby="dropdownUser"
            show
          >
            <Dropdown.Item as="div" className="px-4 pb-0 pt-2" bsPrefix=" ">
              <div className="lh-1 ">
                <h5 className="mb-1"> {userData?.email || 'Nama Dinas'}</h5>
                {/* <Link href="#" className="text-inherit fs-6">
                  View my profile
                </Link> */}
              </div>
              <div className=" dropdown-divider mt-3 mb-2"></div>
            </Dropdown.Item>
            {/* <Dropdown.Item eventKey="2">
              <i className="fe fe-user me-2"></i> Edit Profile
            </Dropdown.Item>
            <Dropdown.Item eventKey="3">
              <i className="fe fe-activity me-2"></i> Activity Log
            </Dropdown.Item>
            <Dropdown.Item className="text-primary">
              <i className="fe fe-star me-2"></i> Go Pro
            </Dropdown.Item>
            <Dropdown.Item>
              <i className="fe fe-settings me-2"></i> Account Settings
            </Dropdown.Item>*/}
            <Dropdown.Item
              onClick={() => {
                Cookies.remove('token');
                window.location.href = '/sign-in';
              }}
            >
              <i className="fe fe-power me-2"></i>Sign Out
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </ListGroup>
    );
  };

  const QuickMenuMobile = () => {
    return (
      <ListGroup
        as="ul"
        bsPrefix="navbar-nav"
        className="navbar-right-wrap ms-auto d-flex nav-top-wrap"
      >
        <Dropdown as="li" className="ms-2">
          <Dropdown.Toggle
            as="a"
            bsPrefix=" "
            className="rounded-circle"
            id="dropdownUser"
          >
            <div className="avatar avatar-md avatar-indicators avatar-online">
              <Image
                alt="avatar"
                src="/images/avatar/avatar-0.png"
                className="rounded-circle"
              />
            </div>
          </Dropdown.Toggle>
          <Dropdown.Menu
            className="dropdown-menu dropdown-menu-end "
            align="end"
            aria-labelledby="dropdownUser"
          >
            <Dropdown.Item as="div" className="px-4 pb-0 pt-2" bsPrefix=" ">
              <div className="lh-1 ">
                <h5 className="mb-1"> {userData?.email || 'Nama Dinas'}</h5>
                {/* <Link href="#" className="text-inherit fs-6">
                  View my profile
                </Link> */}
              </div>
              <div className=" dropdown-divider mt-3 mb-2"></div>
            </Dropdown.Item>
            {/* <Dropdown.Item eventKey="2">
              <i className="fe fe-user me-2"></i> Edit Profile
            </Dropdown.Item>
            <Dropdown.Item eventKey="3">
              <i className="fe fe-activity me-2"></i> Activity Log
            </Dropdown.Item>
            <Dropdown.Item className="text-primary">
              <i className="fe fe-star me-2"></i> Go Pro
            </Dropdown.Item>
            <Dropdown.Item>
              <i className="fe fe-settings me-2"></i> Account Settings
            </Dropdown.Item> */}
            <Dropdown.Item
              onClick={() => {
                Cookies.remove('token');
                window.location.href = '/sign-in';
              }}
            >
              <i className="fe fe-power me-2"></i>Sign Out
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </ListGroup>
    );
  };

  return (
    <Fragment>
      {hasMounted && isDesktop ? <QuickMenuDesktop /> : <QuickMenuMobile />}
    </Fragment>
  );
};

export default QuickMenu;
