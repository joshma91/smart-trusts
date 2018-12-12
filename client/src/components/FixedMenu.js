import React from 'react';
import { Container, Menu } from 'semantic-ui-react'

export const FixedMenu = () => (
  <Menu fixed='top' inverted>
      <Container>
        <Menu.Item as='h2' header>
          OpenLaw Smart Trust 
        </Menu.Item>

        <Menu.Item as='a' position="right">By Josh Ma</Menu.Item>
      </Container>
    </Menu>
)

export default FixedMenu;