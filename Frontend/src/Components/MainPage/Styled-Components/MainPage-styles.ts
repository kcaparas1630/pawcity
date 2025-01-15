import styled from '@emotion/styled';
import { SidebarMenu, SidebarMenuItem } from '../../ui/sidebar';
const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    width: 100%;
    min-width: 100%;
    max-width: 100%;
    background-color: #e5989b;
    overflow-x: hidden;
`;

const StyledSidebarMenu = styled(SidebarMenu)`
  display: flex;
  flex-direction: column;
  gap: 24px; /* Add 24px gap between items */
  margin-top: 50px;
`;

const StyledSidebarMenuItem = styled(SidebarMenuItem)`
  font-size: 2rem;
  font-weight: 800;

  a {
    transition: color 0.5s ease;
    &:hover {
      color: #e5989b;
    }
  }
`;

const LogoutButton = styled.button`
  position: absolute;
  bottom: 16px;
  left: 16px;
  padding: 10px 20px;
  background-color: #e5989b;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  &:hover {
    background-color: #d17a7a;
  }
`;

export { Container, StyledSidebarMenu, StyledSidebarMenuItem, LogoutButton };
