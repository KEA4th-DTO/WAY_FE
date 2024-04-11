import React from 'react';
import { Row, Col, CardTitle, Button, CardSubtitle, Card } from 'reactstrap';
import ComponentCard from '../components/ComponentCard';


const Chatting= () => {
  const features = [
    {
      title: 'Support',
      desc: 'Premium customer support from the actual people who have created.',
      icon: 'bi-person-check',
    },
  ];
  return (
    <Row>
      <Col>
       
        <Card>
          <CardTitle tag="h6" className="border-bottom p-3 mb-0">
            <i className="bi bi-bell me-2"> </i>
            About Xtreme React
          </CardTitle>

          <Row className='d-flex'>
            <Col lg="8">
              <div className="mt-5">
                <ComponentCard
                  title="Xtreme React Admin Pro Version"
                  subtitle={
                    <h5>
                      5 premium and highly customizable demo variations included in the package, with React
                      Router 6, Redux Toolkit, Axios nd much more...
                    </h5>
                  }
                >
                  {/* <Image src='https://www.wrappixel.com/wp-content/uploads/edd/2020/04/xtreme-react-admin-template-y.jpg' alt='pro version image' className='mt-2'/> */}
                  {/* <img src='https://www.wrappixel.com/wp-content/uploads/edd/2020/04/xtreme-react-admin-template-y.jpg' alt='pro version image' className='mt-2' /> */}

                  <img src={`https://www.wrappixel.com/wp-content/uploads/edd/2020/04/xtreme-react-admin-template-y.jpg`} alt="pro version" className="w-100"/>

                  <div className="mt-3">
                    <Button
                      color="primary"
                      href="https://www.wrappixel.com/templates/xtreme-react-redux-admin/?ref=33"
                      target="_blank"
                    >
                      Check Pro Version
                    </Button>
                  </div>
                </ComponentCard>
              </div>
            </Col>
          </Row>

        </Card>
      </Col>
    </Row>
  );
};

export default Chatting;
