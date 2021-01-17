import './main.scss';
import './control.scss';

import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';

import Cook from './Cook/Cook';
import Prep from './Prep/Prep';
import Config from './Config/Config';

function Control() {
  return (
    <Tabs fill defaultActiveKey="cook" id="control-tabs" className="control-tabs">
      <Tab eventKey="cook" title="Cook">
        <Cook />
      </Tab>
      <Tab eventKey="prep" title="Prep">
        <Prep />
      </Tab>
      <Tab eventKey="config" title="Config">
        <Config />
      </Tab>
    </Tabs>
  );
}

export default Control;
